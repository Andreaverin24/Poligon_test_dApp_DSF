// CurrencySelectorPopup.tsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import CurrencyIcon from "../../components/CurrencyIcon";

const AVAILABLE_COINS: StableType[] = ["USDT", "USDC", "DAI"];

interface Props {
    onClose: () => void;
    onSelect: (currency: StableType) => void;
}

const CurrencySelectorPopup = ({ onClose, onSelect }: Props) => {
    const { t } = useTranslation("deposit");

    // Закрытие по Escape
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
                {/* Заголовок */}
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                    {t("select_coin")}
                </h2>

                {/* Список валют */}
                <div className="flex flex-col gap-4">
                    {AVAILABLE_COINS.map((coin) => (
                        <button
                            key={coin}
                            onClick={() => {
                                onSelect(coin);
                                onClose();
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left"
                        >
                            <CurrencyIcon currency={coin} />
                            <span className="text-gray-800 font-medium">
                                {coin}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Отмена */}
                {/* <button
                    onClick={onClose}
                    className="mt-6 w-full text-sm text-gray-500 hover:underline text-center"
                >
                    Отмена
                </button> */}

                {/* Кнопка закрытия (крестик) */}
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

export default CurrencySelectorPopup;
