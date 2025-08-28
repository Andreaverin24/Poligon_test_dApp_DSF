// hooks/useAutoReconnect.ts

import { useAppKit } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Connector, useAccount, useConnect } from "wagmi";
import { useNotifications } from "../routes/notifications/NotificationContext";

export const useAutoReconnect = (
    connectors: Connector[],
    resetOn?: boolean
) => {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { notify } = useNotifications();
    const { open } = useAppKit();
    const { t } = useTranslation("header");

    const [attempting, setAttempting] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const MAX_ATTEMPTS = 3;

    useEffect(() => {
        const interval = setInterval(async () => {
            console.log("[AutoReconnect]", {
                attemptCount,
                attempting,
                isConnected,
                address,
                connectors: connectors.length,
            });

            if (
                attempting ||
                isConnected ||
                !connectors?.length ||
                attemptCount >= MAX_ATTEMPTS
            ) {
                if (attemptCount >= MAX_ATTEMPTS) {
                    console.warn(
                        "🛑 Max reconnect attempts reached. Stopping auto-reconnect."
                    );
                }
                return;
            }

            const connector = connectors[0];

            if (connector?.ready && !connector.connected) {
                try {
                    setAttempting(true);
                    await connect({ connector });
                    console.log("✅ Wallet silently reconnected");
                } catch (err) {
                    console.warn("❌ Silent reconnect failed", err);
                    setAttemptCount((prev) => prev + 1);
                    notify(
                        t("wallet_disconnected", {
                            defaultValue:
                                "Wallet disconnected. Please reconnect.",
                        }),
                        "warning"
                    );
                    open({ view: "Connect" });
                } finally {
                    setAttempting(false);
                }
            }
        }, 13300);

        return () => clearInterval(interval);
    }, [
        address,
        isConnected,
        connectors,
        connect,
        open,
        notify,
        t,
        attempting,
        attemptCount,
    ]);

    useEffect(() => {
        if (resetOn) {
            console.log("🔁 Reset reconnect attempts triggered");
            setAttemptCount(0);
        }
    }, [resetOn]);
};
