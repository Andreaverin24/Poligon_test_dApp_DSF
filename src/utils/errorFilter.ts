// utils/errorFilter.ts

/**
 * Checks if the error message is known and insignificant
 * (such errors are ignored and not sent to the log).
 */
export function isIgnorableError(message: string): boolean {
    const ignoredPatterns = [
        // Often from layout systems and UI browsers
        'ResizeObserver loop',
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed',

        // Wallet and browser extensions
        'Cannot redefine property: ethereum',
        'chrome-extension://',
        'Failed to fetch dynamically imported module',
        'NetworkError when attempting to fetch resource',

        // Bot/scanners (e.g. Google/YandexBot, Baidu, etc.)
        'TypeError: Failed to fetch dynamically imported module',

        // Specific errors from iframe, service worker, etc.
        'Blocked a frame with origin',
        'ServiceWorkerContainer',
        'The script has an unsupported MIME type',
        'unexpected token <',

        // Errors from old/non-standard engines
        'Object doesn’t support property or method',
        'Unexpected token',
    ];
  
    return ignoredPatterns.some((pattern) => message.includes(pattern));
}
