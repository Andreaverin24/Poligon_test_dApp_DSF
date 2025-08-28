/**
 * @file generateHmacHeadersPOST.js
 *
 * @description
 * 🔐 Генерация HMAC-заголовков для защищённого POST-запроса (server-to-server, Node.js).
 *
 * ✅ x-timestamp — текущее время (ISO-8601)
 * ✅ x-body-hash — SHA-256 от тела
 * ✅ x-signature — HMAC-SHA256(`${timestamp}${bodyHash}`, secret)
 */

import crypto from 'crypto';

/**
 * Преобразует буфер в hex-строку
 * @param {Buffer} buffer
 * @returns {string}
 */
function bufferToHex(buffer) {
  return buffer.toString('hex');
}

/**
 * Генерирует заголовки для HMAC-защищённого POST-запроса.
 *
 * @param {object} body - тело запроса (JSON-объект)
 * @param {string} sharedSecret - общий секрет
 * @returns {{ [key: string]: string }}
 */
export function generateHmacHeadersPOST(body, sharedSecret) {
  const timestamp = new Date().toISOString();
  const json = JSON.stringify(body);

  // SHA-256 хеш тела
  const bodyHash = crypto.createHash('sha256').update(json).digest('hex');

  // Подпись HMAC(timestamp + bodyHash)
  const message = `${timestamp}${bodyHash}`;
  const signature = crypto.createHmac('sha256', sharedSecret).update(message).digest('hex');

  return {
    'x-timestamp': timestamp,
    'x-body-hash': bodyHash,
    'x-signature': signature,
  };
}