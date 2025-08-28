/**
 * @file verifyResponseHash.js
 * 
 * @description Проверка целостности ответа сервера по переданному хешу.
 * 
 * 🔐 Поддерживаются два алгоритма:
 * - SHA-256 (по умолчанию)
 * - HMAC-SHA256 (если указан секрет)
 *
 * Используется на сервере для верификации данных, возвращаемых другими API.
 */

import crypto from 'crypto';

/**
 * Преобразует Buffer в hex-строку
 * @param {Buffer} buffer
 * @returns {string}
 */
function bufferToHex(buffer) {
    return buffer.toString('hex');
}

/**
 * Проверка хеша тела ответа
 *
 * @param {string} responseText - Тело ответа (например, JSON)
 * @param {string} expectedHash - Хеш, переданный в заголовке
 * @param {'sha256' | 'hmac-sha256'} algorithm
 * @param {string|null} secret - Ключ для HMAC (обязателен для HMAC-SHA256)
 * @returns {boolean}
 */
export function verifyResponseHash(responseText, expectedHash, algorithm = 'sha256', secret = process.env.HMAC_SECRET || null) {
    if (!responseText || !expectedHash) {
        console.warn('❌ Нет тела или ожидаемого хеша для верификации');
        return false;
    }

    try {
        const data = Buffer.from(responseText, 'utf-8');
        let actualHash;

        if (algorithm.toLowerCase() === 'sha256') {
            const hash = crypto.createHash('sha256').update(data).digest();
            actualHash = bufferToHex(hash);
        } else if (algorithm.toLowerCase() === 'hmac-sha256') {
            if (!secret) {
                console.warn('❌ HMAC-секрет не задан');
                return false;
            }
            const hmac = crypto.createHmac('sha256', secret).update(data).digest();
            actualHash = bufferToHex(hmac);
        } else {
            console.warn(`⚠️ Неизвестный алгоритм хеширования: ${algorithm}`);
            return false;
        }

        return actualHash === expectedHash.toLowerCase();
    } catch (err) {
        console.error(`❌ Ошибка при проверке хеша: ${err.message}`);
        return false;
    }
}

/**
 * Верификация с заголовков и возврат тела
 *
 * @param {Response} response - Ответ fetch/axios (Node Fetch совместимый)
 * @param {string|null} secret
 * @returns {Promise<{ valid: boolean, body: string }>}
 */
export async function verifyResponseFromHeadersWithBody(response, secret = process.env.HMAC_SECRET || null) {
    const expectedHash = response.headers.get('x-response-hash');
    const algorithm = response.headers.get('x-hash-algorithm')?.toLowerCase() || 'sha256';
    const bodyText = await response.text();

    const valid = expectedHash
        ? verifyResponseHash(bodyText, expectedHash, algorithm, secret)
        : false;

    return { valid, body: bodyText };
}
