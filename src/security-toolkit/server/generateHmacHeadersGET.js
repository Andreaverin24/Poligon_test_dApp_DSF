/**
 * @file generateHmacHeadersGET.js
 *
 * @description
 * 🔐 Формирует заголовки для защищённого GET-запроса (или запроса с query-параметрами).
 *
 * ✅ x-wallet — адрес кошелька или ID
 * ✅ x-timestamp — текущее время (в секундах)
 * ✅ x-signature — HMAC-SHA256(`${timestamp}:${wallet}`, secret)
 * 
 * Используется на стороне сервера (Node.js)
 */

import crypto from 'crypto';

/**
 * Генерирует HMAC-заголовки для GET-запроса.
 *
 * Алгоритм:
 * 1. Формируется строка `${timestamp}:${wallet}`
 * 2. Подписывается через HMAC_SHA256 с использованием общего секрета
 * 3. Возвращается объект:
 *    - `x-wallet` — адрес кошелька
 *    - `x-timestamp` — UNIX timestamp в секундах
 *    - `x-signature` — HMAC-подпись
 *
 * @param {string} wallet — адрес кошелька
 * @param {string} sharedSecret — общий секрет
 * @returns {{ [key: string]: string }} — объект с заголовками
 */
export function generateHmacHeadersGET(wallet, sharedSecret) {
    if (!wallet || typeof wallet !== 'string') {
        throw new Error('Invalid wallet address');
    }
    if (!sharedSecret || typeof sharedSecret !== 'string') {
        throw new Error('Missing or invalid shared secret');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp}:${wallet}`;
    const signature = crypto
        .createHmac('sha256', sharedSecret)
        .update(message)
        .digest('hex');

    return {
        'x-timestamp': timestamp.toString(),
        'x-wallet': wallet,
        'x-signature': signature,
    };
}