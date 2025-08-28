// components/deposit/ResultSection.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CurrencyIcon from "../../components/CurrencyIcon";
import ValueWithFallback from "../../components/ValueWithFallback";
import useGlobalContext from "../../hooks/useGlobalContext";
import useWithdrawalContext from "../../hooks/useWithdrawalContext";
import CurrencySelectorPopup from "../components/CurrencySelectorPopup";

const ResultSection = () => {
    const {
        selectedCurrency,
        changeSelectedCurrency,
        amountToWithdraw,
        changeAmountToWithdraw,
        changeCurrentStep,
        changeAmountToWithdrawInPercentage,
        amountToWithdrawInPercentage,
        optimized,
    } = useWithdrawalContext();

    const { walletInfo } = useGlobalContext();
    const { t } = useTranslation("withdraw");

    const interestRate = Number(walletInfo?.apy_today ?? 0);

    const isCalculatingSlippage = !walletInfo?.round_trip_efficiency;
    const withdrawResultWithSlippage = useMemo(() => {
        const availableToWithdraw = +(optimized
            ? walletInfo?.available_to_withdraw_More?.["USDT"]
            : (walletInfo?.available_to_withdraw_More?.[
                  selectedCurrency ?? "USDT"
              ] ?? walletInfo?.available_to_withdraw));
        return +(availableToWithdraw * amountToWithdrawInPercentage).toFixed(2);
    }, [
        optimized,
        amountToWithdraw,
        selectedCurrency,
        walletInfo,
        amountToWithdrawInPercentage,
    ]);

    const inputRef = useRef<HTMLInputElement>(null);
    const [shine, setShine] = useState(false);
    const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);

    // if (!selectedCurrency || !depositAmount) return null; text-blue-600 font-medium

    useEffect(() => {
        if (!selectedCurrency) {
            const trigger = () => {
                setShine(true);
                setTimeout(() => setShine(false), 1500);
            };

            window.addEventListener("shineCurrency", trigger);
            return () => window.removeEventListener("shineCurrency", trigger);
        }
    }, [selectedCurrency]);

    return (
        <>
            <div className="w-[384px] h-[215px] bg-[#FBFBFD] rounded-2xl p-4 flex flex-col justify-between mx-auto px-6 py-5 relative">
                {/* Заголовок */}
                <div className="flex justify-between items-center text-base font-medium text-blue-600 mb-2">
                    <span>{t("result_slippage")}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex-grow text-blue-900 text-[2rem]">
                        {!selectedCurrency ||
                        !amountToWithdraw ||
                        Number(amountToWithdraw) === 0 ? (
                            <span className="text-[40px] font-medium text-gray-400 select-none">
                                0.00
                            </span>
                        ) : (
                            <ValueWithFallback
                                value={withdrawResultWithSlippage}
                                loading={isCalculatingSlippage}
                                unit=""
                                precision={2}
                                className="w-full text-[40px] font-medium text-blue-900 text-[#3B4B66]
                                placeholder:text-gray-400 outline-none border-none
                                focus:outline-none focus:ring-0 bg-transparent text-left p-0"
                            />
                        )}
                    </div>
                    {optimized ? (
                        <div className="ml-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            <CurrencyIcon currency="MIXED" />
                            {/* <span className="pl-1 text-base font-medium text-[#3B4B66]">
                                {selectedCurrency}
                            </span> */}
                        </div>
                    ) : (
                        <div
                            className={`ml-2 ${selectedCurrency ? "w-[110px]" : "w-auto"}`}
                        >
                            <button
                                className={`flex items-center gap-1 px-1.5 py-1.5 rounded-full text-base font-medium shadow-sm transition
                            ${shine ? "shine-bg" : ""}
                            ${
                                selectedCurrency
                                    ? "bg-[#3956FE0D] text-[#3B4B66] hover:shadow-md w-[110px] hover:bg-[#3956FE1A]"
                                    : "bg-blue text-white border border-blue hover:bg-blue-100 w-auto hover:text-white"
                            }`}
                                onClick={() => setShowCurrencyPopup(true)}
                            >
                                <div
                                    className={`flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap ${selectedCurrency ? "w-[80px]" : "w-auto"}`}
                                >
                                    {selectedCurrency && (
                                        <CurrencyIcon
                                            currency={selectedCurrency}
                                        />
                                    )}
                                    <span className="pl-2">
                                        {selectedCurrency ?? t("select_coin")}
                                    </span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* <div className="ml-2 w-[110px]">

                </div> */}
                </div>
                {/* <div className="flex items-center text-[2rem] font-semibold">
                <Tooltip
                    content={t("fourth_step_toltip")}
                    style="light"
                    arrow={false}
                >
                    <QuestionIcon className="ml-3 w-5 h-5 text-gray-400" />
                </Tooltip>
            </div> */}

                {/* Текст Текущая ставка доходности слева, значение справа */}
                <div className="text-base text-gray-500 mt-3 flex items-center justify-between w-full">
                    <div className="flex justify-between items-center text-base font-medium text-blue-600">
                        <span>{t("estimate_rate")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ValueWithFallback
                            value={Number(interestRate)}
                            loading={
                                interestRate === undefined ||
                                interestRate === null
                            }
                            unit="%"
                            precision={2}
                            className=""
                        />
                    </div>
                </div>
            </div>

            {/* Попап выбора валюты */}
            {showCurrencyPopup && (
                <CurrencySelectorPopup
                    onClose={() => setShowCurrencyPopup(false)}
                    onSelect={(currency) => {
                        changeSelectedCurrency(currency);
                        // setTimeout(() => {
                        //     inputRef.current?.focus();
                        // }, 100);
                    }}
                />
            )}
        </>
    );
};

export default ResultSection;
