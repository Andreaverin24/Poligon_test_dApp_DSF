/**
 * @file withHmacHash.js
 * 
 * @description 
 * 🔐 Обёртка для отправки JSON-ответа с хешом целостности (HMAC-SHA256 или SHA256) в заголовке `x-response-hash`
 * и типом алгоритма в заголовке `x-hash-algorithm`.
 * 
 * Используется для обеспечения целостности данных между сервером и клиентом.
 * Клиент может проверить, что JSON-ответ не был подменён или изменён прокси, CDN, MITM и т.д.
 * 
 * 🔐 Поддерживает:
 * - HMAC-SHA256 (если задан `secret`)
 * - SHA256 (если `secret === null`)
 * - Устанавливает заголовок: x-response-hash
 * - Логирует ошибки через WatchDog (`safeSendMessage`)
 * 
 * 🔐 Поддерживает:
 * - HMAC-SHA256 (если задан `secret`)
 * - SHA256 (если `secret === null`)
 * - Устанавливает заголовок: x-response-hash
 *
 * 📦 Примеры использования:
 *
 * import { withHmacHash } from './utils/withHmacHash.js';
 *
 * // Использование с секретом (по умолчанию из process.env)
 * app.get('/api/data', (req, res) => {
 *   const data = { status: 'ok', value: 42 };
 *   withHmacHash(req, res, data);
 * });
 *
 * // Использование без секрета (SHA256)
 * app.get('/api/public', (req, res) => {
 *   const data = { public: true };
 *   withHmacHash(req, res, data, null);
 * });
 */

import crypto from 'crypto';
import { safeSendMessage } from './bots/telegramBotWatchDog.mjs';

/**
 * Считает HMAC-SHA256 хеш от тела ответа
 * @param {Object} body - объект, который будет отправлен в JSON
 * @param {string} secret - если null → SHA256, иначе HMAC
 * @returns {string} - { hash, algorithm }
 */
function computeResponseHash(body, secret) {
    const jsonString = JSON.stringify(body);

    if (secret === null) {
        return {
        hash: crypto.createHash('sha256').update(jsonString).digest('hex'),
        algorithm: 'sha256',
        };
    }

    if (!secret || typeof secret !== 'string') {
        throw new Error(`❌ Недопустимый секрет : ${secret}`);
    }

    return {
        hash: crypto.createHmac('sha256', secret).update(jsonString).digest('hex'),
        algorithm: 'hmac-sha256',
    };
}

/**
 * Отправляет JSON с заголовками:
 * - `x-response-hash` — значение хеша
 * - `x-hash-algorithm` — тип алгоритма (`sha256` или `hmac-sha256`)
 * 
 * @param {Object} req - Express Request (не используется, но может пригодиться)
 * @param {Object} res - Express Response
 * @param {Object} data - JSON-объект, который будет отправлен
 * @param {string} [secret] - секрет (по умолчанию из env, null = SHA256)
 */
export function withHmacHash(req, res, data, secret = process.env.HMAC_SECRET ?? null) {
    try {
        const { hash, algorithm } = computeResponseHash(data, secret);
        res.set('x-response-hash', hash);
        res.set('x-hash-algorithm', algorithm);
        res.json(data);
    } catch (error) {
        safeSendMessage(
        `withHmacHash|${error.message}`,              // ключ для deduplication
        `❌ withHmacHash: ошибка при хешировании :\n${error.stack || error.message}` // само сообщение
        );
        res.status(500).json({
        error: 'Internal Server Error',
        reason: 'Hash generation failed'
        });
    }
}