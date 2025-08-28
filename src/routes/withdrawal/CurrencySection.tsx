import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import ValueWithFallback from "../../components/ValueWithFallback";
import useGlobalContext from "../../hooks/useGlobalContext";
import useWithdrawalContext from "../../hooks/useWithdrawalContext";

const CurrencySection = ({
    onValidChange,
}: {
    onValidChange?: (valid: boolean) => void;
}) => {
    const {
        selectedCurrency,
        amountToWithdraw,
        changeAmountToWithdraw,
        changeCurrentStep,
        changeAmountToWithdrawInPercentage,
        amountToWithdrawInPercentage,
    } = useWithdrawalContext();

    const { walletInfo } = useGlobalContext();
    const { t } = useTranslation("withdraw");

    const { address, isConnected } = useAccount();

    const inputRef = useRef<HTMLInputElement>(null);

    const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);
    const [shine, setShine] = useState(false);

    const availableToWithdrawUSDT = useMemo(() => {
        const raw = parseFloat(
            walletInfo?.available_to_withdraw_More?.["USDT"] ||
                walletInfo?.available_to_withdraw ||
                "0"
        );
        return raw;
    }, [
        walletInfo?.available_to_withdraw_More,
        walletInfo?.available_to_withdraw,
    ]);

    const decimals = selectedCurrency === "DAI" ? 18 : 6;

    const availableToWithdrawUSDTNum = useMemo(() => {
        const parsed = Number(availableToWithdrawUSDT);
        return isNaN(parsed) ? 0 : parsed;
    }, [availableToWithdrawUSDT]);

    useEffect(() => {
        changeAmountToWithdrawInPercentage(
            +Number(amountToWithdraw) / availableToWithdrawUSDTNum
        );
    }, [
        amountToWithdraw,
        availableToWithdrawUSDTNum,
        changeAmountToWithdrawInPercentage,
    ]);

    const parsedBalanceAvailableToWithdraw = useMemo(() => {
        return Math.floor(availableToWithdrawUSDTNum * 100) / 100;
    }, [availableToWithdrawUSDTNum]);

    const isInsufficientFunds =
        parsedBalanceAvailableToWithdraw < 0.01 && isConnected;

    const isWithdrawAmountValid = useMemo(() => {
        if (!amountToWithdraw) return false;
        const val = Number(amountToWithdraw);
        return val > 0 && val <= parsedBalanceAvailableToWithdraw;
    }, [amountToWithdraw, parsedBalanceAvailableToWithdraw]);

    const availableToWithdraw = Math.floor(availableToWithdrawUSDT * 100) / 100;

    useEffect(() => {
        if (onValidChange) onValidChange(isWithdrawAmountValid);
    }, [isWithdrawAmountValid, onValidChange]);

    const changeDepositAmountWithConversion = useCallback(
        (value: string) => {
            changeAmountToWithdraw(value);
        },
        [changeAmountToWithdraw]
    );

    useEffect(() => {
        changeAmountToWithdraw("");
    }, [changeAmountToWithdraw]);

    // useEffect(() => {
    //     if (!selectedCurrency) {
    //         const trigger = () => {
    //             setShine(true);
    //             setTimeout(() => setShine(false), 1500);
    //         };

    //         window.addEventListener("shineCurrency", trigger);
    //         return () => window.removeEventListener("shineCurrency", trigger);
    //     }
    // }, [selectedCurrency]);

    return (
        <>
            <div
                className={`group w-[384px] h-[215px] bg-[#FBFBFD] rounded-2xl p-4 flex flex-col justify-between mx-auto px-6 py-5 relative`}
            >
                {/* Верхняя строка: выбор валюты + кнопки % */}
                <div className="flex justify-between items-center text-base font-medium text-blue-600 mb-2">
                    <span>{t("for_withdraw")}</span>
                    <div
                        className={`flex gap-2 text-sm text-blue-600 font-medium transition-opacity duration-200
                            ${!isInsufficientFunds ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none select-none"}
                        `}
                    >
                        {["25", "50", "75"].map((percent) => (
                            <button
                                key={percent}
                                className="bg-[#3956FE0D] px-2 py-1 rounded-full text-xs text-[#3B4B66] hover:shadow-md hover:bg-[#3956FE1A] transition"
                                onClick={() =>
                                    changeAmountToWithdraw(
                                        (
                                            parsedBalanceAvailableToWithdraw *
                                            (+percent / 100)
                                        )
                                            .toFixed(2)
                                            .replace(",", ".")
                                    )
                                }
                            >
                                {percent}%
                            </button>
                        ))}
                        <button
                            className="bg-[#3956FE0D] px-2 py-1 rounded-full text-xs text-[#3B4B66] hover:shadow-md hover:bg-[#3956FE1A] transition"
                            onClick={() =>
                                changeAmountToWithdraw(
                                    parsedBalanceAvailableToWithdraw
                                        .toFixed(2)
                                        .replace(",", ".")
                                )
                            }
                        >
                            MAX
                        </button>
                    </div>
                </div>

                {/* Ввод суммы + без кнопки выбора валюты */}
                <div className="flex items-center text-[2rem] font-semibold">
                    <div className="flex-grow">
                        {isInsufficientFunds ? (
                            <div className="w-full text-[40px] font-medium text-red-500 select-none">
                                0
                            </div>
                        ) : (
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="decimal"
                                pattern="\d+(\.\d{0,2})?"
                                maxLength={12}
                                value={amountToWithdraw}
                                disabled={
                                    availableToWithdraw < 0.01 || !isConnected
                                }
                                onChange={(e) => {
                                    let value = e.target.value.replace(
                                        ",",
                                        "."
                                    );

                                    // Проверка: только цифры и не более 2 знаков после точки
                                    if (
                                        value === "" ||
                                        /^\d{0,9}(\.\d{0,2})?$/.test(value)
                                    ) {
                                        changeAmountToWithdraw(value);
                                    }
                                }}
                                onPaste={(e) => {
                                    const pasted = e.clipboardData
                                        .getData("text")
                                        .replace(",", ".");
                                    if (!/^\d*\.?\d{0,2}$/.test(pasted)) {
                                        e.preventDefault();
                                    }
                                }}
                                placeholder="0"
                                className={`
                                w-full text-[40px] font-medium text-[#3B4B66]
                                ${
                                    !isConnected ||
                                    amountToWithdraw === "0" ||
                                    amountToWithdraw === ""
                                        ? "text-gray-400"
                                        : !isWithdrawAmountValid
                                          ? "text-red-500"
                                          : "text-[#3B4B66]"
                                }
                                placeholder:text-gray-400 outline-none border-none
                                focus:outline-none focus:ring-0 bg-transparent text-left p-0
                            `}
                            />
                        )}
                    </div>
                </div>

                {/* Сумма * 0.99 слева, Баланс справа */}
                <div className="text-base text-gray-500 mt-3 flex items-center justify-between w-full">
                    <div className="flex justify-between items-center text-base font-medium text-blue-600">
                        <span>{t("available_for_withdrawal")}</span>
                    </div>
                    <div
                        className={`flex items-center gap-2 ${availableToWithdraw < 0.01 && isConnected ? "text-red-500" : "text-gray-500"}`}
                    >
                        <div className="w-[18px] h-[18px] flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                                width="18"
                                height="18"
                            >
                                <path
                                    fill="currentColor"
                                    d="M15.6 4.6H1.85v-.55l12.1-.968v.968h1.65V2.4c0-1.21-.98-2.059-2.177-1.888L2.378 2.089C1.18 2.26.2 3.39.2 4.6v11a2.2 2.2 0 002.2 2.2h13.2a2.2 2.2 0 002.2-2.2V6.8a2.2 2.2 0 00-2.2-2.2z"
                                />
                            </svg>
                        </div>

                        <ValueWithFallback
                            value={availableToWithdraw}
                            loading={false}
                            unit="$"
                            precision={2}
                            className="w-full text-base"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CurrencySection;
