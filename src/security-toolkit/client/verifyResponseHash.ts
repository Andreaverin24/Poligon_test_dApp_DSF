/**
 * @file verifyResponseHash.ts
 * 
 * @description 
 * 🔐 Проверяет целостность ответа от сервера через сравнение SHA-256 или HMAC-SHA256 хеша,
 * переданного в заголовке `x-response-hash`, с пересчитанным хешем на клиенте.
 * Поддерживает два алгоритма: SHA-256 (по умолчанию) и HMAC-SHA256 (если указан `x-hash-algorithm`).
 */

import { bufferToHex } from './cryptoUtils';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * Проверяет хеш ответа сервера, сравнивая с локально вычисленным значением.
 *
 * @param responseText - Тело ответа (например, JSON.stringify(response.data))
 * @param expectedHash - Хеш из заголовка `x-response-hash`
 * @param algorithm - Алгоритм хеширования: 'sha256' или 'hmac-sha256'
 * @param secret - Секретный ключ для HMAC (обязателен, если алгоритм — 'hmac-sha256')
 * @returns `true`, если хеш совпадает, иначе `false`
 */
export async function verifyResponseHash(
    responseText: string,
    expectedHash: string,
    algorithm: string = 'sha256',
    secret: string | null = process.env.HMAC_SECRET ?? null
): Promise<boolean> {
    if (!responseText || !expectedHash) {
        console.warn('❌ No body or hash available for verification');
        return false;
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(responseText);

        if (algorithm.toLowerCase() === 'sha256') {
            if (!window.crypto?.subtle) {
                console.warn('⚠️ Web Crypto API unavailable - SHA256 cannot be verified');
                return false;
            }

            const digest = await window.crypto.subtle.digest('SHA-256', data);
            return bufferToHex(digest) === expectedHash.toLowerCase();
        }

        if (algorithm.toLowerCase() === 'hmac-sha256') {
        if (!secret) {
            console.warn('❌ The secret for HMAC-SHA256 is not set');
            return false;
        }

        const key = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await window.crypto.subtle.sign('HMAC', key, data);
        return bufferToHex(signature) === expectedHash.toLowerCase();
        }

        console.warn(`⚠️ Unknown hashing algorithm : ${algorithm}`);
        return false;
    } catch (err) {
        console.error(`❌ Error during hash verification : ${err}`);
        return false;
    }
}

/**
 * Проверяет хеш в ответе `fetch`, используя тело ответа и заголовки.
 *
 * @param response - Объект Response из fetch
 * @param secret - Секрет для HMAC (если используется HMAC-SHA256)
 * @returns `true`, если хеш совпадает, иначе `false`
 */
export async function verifyResponseFromHeaders(
    response: Response,
    secret: string | null = process.env.HMAC_SECRET ?? null
): Promise<boolean> {
    const expectedHash = response.headers.get('x-response-hash');
    const algorithm = response.headers.get('x-hash-algorithm')?.toLowerCase() || 'sha256';
        
    if (!expectedHash) {
        console.warn('❌ В заголовке отсутствует x-response-hash');
        return false;
    }
    
    const bodyText = await response.text();
    const isValid = await verifyResponseHash(bodyText, expectedHash || '', algorithm, secret);

    return isValid;
}

/**
 * Проверяет хеш и возвращает как валидность, так и тело ответа.
 * Удобно при работе с `fetch`, где нужно сохранить тело для дальнейшего использования.
 *
 * @param response - Объект Response из fetch
 * @param secret - Секрет для HMAC (если используется HMAC-SHA256)
 * @returns `{ valid: boolean, body: string }`
 */
export async function verifyResponseFromHeadersWithBody(
    response: Response,
    secret: string | null = process.env.HMAC_SECRET ?? null
): Promise<{ valid: boolean, body: string }> {
    const expectedHash = response.headers.get('x-response-hash');
    const algorithm = response.headers.get('x-hash-algorithm')?.toLowerCase() || 'sha256';

    const bodyText = await response.text();
    const valid = expectedHash
        ? await verifyResponseHash(bodyText, expectedHash, algorithm, secret)
        : false;

    return { valid, body: bodyText };
}

/**
 * Обёртка над axios.get с проверкой целостности ответа по хешу.
 * Возвращает оригинальный объект AxiosResponse, как если бы вызван был axios.get напрямую.
 *
 * ⚠️ Бросает исключение, если проверка хеша не прошла.
 *
 * @param url - URL запроса
 * @param config - Конфигурация axios (params, headers и т.д.)
 * @param secret - Секрет для HMAC (если используется hmac-sha256)
 * @returns Оригинальный AxiosResponse<T>, если хеш прошёл проверку
 * @throws Error, если хеш не совпадает
 */
export async function axiosGetWithVerification<T = any>(
  url: string,
  config: any = {},
  secret: string | null = process.env.HMAC_SECRET ?? null
): Promise<AxiosResponse<T>> {
  const response = await axios.get<T>(url, config);

  const expectedHash = response.headers['x-response-hash'];
  const algorithm = response.headers['x-hash-algorithm']?.toLowerCase() || 'sha256';

  const bodyText = typeof response.data === 'string'
    ? response.data
    : JSON.stringify(response.data);

  const valid = expectedHash
    ? await verifyResponseHash(bodyText, expectedHash, algorithm, secret)
    : false;

  if (!valid) {
    throw new Error('❌ Response hash verification failed');
  }

  return response; // <- оригинальный формат от axios.get
}
