// index.tsx

import React, { Component, ErrorInfo } from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";

import { mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { createAppKit } from "@reown/appkit/react";
import SplashScreen from "./components/SplashScreen";
import { WalletStatusProvider } from "./context/WalletStatusContext";
import { NotificationProvider } from "./routes/notifications/NotificationContext";
import { wagmiAdapter } from "./wagmi/config";

import * as buffer from "buffer";
import "./i18n";
import "./index.css";

// components
import RequireWallet from "./components/RequireWallet";
import DashboardPage from "./routes/DashboardPage";
import DepositOnePage from "./routes/DepositOnePage";
import ErrorPage from "./routes/ErrorPage";
import Layout from "./routes/Layout";
import SwapOnePage from "./routes/SwapOnePage";
import TransactionsStatisticsPage from "./routes/TransactionsStatisticsPage";
import WithdrawalOnePage from "./routes/WithdrawalOnePage";
import { isIgnorableError } from "./utils/errorFilter";
import Logger from "./utils/logger";

import BackgroundTuner from "./components/BackgroundTuner";
import "./components/styles/background3d.css";

const APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN;

declare global {
    interface Window {
        Buffer?: typeof buffer.Buffer;
    }
}

//-----------------------------------------------------------
// Block file:// launch
if (window.location.protocol === "file:") {
    alert(
        `⚠️ You have opened the site locally. You will be redirected to ${APP_DOMAIN}`
    );
    window.location.href = APP_DOMAIN;
}

// Checking offline mode
if (!navigator.onLine) {
    alert("⚠️ You are offline. Some site functions may not work.");
}

// 🛡️ Window.ethereum spoofing protection
if (window.ethereum) {
    try {
        Object.defineProperty(window, "ethereum", {
            configurable: false,
            writable: false,
            value: window.ethereum,
        });
        console.log("🔒 ethereum is overwrite protected");
    } catch (err) {
        console.warn("❌ Failed to protect window.ethereum:", err);
    }
}

// 🧩 We catch attempts to spoof window.ethereum
const originalDefine = Object.defineProperty;
Object.defineProperty = function (obj, prop, descriptor) {
    if (obj === window && prop === "ethereum") {
        console.error("🚨 Attempt to spoof window.ethereum!", descriptor);
        Logger.logError(new Error("Attempted substitution ethereum"));
    }
    return originalDefine(obj, prop, descriptor);
};

// 🧱 Host check
const appHost = new URL(APP_DOMAIN).hostname;

if (window.location.hostname !== appHost) {
    alert("Attention! You have opened a fake website. We redirect...");
    window.location.href = APP_DOMAIN;
}
//-----------------------------------------------------------

// 🧠 Init
Logger.initGlobalErrorHandler();
window.Buffer = buffer.Buffer;

// 🚫 Filter noisy browser errors
window.onerror = (message, source, lineno, colno, error) => {
    const msg = message?.toString() ?? "";

    if (isIgnorableError(msg)) {
        console.warn(`🛑 Ignored known error: ${msg}`);
        return true;
    }

    Logger.logError(error || new Error(msg));
};

window.addEventListener("unhandledrejection", (event) => {
    if (
        event.reason?.message?.includes(
            "Connection interrupted while trying to subscribe"
        )
    ) {
        console.warn("⛔ WebSocket connection interrupted, ignoring...");
        event.preventDefault();
    }
});

window.onunhandledrejection = (event) => {
    const msg = event.reason?.message || "";

    if (
        msg.includes("ResizeObserver loop completed") ||
        msg.includes("ResizeObserver loop limit exceeded") ||
        msg.includes("Connection interrupted while trying to subscribe")
    ) {
        event.preventDefault();
        return;
    }

    Logger.logError(event.reason);
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <RequireWallet>
                <Layout />
            </RequireWallet>
        ),
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Navigate to="/deposit" replace /> },
            { path: "deposit/:customPart?", element: <DepositOnePage /> },
            { path: "withdraw", element: <WithdrawalOnePage /> },
            { path: "swap", element: <SwapOnePage /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "transactions", element: <TransactionsStatisticsPage /> },
            { path: "/*", element: <Navigate to="/deposit" replace /> },
        ],
    },
]);

// ⚙️ AppKit Init
const projectId = import.meta.env.VITE_WEB3_MODAL_PROJECT_ID || "";

createAppKit({
    projectId,
    adapters: [wagmiAdapter],
    networks: [mainnet],
    metadata: {
        name: "DSF.Finance",
        description:
            "Decentralized Application of DSF. Earn, borrow and profit share with DSF.",
        url: APP_DOMAIN,
        icons: [`${APP_DOMAIN}/logo.svg`],
    },
});

const queryClient = new QueryClient();

// 🧹 Cache bust if app version changed
const currentVersion = localStorage.getItem("app_version");
if (currentVersion !== import.meta.env.APP_VERSION) {
    if ("caches" in window) {
        caches.keys().then((names) => {
            names.forEach((name) => {
                caches.delete(name);
            });
        });
    }
    localStorage.setItem("app_version", import.meta.env.APP_VERSION);
}

class ErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        Logger.logError(error, errorInfo.componentStack ?? undefined);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong</h1>;
        }
        return this.props.children;
    }
}

const RootApp = () => {
    return (
        <>
            {/* <BackgroundCanvas /> */}
            <BackgroundTuner />
            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <WalletStatusProvider>
                        <NotificationProvider>
                            <ErrorBoundary>
                                <SplashScreen />
                                <RouterProvider router={router} />
                            </ErrorBoundary>
                        </NotificationProvider>
                    </WalletStatusProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </>
    );
};

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <RootApp />
    </React.StrictMode>
);
