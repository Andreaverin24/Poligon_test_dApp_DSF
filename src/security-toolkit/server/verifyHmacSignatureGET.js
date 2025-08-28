/**
 * @file verifyHmacSignatureGET.js
 * 
 * @description Верификация HMAC-подписи для GET-запросов с query или заголовками.
 * 
 * Проверяет:
 * ✅ Своевременность (`x-timestamp`)
 * ✅ Подлинность клиента (`x-signature`)
 * 
 * Алгоритм подписи на клиенте:
 *   HMAC_SHA256(`${timestamp}:${wallet}`, sharedSecret)
 * 
 * Используется для проверки подлинности клиента на основе:
 * - x-wallet — адрес кошелька
 * - x-timestamp — время генерации подписи
 * - x-signature — подпись HMAC_SHA256(timestamp:wallet, secret)
 *
 * 🧾 Требования:
 * ✅ Максимальное допустимое расхождение по времени — 10 минут
 * ✅ Все заголовки должны быть обязательны
 * ✅ Подпись должна быть точным совпадением
 * ✅ При ошибке — логируем в Telegram через WatchDog (safeSendMessage)
 */

import crypto from 'crypto';
import { safeSendMessage } from './bots/telegramBotWatchDog.mjs';

/**
 * Проверка HMAC-подписи из query-запроса или заголовков
 *
 * @param {import('express').Request} req — HTTP-запрос Express
 * @param {string} sharedSecret — Секретный ключ (shared между клиентом и сервером)
 * @returns {boolean} — true, если подпись валидна
 */
export function verifyHmacSignatureGET(req, sharedSecret) {
  try {
    const timestamp = parseInt(req.headers['x-timestamp'], 10);
    const wallet = req.headers['x-wallet'];
    const signature = req.headers['x-signature'];
    const hashHMAC = crypto.createHash('md5').update(`${req.ip}:${wallet ?? '❓'}`).digest('hex').slice(0, 8);
    
    if (!timestamp || !wallet || !signature) {
      safeSendMessage(
        `hmac-query|missing|${hashHMAC}|${req.ip.slice(-6)}`,
        `🚫 Отсутствуют HMAC-заголовки:
- wallet: ${wallet ?? '❓'}
- ip: ${req.ip}
- url: ${req.originalUrl}
- user-agent: ${req.headers['user-agent'] ?? '❌ UA не указан'}
- referer: ${req.headers['referer'] ?? '—'}
- x-forwarded-for: ${req.headers['x-forwarded-for'] ?? '—'}
- time: ${new Date().toISOString()}`
      );      
      console.warn('[verifyHmacSignatureQuery] ❌ Отсутствуют обязательные заголовки');
      return false;
    }

    if (!sharedSecret || typeof sharedSecret !== 'string' || sharedSecret.length < 10) {
      safeSendMessage(
        `hmac-query|sharedSecretMissing|${hashHMAC}|${req.ip.slice(-6)}`,
        `❗ sharedSecret не задан или некорректен:
- wallet: ${wallet}
- ip: ${req.ip}
- url: ${req.originalUrl}
- user-agent: ${req.headers['user-agent'] ?? '❌ UA не указан'}
- referer: ${req.headers['referer'] ?? '—'}
- x-forwarded-for: ${req.headers['x-forwarded-for'] ?? '—'}
- time: ${new Date().toISOString()}`
      );
      console.error('[verifyHmacSignatureQuery] ❗ sharedSecret отсутствует или некорректен');
      return false;
    }

    // 🔹 Проверка допустимого окна времени (±5 минут) - до 10 минут, но логируем
    const now = Math.floor(Date.now() / 1000); // текущий unixtime в секундах
    const drift = Math.abs(now - timestamp);
    const maxDrift = 300; // 5 минут = 300 секунд

    if (drift > maxDrift) {
      const level = drift < 600 ? '⚠️' : '⛔️'; 
      safeSendMessage(
        `hmac-query|drift|${hashHMAC}|${req.ip.slice(-6)}`,
        `${level} Недопустимое время запроса:
wallet: ${wallet}
расхождение: ${drift} сек
ip: ${req.ip}
originalUrl: ${req.originalUrl}
user-agent: ${req.headers['user-agent']}
timestamp: ${timestamp}
now: ${now}`
      );
      console.warn('[verifyHmacSignatureQuery] ⏰ Недопустимое время запроса');
      return drift < 600;  // разрешить до 10 минут, но логируем
    }

    // Строим строку и рассчитываем HMAC
    const data = `${timestamp}:${wallet}`;
    const expectedSignature = crypto
      .createHmac('sha256', sharedSecret)
      .update(data)
      .digest('hex');

    if (expectedSignature !== signature) {
      safeSendMessage(
        `hmac-query|invalid|${hashHMAC}|${req.ip.slice(-6)}`,
        `⚠️ Неверная HMAC-подпись:
wallet: ${wallet}
ip: ${req.ip}
Ожидалось: ${expectedSignature}
Получено: ${signature}`
      );
      return false;
    }

    return true;
  } catch (error) {
    safeSendMessage(
      `hmac-query|exception|${hashHMAC}|${req.ip.slice(-6)}`,
      `❗ Исключение при валидации HMAC:
${error.message}
wallet: ${req.headers['x-wallet'] ?? '❓'}
ip: ${req.ip}`
    );
    console.error('[verifyHmacSignatureQuery] ❗ Ошибка валидации HMAC-подписи:', error.message);
    return false;
  }
}