/**
 * @file verifyHmacSignaturePOST.js
 * 
 * @description Верификация HMAC-подписи для защищённых POST-запросов.
 *
 * ✅ Целостность тела запроса (`x-body-hash`)
 * ✅ Своевременность (`x-timestamp`, не старше 30 сек)
 * ✅ Подлинность клиента (`x-signature`)
 *
 * 🧾 Требования:
 * ✅ Все заголовки обязательны
 * ✅ Хеш тела должен совпадать
 * ✅ Метка времени не должна быть старше 30 сек
 * ✅ Подпись должна совпадать
 * ✅ При ошибке — лог в Telegram через safeSendMessage
 *
 * Алгоритм подписи на клиенте:
 *   HMAC_SHA256(`${timestamp}${bodyHash}`, sharedSecret)
 *
 * Требуемые заголовки от клиента:
 * ┌──────────────────────┬─────────────────────────────────────────────────────────┐
 * │ x-timestamp          │ ISO-строка времени (например, new Date().toISOString()) │
 * │ x-body-hash          │ SHA-256 хеш от JSON.stringify тела запроса              │
 * │ x-signature          │ HMAC_SHA256(x-timestamp + x-body-hash, SHARED_SECRET)   │
 * └──────────────────────┴─────────────────────────────────────────────────────────┘
 */

import crypto from 'crypto';
import { safeSendMessage } from './bots/telegramBotWatchDog.mjs';

/**
 * Проверка HMAC-подписи и целостности запроса
 *
 * @param {import('express').Request} req — HTTP-запрос Express
 * @param {string} sharedSecret — Секретный ключ (по умолчанию из env)
 * @returns {boolean} true, если подпись валидна и запрос считается безопасным
 */
export function verifyHmacSignaturePOST(req, sharedSecret = process.env.SHARED_SECRET) {
    try {
        const timestamp = req.headers['x-timestamp'];       // Метка времени
        const signature = req.headers['x-signature'];       // HMAC-подпись
        const clientHash = req.headers['x-body-hash'];      // Хеш тела запроса
        const now = Date.now();
    
        // ❌ Проверка: отсутствие обязательных заголовков
        if (!timestamp || !signature || !clientHash) {
            safeSendMessage(
            `hmac-strict|missing`,
            `🚫 Отсутствуют заголовки:\n- x-timestamp: ${timestamp ?? '❓'}\n- x-body-hash: ${clientHash ?? '❓'}\n- x-signature: ${signature ?? '❓'}\nip: ${req.ip}`
            );
            return false;
        }
    
        // 📦 Сериализуем тело и хешируем его на сервере
        const body = JSON.stringify(req.body || {});
        const localHash = crypto.createHash('sha256').update(body).digest('hex');
    
        // ❌ Проверка: целостность тела запроса нарушена
        if (clientHash !== localHash) {
            safeSendMessage(
            `hmac-strict|body-mismatch`,
            `❗ Несовпадение хеша тела:\nОжидалось: ${clientHash}\nВычислено: ${localHash}\nip: ${req.ip}`
            );
            return false;
        }
    
        // ⏱ Проверка: временной сдвиг больше 30 секунд — запрос просрочен
        const ts = new Date(timestamp).getTime();
        const ageMs = Math.abs(now - ts);
        if (isNaN(ts) || ageMs > 30_000) {
            safeSendMessage(
            `hmac-strict|drift`,
            `⏱️ Просроченный запрос:\nРазница: ${Math.round(ageMs / 1000)} сек\nip: ${req.ip}`
            );
            return false;
        }
    
        // ✅ Проверка подписи: timestamp + bodyHash, подписанные общим секретом
        const expectedSignature = crypto
        .createHmac('sha256', sharedSecret)
        .update(timestamp + clientHash)
        .digest('hex');
    
        if (expectedSignature !== signature) {
            safeSendMessage(
            `hmac-strict|invalid`,
            `⚠️ Неверная подпись:\nip: ${req.ip}\nОжидалось: ${expectedSignature}\nПолучено: ${signature}`
            );
            return false;
        }
    
        return true;
    } catch (error) {
        safeSendMessage(
        `hmac-strict|exception`,
        `❗ Исключение при валидации HMAC:\n${error.message}\nip: ${req.ip}`
        );
        console.error('[verifyHmacSignatureStrict] ❗ Ошибка валидации HMAC:', error.message);
        return false;
    }
}