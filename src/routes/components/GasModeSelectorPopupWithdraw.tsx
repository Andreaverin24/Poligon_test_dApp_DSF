// GasModeSelectorPopupWithdraw.tsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import OnlineIndicator from "../../components/OnlineIndicator";
import ValueWithFallback from "../../components/ValueWithFallback";
import useGlobalContext from "../../hooks/useGlobalContext";
import useWithdrawalContext from "../../hooks/useWithdrawalContext";

interface Props {
    onClose: () => void;
}

const GasModeSelectorPopup = ({ onClose }: Props) => {
    const { t } = useTranslation("withdraw");
    const { changeOptimized, changeSelectedCurrency } = useWithdrawalContext();
    const { withdrawalGasFeeUsd, optimizedWithdrawalGasFeeUsd, walletInfo } =
        useGlobalContext();

    const fallbackWithdrawalFee =
        walletInfo?.static_gas?.estimates?.withdraw?.gasUsd;
    const fallbackOptimizedFee =
        walletInfo?.static_gas?.estimates?.feesOptimizationWithdrawal?.gasUsd;

    const finalWithdrawalFee =
        withdrawalGasFeeUsd && withdrawalGasFeeUsd > 0
            ? withdrawalGasFeeUsd
            : fallbackWithdrawalFee;
    const finalOptimizedFee =
        optimizedWithdrawalGasFeeUsd && optimizedWithdrawalGasFeeUsd > 0
            ? optimizedWithdrawalGasFeeUsd
            : fallbackOptimizedFee;

    const selectFast = () => {
        changeOptimized(false);
        // changeSelectedCurrency();
        onClose();
    };

    const selectSmart = () => {
        changeOptimized(true);
        changeSelectedCurrency("USDT");
        onClose();
    };

    // Escape для закрытия
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                    {t("choose_gas_mode")}
                </h2>

                <div className="flex flex-col gap-4">
                    {/* Smart Option */}
                    <button
                        onClick={selectSmart}
                        className="flex flex-col items-start gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left border"
                    >
                        <span className="font-semibold text-gray-800">
                            {t("fee.optimized")}
                        </span>
                        <div className="text-sm flex justify-between items-center w-full text-gray-600">
                            <span>{t("estimated_fee")}:</span>
                            <ValueWithFallback
                                value={finalOptimizedFee}
                                unit="$"
                                precision={2}
                                loading={
                                    finalOptimizedFee === undefined ||
                                    finalOptimizedFee === null
                                }
                                className="text-gray-900 font-medium"
                            />
                        </div>
                        <OnlineIndicator />
                    </button>

                    {/* Fast Option */}
                    <button
                        onClick={selectFast}
                        className="flex flex-col items-start gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left border"
                    >
                        <span className="font-semibold text-gray-800">
                            {t("fee.standard")}
                        </span>
                        <div className="text-sm flex justify-between items-center w-full text-gray-600">
                            <span>{t("estimated_fee")}:</span>
                            <ValueWithFallback
                                value={finalWithdrawalFee}
                                unit="$"
                                precision={2}
                                loading={
                                    finalWithdrawalFee === undefined ||
                                    finalWithdrawalFee === null
                                }
                                className="text-gray-900 font-medium"
                            />
                        </div>
                        <OnlineIndicator />
                    </button>
                </div>

                {/* Close */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
        </div>,
        document.body
    );
};

export default GasModeSelectorPopup;
