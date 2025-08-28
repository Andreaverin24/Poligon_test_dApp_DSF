// components/swap/CurrencySection.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import CurrencyIcon from "../../components/CurrencyIcon";
import ValueWithFallback from "../../components/ValueWithFallback";
import useDepositContext from "../../hooks/useDepositContext";
import useGlobalContext from "../../hooks/useGlobalContext";
import CurrencySelectorPopup from "../components/CurrencySelectorPopup";

const CurrencySection = ({
    onValidChange,
}: {
    onValidChange?: (valid: boolean) => void;
}) => {
    const {
        selectedCurrency,
        changeSelectedCurrency,
        depositAmount,
        changeDepositAmount,
    } = useDepositContext();

    const { walletInfo } = useGlobalContext();
    const { t } = useTranslation("deposit");

    const { address, isConnected } = useAccount();

    const inputRef = useRef<HTMLInputElement>(null);

    const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);
    const [shine, setShine] = useState(false);

    const decimals = selectedCurrency === "DAI" ? 18 : 6;

    const balanceStr =
        walletInfo?.balances?.[selectedCurrency || "USDT"] || "0";

    const balanceNum = useMemo(() => {
        const parsed = Number(balanceStr);
        return isNaN(parsed) ? 0 : parsed;
    }, [balanceStr]);

    const parsedBalance = useMemo(() => {
        return Math.floor(balanceNum * 100) / 100;
    }, [balanceNum]);

    const isInsufficientFunds = parsedBalance < 0.01 && isConnected;

    const isDepositAmountValid = useMemo(() => {
        if (!depositAmount || !selectedCurrency) return false;
        const val = Number(depositAmount);
        return val > 0 && val <= parsedBalance;
    }, [depositAmount, selectedCurrency, parsedBalance]);

    useEffect(() => {
        if (onValidChange) onValidChange(isDepositAmountValid);
    }, [isDepositAmountValid, onValidChange]);

    const changeDepositAmountWithConversion = useCallback(
        (value: string) => {
            changeDepositAmount(value);
        },
        [changeDepositAmount]
    );

    useEffect(() => {
        changeDepositAmount("");
    }, [selectedCurrency, changeDepositAmount]);

    async function fetchTokenPricesFromCoinGecko() {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,dai,ethereum,bitcoin&vs_currencies=usd`
        );

        const data = await res.json();

        return {
            USDT: data.tether.usd,
            USDC: data["usd-coin"].usd,
            DAI: data.dai.usd,
            ETH: data.ethereum.usd,
            WBTC: data.bitcoin.usd,
        };
    }

    const [prices, setPrices] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchTokenPricesFromCoinGecko().then(setPrices);
    }, []);

    const tokenPrice = prices[selectedCurrency ?? "USDT"] ?? 1;

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
            <div
                className={`group w-[384px] h-[215px] bg-[#FBFBFD] rounded-2xl p-4 flex flex-col justify-between mx-auto px-6 py-5 relative`}
            >
                {/* Верхняя строка: выбор валюты + кнопки % */}
                <div className="flex justify-between items-center text-base font-medium text-blue-600 mb-2">
                    <span>{t("for_placement")}</span>
                    <div
                        className={`flex gap-2 text-sm text-blue-600 font-medium transition-opacity duration-200
                            ${selectedCurrency && !isInsufficientFunds ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none select-none"}
                        `}
                    >
                        {["25", "50", "75"].map((percent) => (
                            <button
                                key={percent}
                                className="bg-[#3956FE0D] px-2 py-1 rounded-full text-xs text-[#3B4B66] hover:shadow-md hover:bg-[#3956FE1A] transition"
                                onClick={() =>
                                    changeDepositAmount(
                                        (parsedBalance * (+percent / 100))
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
                                changeDepositAmount(
                                    parsedBalance.toFixed(2).replace(",", ".")
                                )
                            }
                        >
                            MAX
                        </button>
                    </div>
                </div>

                {/* Ввод суммы + кнопка выбора валюты */}
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
                                value={depositAmount}
                                disabled={
                                    !selectedCurrency ||
                                    parsedBalance < 0.01 ||
                                    !isConnected
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
                                        changeDepositAmount(value);
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
                                    !selectedCurrency ||
                                    !isConnected ||
                                    depositAmount === "0" ||
                                    depositAmount === ""
                                        ? "text-gray-400"
                                        : !isDepositAmountValid
                                          ? "text-red-500"
                                          : "text-[#3B4B66]"
                                }                                placeholder:text-gray-400 outline-none border-none
                                focus:outline-none focus:ring-0 bg-transparent text-left p-0
                            `}
                            />
                        )}
                    </div>
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
                                    <CurrencyIcon currency={selectedCurrency} />
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
                </div>

                {/* Сумма * 0.99 слева, Баланс справа */}
                <div className="text-base text-gray-500 mt-3 flex items-center justify-between w-full">
                    <div>
                        <ValueWithFallback
                            value={
                                selectedCurrency && depositAmount
                                    ? +depositAmount * tokenPrice
                                    : 0
                            }
                            loading={false}
                            unit="$"
                            precision={2}
                            className="w-full text-base"
                        />
                    </div>
                    <div
                        className={`flex items-center gap-2 ${parsedBalance < 0.01 && isConnected ? "text-red-500" : "text-gray-500"}`}
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
                            value={
                                selectedCurrency ? parsedBalance?.toFixed(2) : 0
                            }
                            loading={false}
                            unit={(selectedCurrency ?? "USDT").toUpperCase()}
                            precision={2}
                            className="w-full text-base"
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
                        setTimeout(() => {
                            inputRef.current?.focus();
                        }, 100);
                    }}
                />
            )}
        </>
    );
};

export default CurrencySection;
