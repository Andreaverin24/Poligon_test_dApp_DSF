// components/swap/GasFeeSection.tsx

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import ValueWithFallback from "../../components/ValueWithFallback";
import useDepositContext from "../../hooks/useDepositContext";
import useGlobalContext from "../../hooks/useGlobalContext";
import GasModeSelectorPopup from "../components/GasModeSelectorPopup";

const GasFeeSection = () => {
    const {
        depositGasFeeUsd,
        optimizedDepositGasFeeUsd,
        walletInfo,
        depositGasFeeEth,
        optimizedDepositGasFeeEth,
    } = useGlobalContext();

    const { address, isConnected } = useAccount();

    let {
        allowances = {},
        balances = {},
        static_gas: {
            ethPriceUsd: ETHPrice = 0,
            estimates: {
                deposit: fallbackDepositFeeUsd = 0,
                optimizedDeposit: fallbackOptimizedFeeUsd = 0,
                depositEth: fallbackDepositFeeEth = 0,
                optimizedDepositEth: fallbackOptimizedFeeEth = 0,
            } = {},
        } = {},
    } = walletInfo ?? {};

    const { optimized, changeOptimized, setDisplayFeeUsd, setDisplayFeeEth } =
        useDepositContext();

    const { t } = useTranslation("deposit");

    const [isMobile, setIsMobile] = useState(false);
    const [showGasPopup, setShowGasPopup] = useState(false);
    const [shine, setShine] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 800);
    }, []);

    const selectedFeeMode = optimized ? "optimized" : "standard"; // ✅ это и есть selectedFeeMode

    const ethBalanceStr = walletInfo?.eth_balance ?? "0";
    const ethBalance = parseUnits(ethBalanceStr, 18);

    fallbackDepositFeeUsd = walletInfo?.static_gas?.estimates?.deposit?.gasUsd;
    fallbackOptimizedFeeUsd =
        walletInfo?.static_gas?.estimates?.feesOptimizationDeposit?.gasUsd;
    fallbackDepositFeeEth = walletInfo?.static_gas?.estimates?.deposit?.gasEth;
    fallbackOptimizedFeeEth =
        walletInfo?.static_gas?.estimates?.feesOptimizationDeposit?.gasEth;

    const finalDepositFeeUsd =
        depositGasFeeUsd && depositGasFeeUsd > 0
            ? depositGasFeeUsd
            : fallbackDepositFeeUsd;
    const finalOptimizedFeeUsd =
        optimizedDepositGasFeeUsd && optimizedDepositGasFeeUsd > 0
            ? optimizedDepositGasFeeUsd
            : fallbackOptimizedFeeUsd;
    const finalDepositFeeEth =
        depositGasFeeEth && depositGasFeeEth > 0
            ? depositGasFeeEth
            : fallbackDepositFeeEth;
    const finalOptimizedFeeEth =
        optimizedDepositGasFeeEth && optimizedDepositGasFeeEth > 0
            ? optimizedDepositGasFeeEth
            : fallbackOptimizedFeeEth;

    const displayFeeUsd = optimized ? finalOptimizedFeeUsd : finalDepositFeeUsd;
    const displayFeeEth = optimized ? finalOptimizedFeeEth : finalDepositFeeEth;

    setDisplayFeeUsd(displayFeeUsd);
    setDisplayFeeEth(displayFeeEth);

    useEffect(() => {
        if (optimized === null) {
            const trigger = () => {
                setShine(true);
                setTimeout(() => setShine(false), 1500);
            };

            window.addEventListener("shineGasFee", trigger);
            return () => window.removeEventListener("shineGasFee", trigger);
        }
    }, [optimized === null]);

    return (
        <>
            <div className="w-[384px] h-[215px] bg-[#FBFBFD] rounded-2xl p-4 flex flex-col justify-between mx-auto px-6 py-5 relative">
                {/* Заголовок */}
                <div className="flex justify-between items-center text-base font-medium text-blue-600 mb-2">
                    <span>{t("fees")}</span>
                </div>

                {/* Центр: Комиссия в $ и кнопка выбора типа */}
                {/* <div className="flex items-end justify-between">*/}
                <div className="flex justify-between items-center">
                    <div className="flex-grow text-blue-900 text-[2rem]">
                        {/* <div className="flex items-center text-[2rem] font-semibold text-blue-900 text-[#3B4B66]"> */}

                        {optimized === null ? (
                            // <div className="text-[40px] font-medium text-blue-900 text-[#3B4B66]">
                            <span className="text-[40px] font-medium text-gray-400 select-none">
                                $-
                            </span>
                        ) : (
                            <ValueWithFallback
                                value={displayFeeUsd}
                                loading={
                                    displayFeeUsd === undefined ||
                                    displayFeeUsd === null
                                }
                                unit="$"
                                precision={2}
                                className={`w-full text-[40px] font-medium ${
                                    optimized !== null &&
                                    displayFeeEth !== undefined &&
                                    BigInt(Math.floor(displayFeeEth * 1e18)) >
                                        ethBalance
                                        ? "text-red-500"
                                        : "text-[#3B4B66]"
                                } placeholder:text-gray-400 outline-none border-none focus:outline-none focus:ring-0 bg-transparent text-left p-0`}

                                //                     className="w-full text-[40px] font-medium text-blue-900 text-[#3B4B66]
                                // placeholder:text-gray-400 outline-none border-none
                                // focus:outline-none focus:ring-0 bg-transparent text-left p-0"
                            />
                        )}
                    </div>
                    <div
                        className={`ml-2 ${optimized !== null ? "w-auto" : "w-auto"}`}
                    >
                        <button
                            className={`flex items-center gap-1 px-1.5 py-1.5 rounded-full text-base font-medium shadow-sm transition
                                ${shine ? "shine-bg" : ""}
                                ${
                                    optimized !== null
                                        ? "bg-[#3956FE0D] text-[#3B4B66] hover:shadow-md w-auto hover:bg-[#3956FE1A]"
                                        : "bg-blue text-white border border-blue hover:bg-blue-100 w-auto hover:text-white"
                                }`}
                            onClick={() => setShowGasPopup(true)}
                        >
                            <div
                                className={`flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap ${optimized !== null ? "w-auto" : "w-auto"}`}
                            >
                                <span className="pl-2">
                                    {optimized !== null
                                        ? t(
                                              `fee.${selectedFeeMode?.toLowerCase?.() ?? "unknown"}`
                                          )
                                        : t("select_fee")}
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

                {/* Комиссия в ETH слева, Баланс ETH справа */}
                <div className="text-base text-gray-500 mt-3 flex items-center justify-between w-full">
                    <div>
                        {optimized === null ? (
                            <div className="text-base text-gray-500">— ETH</div>
                        ) : (
                            <ValueWithFallback
                                value={displayFeeEth}
                                loading={
                                    displayFeeEth === undefined ||
                                    displayFeeEth === null
                                }
                                unit="ETH"
                                precision={6}
                                className="text-base"
                            />
                        )}
                    </div>
                    <div
                        className={`flex items-center gap-2 ${Number(ethBalanceStr) < 0.000001 && isConnected ? "text-red-500" : "text-gray-500"}`}
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
                            value={Number(ethBalanceStr)}
                            loading={
                                ethBalanceStr === undefined ||
                                ethBalanceStr === null
                            }
                            unit="ETH"
                            precision={6}
                            className="text-base"
                        />
                    </div>
                </div>
            </div>

            {/* ⬇️ Попап выбора режима комиссии */}
            {showGasPopup && (
                <GasModeSelectorPopup onClose={() => setShowGasPopup(false)} />
            )}
        </>
    );
};

export default GasFeeSection;
