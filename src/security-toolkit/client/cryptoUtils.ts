/**
 * @file cryptoUtils.ts
 * 
 * @description 
 * Утилита для преобразования бинарных данных (ArrayBuffer) в hex-строку.
 * Используется для отображения или передачи хешей и HMAC-подписей в текстовом виде.
 */

/**
 * 🔧 Преобразует ArrayBuffer в hex-строку.
 *
 * Используется для отображения бинарных данных (SHA-256, HMAC-подпись и др.)
 * в человекочитаемом и передаваемом формате (например, для HTTP-заголовков).
 *
 * Пример:
 *   bufferToHex(new Uint8Array([160, 255]).buffer) → 'a0ff'
 *
 * @param buffer - Входной ArrayBuffer, например, результат работы Web Crypto API
 * @returns Строка в hex-формате (например: "a0ffbc11...")
 */
export function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}