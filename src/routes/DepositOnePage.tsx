// pages/DepositOnePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import FullWidthButton from "../components/FullWidthButton";
import useDepositContext from "../hooks/useDepositContext";
import useGlobalContext from "../hooks/useGlobalContext";
import dsfAbi from "../utils/dsf_abi.json";
import dsfAddresses from "../utils/dsf_addresses.json";
import tokensAddresses from "../utils/tokens_addresses.json";
import ApproveActionPopup from "./components/ApproveActionPopup";
import Spinner from "./components/Spinner";
import CurrencySection from "./deposit/CurrencySection";
import GasFeeSection from "./deposit/GasFeeSection";
import ResultSection from "./deposit/ResultSection";

const DepositOnePage = () => {
    const [valid, setValid] = useState(false);
    const { t } = useTranslation("deposit");
    const {
        selectedCurrency,
        depositAmount,
        optimized,
        displayFeeUsd,
        displayFeeEth,
        resetContext,
    } = useDepositContext();
    const { walletInfo } = useGlobalContext();

    const { address, isConnected } = useAccount();

    const { writeContractAsync, isPending: isDepositPending } =
        useWriteContract();

    const decimals = selectedCurrency === "DAI" ? 18 : 6;
    const depositAmountInUnits = parseUnits(depositAmount || "0", decimals);

    const balanceStr =
        walletInfo?.balances?.[selectedCurrency || "USDT"] || "0";
    const balance = parseUnits(balanceStr, decimals);

    const allowanceStr =
        walletInfo?.allowances?.[selectedCurrency || "USDT"] || "0";
    const allowance = useMemo(() => {
        try {
            if (/^\d+$/.test(allowanceStr)) return BigInt(allowanceStr);
            return parseUnits(allowanceStr, decimals);
        } catch {
            return 0n;
        }
    }, [allowanceStr, decimals]);

    const [showApprovePopup, setShowApprovePopup] = useState(false);
    const [shine, setShine] = useState(false);

    const ethBalanceStr = walletInfo?.eth_balance ?? "0";
    const ethBalance = parseUnits(ethBalanceStr, 18);

    const showNotEnoughToken = balance < depositAmountInUnits;
    const showNotEnoughETH =
        displayFeeEth && ethBalance < parseUnits(displayFeeEth.toString(), 18);

    const isApproved = allowance >= depositAmountInUnits;

    const [resetComplete, setResetComplete] = useState(false);

    const depositArgs = useMemo(() => {
        const z = 0n;
        switch (selectedCurrency) {
            case "DAI":
                return [parseUnits(depositAmount || "0", 18), z, z];
            case "USDC":
                return [z, parseUnits(depositAmount || "0", 6), z];
            case "USDT":
            default:
                return [z, z, parseUnits(depositAmount || "0", 6)];
        }
    }, [depositAmount, selectedCurrency]);

    const handleDeposit = async () => {
        try {
            const tx = await writeContractAsync({
                address: dsfAddresses.DSF as `0x${string}`,
                abi: dsfAbi,
                functionName: optimized ? "feesOptimizationDeposit" : "deposit",
                args: [depositArgs],
            });
            console.log("📤 Deposit TX:", tx);
            resetContext();
        } catch (err) {
            console.error("❌ Deposit error:", err);
        }
    };

    const isUSDT = selectedCurrency === "USDT";
    const needsReset =
        isUSDT &&
        allowance > 0n &&
        allowance < depositAmountInUnits &&
        !resetComplete;

    const isZeroBalance =
        Number(walletInfo?.balances?.[selectedCurrency || "USDT"] ?? "0") <
        0.01;

    const hasRedCondition =
        isZeroBalance || showNotEnoughToken || showNotEnoughETH;

    const isButtonDisabled = () =>
        !selectedCurrency || !valid || hasRedCondition || !isConnected;

    const renderButtonContent = (): {
        variant: "filled" | "error" | "outline" | "shine";
        textClassName: string;
        content: React.ReactNode;
    } => {
        if (Number(ethBalanceStr) < 0.000001 && isConnected) {
            return {
                variant: "error",
                textClassName: "text-red-500",
                content: <span>{t("your_balance_eth_is_zero")}</span>,
            };
        }

        if (!selectedCurrency) {
            return {
                variant: "outline",
                textClassName: "text-blue",
                content: <span>{t("select_currency_prompt")}</span>,
            };
        }

        if (selectedCurrency && isZeroBalance && isConnected) {
            return {
                variant: "error",
                textClassName: "text-red-500",
                content: (
                    <span className="text-red-500">
                        {t("your_balance_is_zero", {
                            currency: selectedCurrency,
                        })}
                    </span>
                ),
            };
        }

        if (
            !isZeroBalance &&
            selectedCurrency &&
            Number(depositAmount) === 0 &&
            isConnected
        ) {
            return {
                variant: "outline",
                textClassName: "text-red-500",
                content: (
                    <span className="text-blue">
                        {t("entet_amount_currency_prompt")}
                    </span>
                ),
            };
        }

        if (selectedCurrency && showNotEnoughToken && isConnected) {
            return {
                variant: "error",
                textClassName: "text-red-500",
                content: (
                    <span className="text-red-500">
                        {t("you_need_to_top_up", {
                            currency: selectedCurrency,
                            amount: +(
                                Number(depositAmount) -
                                +formatUnits(balance, decimals)
                            ).toFixed(2),
                        })}
                    </span>
                ),
            };
        }

        if (
            selectedCurrency &&
            !showNotEnoughToken &&
            !isZeroBalance &&
            Number(depositAmount) !== 0 &&
            optimized === null &&
            isConnected
        ) {
            return {
                variant: "outline",
                textClassName: "text-blue",
                content: <span>{t("select_gas_fee_prompt")}</span>,
            };
        }

        if (showNotEnoughETH && isConnected) {
            return {
                variant: "error",
                textClassName: "text-red-500",
                content: (
                    <span>
                        {t("not_enough_ETH", {
                            amount: (
                                Number(displayFeeEth || 0) -
                                Number(ethBalanceStr)
                            ).toFixed(6),
                        })}
                    </span>
                ),
            };
        }

        if (isDepositPending && isConnected) {
            return {
                variant: shine ? "shine" : "filled",
                textClassName: "",
                content: (
                    <>
                        <Spinner />
                        <span className="ml-2">{t("placing_deposit")}</span>
                    </>
                ),
            };
        }

        return {
            variant: shine ? "shine" : "filled",
            textClassName: "",
            content: <>{t("place_deposit")}</>,
        };
    };

    const handleClick = () => {
        if (!isApproved) {
            setShowApprovePopup(true);
            return;
        }
        return handleDeposit();
    };

    useEffect(() => {
        console.log("🔍 Deposit debug info:");
        console.log("Selected currency:", selectedCurrency);
        console.log("Deposit amount:", depositAmount);
        console.log("Decimals:", decimals);
        console.log(
            "Parsed depositAmountInUnits:",
            depositAmountInUnits.toString()
        );

        console.log("Token balance:", balance.toString(), selectedCurrency);
        console.log("Token balance (raw string):", balanceStr);

        console.log("Allowance:", allowance.toString(), selectedCurrency);
        console.log("Allowance (raw string):", allowanceStr);

        console.log("Is approved:", isApproved);

        console.log("ETH balance:", ethBalance.toString());
        console.log("ETH balance (raw string):", ethBalanceStr);

        console.log(
            "Estimated fee in ETH:",
            displayFeeEth?.toString() ?? "N/A"
        );

        console.log("showNotEnoughToken:", showNotEnoughToken);
        console.log("showNotEnoughETH:", showNotEnoughETH);
        console.log("isZeroBalance:", isZeroBalance);
        console.log(
            "isZeroBalance:",
            Number(
                walletInfo?.balances?.[selectedCurrency || "USDT"] ?? "0"
            ) === 0
        );
        console.log(
            "isZeroBalance:",
            Number(walletInfo?.balances?.[selectedCurrency || "USDT"] ?? "0")
        );
    }, [
        selectedCurrency,
        depositAmount,
        decimals,
        depositAmountInUnits,
        balance,
        balanceStr,
        allowance,
        allowanceStr,
        isApproved,
        ethBalance,
        ethBalanceStr,
        displayFeeEth,
        showNotEnoughToken,
        showNotEnoughETH,
        isZeroBalance,
    ]);

    const {
        variant: buttonVariant,
        content: buttonContent,
        textClassName,
    } = renderButtonContent();

    useEffect(() => {
        const interval = setInterval(() => {
            // Shine Currency Button
            const eventCurrency = new CustomEvent("shineCurrency");
            window.dispatchEvent(eventCurrency);

            // Shine GasFee Button after 500 ms
            setTimeout(() => {
                const eventGas = new CustomEvent("shineGasFee");
                window.dispatchEvent(eventGas);
            }, 500);
        }, 10000); // 10 sec

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // if (optimized === null) {
        const interval = setInterval(() => {
            setShine(true);
            setTimeout(() => setShine(false), 3000);
        }, 10000); // 10 sec

        return () => clearInterval(interval);
        // }
    }, []);

    const [showOnramper, setShowOnramper] = useState(false);

    return (
        <>
            <div
                className="min-h-[calc(100vh-80px)]  w-full flex items-center justify-center mx-auto"
                style={{ transform: "translateY(-20px)" }}
            >
                <div className="w-full">
                    <h2 className="font-bold text-gray-900 text-[1.5rem] mb-3">
                        {t("deposits_placed")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-1 justify-center">
                        <CurrencySection onValidChange={setValid} />
                        <GasFeeSection />
                        <ResultSection />
                    </div>

                    <div className="mt-4 space-y-2">
                        <FullWidthButton
                            variant={buttonVariant}
                            disabled={
                                isButtonDisabled() ||
                                // isResetLoading ||
                                // isApproveLoading ||
                                isDepositPending
                            }
                            onClick={handleClick}
                        >
                            <div
                                className={`flex items-center justify-center ${textClassName}`}
                            >
                                {buttonContent}
                            </div>
                        </FullWidthButton>
                    </div>
                </div>
            </div>

            {showApprovePopup && selectedCurrency && (
                <ApproveActionPopup
                    tokenAddress={
                        tokensAddresses[selectedCurrency] as `0x${string}`
                    }
                    amount={depositAmountInUnits}
                    isReset={needsReset}
                    isUSDT={selectedCurrency === "USDT"}
                    onClose={() => setShowApprovePopup(false)}
                />
            )}
        </>
    );
};

export default DepositOnePage;
