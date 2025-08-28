/**
 * @file telegramBotWatchDog.mjs
 *
 * @description
 * 🛡️ Telegram WatchDog Bot для DSF.Finance
 *
 * Этот модуль обеспечивает надёжную и безопасную отправку сообщений в Telegram-группу проекта,
 * включая:
 * 
 * ✅ Очередь сообщений с обработкой по одному (rate limit friendly)
 * ✅ Поддержка потоков (threads) в супергруппе
 * ✅ Режим без потоков (если TELEGRAM_THREAD_URL_ERRORS === 'none')
 * ✅ Защита от повторной отправки (deduplication через NodeCache + hash)
 * ✅ Автоматическая обрезка слишком длинных сообщений (4096 символов)
 * ✅ Глобальный лимит на количество сообщений (по умолчанию — 5 за 10 секунд)
 * ✅ Полноценная обработка ошибок Telegram API (429, timeouts и т.д.)
 * ✅ Переменная QUIET_MODE позволяет полностью отключить отправку
 *
 * 🔧 Подходит для:
 * - логирования ошибок (ошибки API, контракта, прокси, запросов)
 * - мониторинга Honeypot-ловушек
 * - отправки системных алертов и событий
 *
 * 📌 Для использования:
 * import { sendMessageToChat, safeSendMessage } from './bots/telegramBotWatchDog.mjs';
 *
 * Пример:
 * await safeSendMessage('error|0x123...', '🚨 Ошибка в контракте', process.env.TELEGRAM_THREAD_CONTRACT_ERRORS);
 *
 * @env TELEGRAM_BOT_TOKEN_WD        — токен бота
 * @env TELEGRAM_SUPERGROUP_ID       — ID супергруппы
 * @env TELEGRAM_THREAD_WD_ERRORS    — дефолтный поток или "none" для отключения
 * @env TELEGRAM_GLOBAL_RATE         — лимит сообщений за 10 сек (по умолчанию: 5)
 * @env QUIET_MODE                   — если true, сообщения не отправляются
 */

// 📦 Импорты и переменные окружения
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import crypto from 'crypto';

dotenv.config();

// 🔐 Telegram настройки
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_WD;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_SUPERGROUP_ID;
const TELEGRAM_THREAD_DEFAULT = process.env.TELEGRAM_THREAD_WD_ERRORS;
const TELEGRAM_GLOBAL_RATE = parseInt(process.env.TELEGRAM_GLOBAL_RATE || '5'); // максимум 5
const QUIET_MODE = process.env.QUIET_MODE === 'true';
const TELEGRAM_MAX_LENGTH = 4096;

/**
 * 🛡️ Telegram deduplication кэш
 * Используется для защиты от повторной отправки одинаковых сообщений
 * (например, ошибок или алертов), TTL — 10 секунд.
 */
const telegramLimiter = new NodeCache({ stdTTL: 10 }); // 10 секунд

/**
 * 📨 Очередь исходящих сообщений для последовательной отправки.
 * Позволяет избежать спайков и ошибок "Too Many Requests".
 */
const messageQueue = [];

/**
 * 🔄 Глобальный счётчик отправленных сообщений за текущее окно (10 сек)
 */
let telegramGlobalCount = 0;

/**
 * ⏳ Флаг активности обработчика очереди
 */
let isProcessingQueue = false;

/**
 * ⏱️ Сбрасываем глобальный лимит каждые 10 секунд (rolling window)
 */
setInterval(() => telegramGlobalCount = 0, 10_000);

// 🤖 Telegram-бот
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

/**
 * 🧠 Безопасная отправка сообщения с защитой от дубликатов
 *
 * Хеширует ключ сообщения (например, "error|0xabc123") и предотвращает повторную отправку
 * одного и того же сообщения в течение короткого интервала.
 *
 * @param {string} key — Уникальный смысловой ключ сообщения (будет хеширован)
 * @param {string} message — Текст сообщения
 * @param {string|null} threadId — ID потока Telegram (если null — будет выбран дефолт)
 */
export async function safeSendMessage(key, message, threadId = null) {
    const hash = crypto.createHash('sha256').update(key).digest('hex').slice(0, 12);
    const dedupKey = `msg_${hash}`;
    if (!telegramLimiter.has(dedupKey)) {
        telegramLimiter.set(dedupKey, true);
        await sendMessageToChat(message, threadId);
    } else {
        console.warn(`🚧 Telegram flood protection: duplicate for key "${dedupKey}"`);
    }
}

/**
 * 📬 Основная функция отправки сообщений в Telegram.
 * Добавляет сообщение в очередь и инициирует обработку (если ещё не запущена).
 *
 * @param {string} message — Текст сообщения (может быть усечён до 4096 символов)
 * @param {string|null} threadId — ID потока Telegram (или дефолтный)
 */
export async function sendMessageToChat(message, threadId = null) {
    if (QUIET_MODE) {
        console.warn(`📴 QUIET_MODE включен — Telegram сообщение не отправлено`);
        return;
    }

    if (telegramGlobalCount >= TELEGRAM_GLOBAL_RATE) {
        console.warn(`🚧 Глобальный лимит Telegram достигнут — сообщение не отправлено`);
        return;
    }
    
    messageQueue.push({ message, threadId });

    if (!isProcessingQueue) {
        processQueue();  // запускаем без await, обрабатывается фоном
    }
}

/**
 * 🕹️ Обработка очереди сообщений (FIFO).
 * Следит за Telegram rate-limit (1600 мс), безопасно отсылает в поток и логирует результат.
 *
 * @private
 */
async function processQueue() {
    isProcessingQueue = true;

    while (messageQueue.length > 0) {
        const { message, threadId } = messageQueue.shift();
        const finalThreadId = threadId ?? TELEGRAM_THREAD_DEFAULT;

        // Усечение, если сообщение превышает лимит Telegram
        const safeMessage = message.length > TELEGRAM_MAX_LENGTH
            ? message.slice(0, TELEGRAM_MAX_LENGTH - 3) + '...'
            : message;
        
        try {
            const options = {};
            if (finalThreadId && finalThreadId !== 'none') {
                options.message_thread_id = Number(finalThreadId);
            }

            await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, safeMessage, options);
            telegramGlobalCount++; // увеличиваем счётчик после успешной отправки
            console.log(`✅ Message sent to thread ${finalThreadId} : ${message}`);
        } catch (error) {
            console.error(`[WatchDogBot] ❌ Ошибка при отправке сообщения : ${error.message}`);

            if (error.response?.status === 429 && error.response.data?.parameters?.retry_after) {
                const waitMs = error.response.data.parameters.retry_after * 1000;
                console.warn(`⏳ Telegram rate-limit. Ожидание ${waitMs} мс`);
                await delay(waitMs);
            } else if (error.response) {
                console.error(`[WatchDogBot] 📡 Telegram response`, {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data,
                });
            } else if (error.request) {
                console.error(`[WatchDogBot] ⚠️ Нет ответа от Telegram API`, {
                    request: error.request,
                });
            } else {
                console.error(`[WatchDogBot] ⚠️ Неизвестная ошибка`, {
                    error: error.stack || error.message || error,
                });
            }
        }

        await delay(1600); // минимальная пауза между отправками
    }

    isProcessingQueue = false;
}

/**
 * ⏳ Promise-обёртка для асинхронной задержки
 * @param {number} ms — Время ожидания в миллисекундах
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}