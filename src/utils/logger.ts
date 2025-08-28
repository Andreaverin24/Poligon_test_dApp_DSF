// logger.ts

import { generateHmacHeadersPOST } from '../security-toolkit/client/generateHmacHeadersPOST';

type StableType = 'USDT' | 'USDC' | 'DAI';
             
type UserContext = {
    address?: string;
    networkId?: number;
    walletName?: string;
    tokenBalances?: Record<StableType, string>;
    tokenAllowances?: Record<StableType, string>;
    ethBalance?: string;
    deviceInfo: {
        userAgent: string;
        language: string;
        platform: string;
        screenResolution: string;
        timeZone: string;
        deviceMemory?: number;
        hardwareConcurrency?: number;
        cookiesEnabled: boolean;
        doNotTrack?: string | null;
        connectionType?: string;
    };
    browserInfo: {
        vendor: string;
        version: string;
        languages: readonly string[];
        onLine: boolean;
        pdfViewerEnabled: boolean;
    };
    appInfo: {
        url: string;
        pathname: string;
        referrer: string;
        previousUrl?: string;
        timestamp: string;
        appVersion: string;
        protocol: string;
        offlineMode: boolean;
    };
};

type WarningPattern = RegExp | string;

const getOS = (): string => {
    const userAgent = navigator.userAgent || '';
    if (/windows phone/i.test(userAgent)) return "Windows Phone";
    if (/win/i.test(userAgent)) return "Windows";
    if (/mac/i.test(userAgent)) return "macOS";
    if (/linux/i.test(userAgent)) return "Linux";
    if (/android/i.test(userAgent)) return "Android";
    if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
    return "Unknown";
  };

class Logger {
    private static endpoint = `https://watchdog.dsf.finance/proxy/logger-error`;
    private static sessionEndpoint = `https://watchdog.dsf.finance/proxy/logger-session`;
    private static PUBLIC_SECRET = import.meta.env.VITE_DSF_PUBLIC_SECRET || '';
    private static HMAC_SECRET = import.meta.env.VITE_DSF_HMAC_SECRET || '';
    private static source = window.location.hostname;

    private static ignoredWarnings: WarningPattern[] = [
        /Each child in a list should have a unique "key" prop/,
        "Warning: ReactDOM.render is no longer supported",
        "Warning: Cannot update during an existing state transition",
        /Warning: React does not recognize the.*prop/,
        "DSF: Wrong out lp Ratio",
        'The contract function "calcLpRatioSafe" reverted with the following reason:',
        'Address "null" is invalid.',
        /ContractFunctionExecutionError.*DSF: Wrong out lp Ratio/,
        'Cannot convert null to a BigInt',
        'Address "undefined" is invalid.'
    ];
    private static isInitialized = false;
    private static originalConsoleError = console.error;
    private static userContext: UserContext | null = null;
    private static sessionLogged = false;
    
    // Repository for identifying submitted errors
    private static sentErrors = new Map<string, {
        timestamp: number;
        count: number;
    }>();
    
    private static errorCooldown = 3600000; // 1 hour - // Time in milliseconds during which duplicate errors are ignored
    private static maxErrorCount = 1; // Maximum number of identical errors sent during cooldown period

    static setUserContext(context: Partial<UserContext>) {
        Logger.userContext = {
            ...Logger.userContext,
            ...context
        } as UserContext;
        
        // We check if the address is in the updated context and send logs about the start of the session
        if (Logger.userContext?.address && !Logger.sessionLogged) {
            Logger.sessionLogged = true;
            setTimeout(() => {
                Logger.logSessionStart();
            }, 10000);
        }
    }   

    private static async collectBrowserData(): Promise<UserContext> {
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const nav = navigator as Navigator & {
            userAgentData?: any;
            deviceMemory?: number;
            hardwareConcurrency?: number;
            connection?: { effectiveType: string };
            pdfViewerEnabled?: boolean;
        };

        // Fallback
        let vendor = nav.vendor || 'Unknown';
        let version = nav.userAgent;
        let platform = getOS();

        if (nav.userAgentData) {
            try {
              const highEntropy = await nav.userAgentData.getHighEntropyValues([
                "architecture",
                "model",
                "platform",
                "platformVersion",
                "uaFullVersion",
                "bitness",
                "fullVersionList",
              ]);
        
              vendor = highEntropy.fullVersionList?.[0]?.brand || vendor;              
              version = highEntropy.uaFullVersion || version;
              platform = `${highEntropy.platform} ${highEntropy.platformVersion}`;
            } catch (e) {
              console.warn('Failed to get high-entropy userAgentData:', e);
            }
        }

        return {
            deviceInfo: {
                userAgent: nav.userAgent,
                language: nav.language,
                platform,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                deviceMemory: nav.deviceMemory,
                hardwareConcurrency: nav.hardwareConcurrency,
                cookiesEnabled: nav.cookieEnabled,
                doNotTrack: nav.doNotTrack,
                connectionType: nav.connection?.effectiveType
            },
            browserInfo: {
                vendor,
                version,
                languages: nav.languages,
                onLine: nav.onLine,
                pdfViewerEnabled: nav.pdfViewerEnabled ?? false
            },
            appInfo: {
                url: window.location.href,
                pathname: window.location.pathname,
                referrer: document.referrer,
                previousUrl: navEntry?.type === "reload" ? document.referrer : undefined,
                timestamp: new Date().toISOString(),
                appVersion: import.meta.env.APP_VERSION || 'unknown',
                protocol: window.location.protocol,
                offlineMode: !navigator.onLine
            }
        };
    }

