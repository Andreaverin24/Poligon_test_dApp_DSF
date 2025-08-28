/**
 * @file generateHmacHeadersPOST.ts
 * 
 * @description 
 * 🔐 Формирует набор заголовков для защищённого POST-запроса.
 *
 * Использует Web Crypto API — встроенный, безопасный и рекомендованный способ для браузера.
 *
 * Гарантирует:
 * ✅ Целостность тела запроса (`x-body-hash`)
 * ✅ Своевременность (`x-timestamp`)
 * ✅ Подлинность клиента (`x-signature`)
 * ✅ Уникальность запроса (`x-nonce`)
 *
 * Алгоритм:
 *   1. SHA-256 от JSON тела → `x-body-hash`
 *   2. HMAC_SHA256(timestamp + hash, secret) → `x-signature`
 */

import { bufferToHex } from './cryptoUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Генерирует HMAC-заголовки для POST-запроса.
 *
 * @param {object} body - Тело запроса (будет сериализовано через JSON.stringify)
 * @param {string} sharedSecret - Секретный ключ (shared между клиентом и сервером)
 * @returns {{ [key: string]: string }} — объект с 3 заголовками
 */
export async function generateHmacHeadersPOST(
    body: object,
    sharedSecret: string
): Promise<Record<string, string>> {
    const timestamp = new Date().toISOString();
    const json = JSON.stringify(body);
    const encoder = new TextEncoder();
    const nonce = uuidv4(); // 📛 уникальность
    
    // SHA-256 хеш тела
    const bodyData = encoder.encode(json);
    const bodyHashBuffer = await crypto.subtle.digest('SHA-256', bodyData);
    const bodyHash = bufferToHex(bodyHashBuffer);

    // Импорт секрета
    const secretKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(sharedSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // Подпись: HMAC(timestamp + hash)
    const toSign = encoder.encode(`${timestamp}:${bodyHash}:${nonce}`);
    const signatureBuffer = await crypto.subtle.sign('HMAC', secretKey, toSign);
    const signature = bufferToHex(signatureBuffer);

    return {
        'x-timestamp': timestamp,
        'x-nonce': nonce,
        'x-body-hash': bodyHash,
        'x-signature': signature,
    };
}
