/**
 * @file generateHmacHeadersGET.ts
 * 
 * @description 
 * 🔐 Формирует заголовки для защищённого GET-запроса (или query-based запроса).
 *
 * Гарантирует:
 * ✅ Целостность параметров (`wallet`, `timestamp`)
 * ✅ Подлинность клиента (`x-signature`)
 * ✅ Своевременность (`x-timestamp`)
 * ✅ Уникальность запроса (`x-nonce`)
 */

import { bufferToHex } from './cryptoUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Генерирует HMAC-заголовки для GET-запроса.
 *
 * Алгоритм:
 *   1. Формируется строка `timestamp:wallet`
 *   2. Строка подписывается через HMAC_SHA256 с использованием общего секрета
 *   3. Возвращаются 3 заголовка:
 *      - `x-wallet` — адрес кошелька
 *      - `x-timestamp` — UNIX timestamp в секундах (UTC)
 *      - `x-nonce` — уникальный UUID
 *      - `x-signature` — HMAC-подпись
 *
 * @param {string} wallet — адрес кошелька
 * @param {string} sharedSecret — общий секрет (shared между клиентом и сервером)
 * @returns {{ [key: string]: string }} — заголовки для запроса
 */
export async function generateHmacHeadersGET(
  wallet: string,
  sharedSecret: string
): Promise<Record<string, string>> {
  const timestamp = Math.floor(Date.now() / 1000); // UNIX timestamp в секундах
  const nonce = uuidv4(); // 📛 уникальность
  const encoder = new TextEncoder();
  const message = encoder.encode(`${timestamp}:${wallet}:${nonce}`);

  console.log(`[SIGNATURE] ts: ${timestamp} (${new Date(timestamp * 1000).toISOString()}), nonce: ${nonce}`);


  // 🔐 Импорт секрета
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(sharedSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // ✍️ Подпись строки
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, message);
  const signature = bufferToHex(signatureBuffer);

  return {
    'x-timestamp': timestamp.toString(), 
    'x-wallet': wallet,
    'x-nonce': nonce,
    'x-signature': signature,
  };
}