    // Logs the start of a user session if the address is available
    static async logSessionStart() {
        if (!Logger.userContext?.address) return;
        Logger.sessionLogged = true;
        
        const browserData = await Logger.collectBrowserData();
        const contextData = { ...browserData, ...Logger.userContext };
        const body = {
            message: "Session started",
            stack: "none",
            info: `User session started with address: ${Logger.userContext.address}`,
            context: contextData,
            timestamp: new Date().toISOString(),
            type: "session_start",
        };

        const hmacHeaders = await generateHmacHeadersPOST(body, Logger.HMAC_SECRET).catch(e => {
            console.error('Ошибка при генерации подписи HMAC (session):', e);
            return {};
        });
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-proxy-secret": Logger.PUBLIC_SECRET,
            "x-source": Logger.source,
            ...hmacHeaders,
        };

        try {
            await fetch(Logger.sessionEndpoint, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });
        } catch (err) {
            console.error('logError failed:', err);
        }
    } 

    static async logError(error: Error, info?: string, originHint?: string) {
        const messageStr = error.message ?? 'Unknown error';
        const shouldIgnore = Logger.ignoredWarnings.some((pattern) =>
            pattern instanceof RegExp ? pattern.test(messageStr) : messageStr.includes(pattern)
        );

        if (shouldIgnore) return;
        
        // Create a unique key for the error
        const errorKey = Logger.createErrorKey(error);
        if (!Logger.shouldSendError(errorKey)) return;

        // We collect browser data for every error
        const browserData = await Logger.collectBrowserData();
        const contextData = { ...browserData, ...Logger.userContext };
        const stack = error.stack?.split('\n').slice(0, 10).join('\n') || 'No stack';
        const origin = originHint || error.stack?.split('\n').find(l => l.includes('.ts') || l.includes('.js'))?.trim();
        const body = {
            message: messageStr,
            stack,
            info: [info, origin].filter(Boolean).join(' | ') || 'Unknown origin',
            context: contextData,
            timestamp: new Date().toISOString(),
            type: 'error',
        };
      
        const hmacHeaders = await generateHmacHeadersPOST(body, Logger.HMAC_SECRET).catch(e => {
            console.error('Ошибка при генерации подписи HMAC (error):', e);
            return {};
        });
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-proxy-secret': Logger.PUBLIC_SECRET,
            'x-source': Logger.source,
            ...hmacHeaders,
        };

        try {
            await fetch(Logger.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
        } catch (err) {
            console.error('logError failed:', err);
        }
    }

    static initGlobalErrorHandler() {
        if (Logger.isInitialized) return;

        window.onerror = (message, source, line, col, error) => {
            Logger.logError(error instanceof Error ? error : new Error(String(message)), `Global Error at ${source}:${line}:${col}`);
        };

        window.onunhandledrejection = event => {
            const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
            Logger.logError(error, 'Unhandled Promise Rejection');
        };

        console.error = (...args: any[]) => {
            const error = args[0];
            if (error instanceof Error) Logger.logError(error, "React Error");
            Logger.originalConsoleError.apply(console, args);
        };
        
        // We run periodic Map cleaning with recorded errors every hour
        setInterval(() => Logger.cleanupErrorsMap(), Logger.errorCooldown);
        
        // If we already have an address upon initialization, we immediately send the session log
        if (Logger.userContext?.address && !Logger.sessionLogged) Logger.logSessionStart();

        Logger.isInitialized = true;
    }
    
    // Resetting counters for testing or forcing errors
    static resetErrorTracking() {
        Logger.sentErrors.clear();
        Logger.sessionLogged = false;  // Resetting the session logging flag
    }
    
    // Setting error deduplication settings
    static setErrorDeduplicationConfig(cooldownMs: number, maxCount: number) {
        Logger.errorCooldown = cooldownMs;
        Logger.maxErrorCount = maxCount;
    }

    // Creates a unique key for the error, given the message and the first two stack calls
    private static createErrorKey(error: Error): string {
        // Getting the first two elements of the stack to identify the error context
        const stackLines = error.stack?.split('\n').slice(0, 3).join('') || '';
        // Creating a key based on a message and a simplified stack
        return `${error.message}:${stackLines}`;
    }

    // Checks if the error should be submitted or if it is considered a duplicate
    private static shouldSendError(errorKey: string): boolean {
        const now = Date.now();
        const errorInfo = Logger.sentErrors.get(errorKey);
        
        // If the error has been sent before
        if (errorInfo) {
            const timeSinceLastError = now - errorInfo.timestamp;
            
            if (timeSinceLastError > Logger.errorCooldown) {
                Logger.sentErrors.set(errorKey, { timestamp: now, count: 1 });
                return true;
            }
            
            if (errorInfo.count < Logger.maxErrorCount) {
                Logger.sentErrors.set(errorKey, { 
                    timestamp: now, 
                    count: errorInfo.count + 1 
                });
                return true;
            }
            
            console.log(`Ignored duplicate error (${errorInfo.count}): ${errorKey}`);
            return false;
        }
        
        Logger.sentErrors.set(errorKey, { timestamp: now, count: 1 });
        return true;
    }
    
    // Periodically clearing old error records
    private static cleanupErrorsMap() {
        const now = Date.now();
        // Use Array.from for compatibility with older versions of TypeScript/JavaScript
        Array.from(Logger.sentErrors.keys()).forEach(key => {
            const info = Logger.sentErrors.get(key);
            if (info && now - info.timestamp > Logger.errorCooldown) {
                Logger.sentErrors.delete(key);
            }
        });
    }
}

export default Logger;
