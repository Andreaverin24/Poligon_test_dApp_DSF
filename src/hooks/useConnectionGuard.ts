// hooks/useConnectionGuard.ts

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useDisconnect } from "wagmi";
import { useNotifications } from "../routes/notifications/NotificationContext";

interface EIP1193Provider {
    selectedAddress?: string;
}

export function useConnectionGuard() {
    const { address, isConnected, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const { notify } = useNotifications();
    const { t } = useTranslation("header");

    const hasLogged = useRef(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const isGhostConnection = isConnected && !address;

            if (!isGhostConnection) return;

            const checkProvider = async () => {
                try {
                    if (typeof connector?.getProvider === "function") {
                        const provider =
                            (await connector.getProvider()) as EIP1193Provider;

                        const selected =
                            provider?.selectedAddress?.toLowerCase?.();

                        if (!selected) {
                            if (!hasLogged.current) {
                                console.warn(
                                    "[useConnectionGuard] Ghost connection. Disconnecting..."
                                );
                                hasLogged.current = true;
                            }
                            notify(
                                t("wallet_disconnected", {
                                    defaultValue:
                                        "Wallet disconnected. Please reconnect.",
                                }),
                                "warning"
                            );
                            disconnect();
                        }
                    }
                } catch (err) {
                    console.error(
                        "[useConnectionGuard] Failed to access provider:",
                        err
                    );
                    notify(
                        t("wallet_disconnected", {
                            defaultValue:
                                "Wallet disconnected. Please reconnect.",
                        }),
                        "warning"
                    );
                    disconnect();
                }
            };

            checkProvider();
        }, 100);
        return () => clearTimeout(timeout);
    }, [isConnected, address, disconnect, connector, notify, t]);
}
