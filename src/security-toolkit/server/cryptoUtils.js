/**
 * @file cryptoUtils.js
 * 
 * @description
 * Преобразует Buffer или Uint8Array в hex-строку.
 * Используется для HMAC-подписей, SHA-хешей и прочих бинарных данных.
 */

export function bufferToHex(buffer) {
    return Array.from(buffer)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}