import { Transak } from "@transak/transak-sdk";
import { useEffect } from "react";

interface TransakWidgetProps {
    walletAddress: string;
    currency: "USDT" | "USDC" | "DAI";
    onClose?: () => void;
}

const TransakWidget = ({
    walletAddress,
    currency,
    onClose,
}: TransakWidgetProps) => {
    useEffect(() => {
        const transak = new Transak({
            apiKey: import.meta.env.VITE_TRANSAK_API_KEY,
            environment: import.meta.env.VITE_TRANSAK_ENVIRONMENT || "STAGING",
            defaultCryptoCurrency: currency,
            walletAddress,
            fiatCurrency: "USD",
            themeColor: "#1C1C28",
            widgetHeight: "550px",
            widgetWidth: "100%",
            disableWalletAddressForm: true,
        });

        transak.init();

        const handleEvent = (event: MessageEvent) => {
            if (event?.data?.eventName === "TRANSAK_ORDER_SUCCESSFUL") {
                console.log("[Transak] ✅ Order Successful:", event.data.data);
                transak.close();
                if (onClose) onClose();
            }
        };

        window.addEventListener("message", handleEvent);

        return () => {
            window.removeEventListener("message", handleEvent);
            transak.close();
        };
    }, [walletAddress, currency, onClose]);

    return null;
};

export default TransakWidget;
