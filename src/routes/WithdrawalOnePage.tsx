// pages/WithdrawalOnePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import FullWidthButton from "../components/FullWidthButton";
import useGlobalContext from "../hooks/useGlobalContext";
import useWithdrawalContext from "../hooks/useWithdrawalContext";
import SuccessWithdrawal from "../modals/SuccessWithdrawal";
import Spinner from "./components/Spinner";
import CurrencySection from "./withdrawal/CurrencySection";
import GasFeeSection from "./withdrawal/GasFeeSection";
import ResultSection from "./withdrawal/ResultSection";

// WAGMI Hooks
import {
    useWriteDsfFeesOptimizationWithdrawal,
    useWriteDsfWithdraw,
} from "../wagmi.generated";

const WithdrawalOnePage = () => {
    const { t } = useTranslation("withdraw");
    const { address, isConnected } = useAccount();

    const {
        selectedCurrency,
        amountToWithdraw,
        amountToWithdrawInPercentage,
        optimized,
        displayFeeUsd,
        setDisplayFeeUsd,
        displayFeeEth,
        setDisplayFeeEth,
        resetContext,
    } = useWithdrawalContext();

    const { walletInfo } = useGlobalContext();

    const dsfLpBalance = useMemo(() => {
        const dsfLpBalanceStr = walletInfo?.dsf_lp_balance || "0";
        return parseUnits(dsfLpBalanceStr, 18);
    }, [walletInfo?.dsf_lp_balance]);

    const ethBalanceStr = walletInfo?.eth_balance ?? "0";
    const ethBalance = parseUnits(ethBalanceStr, 18);

    const showNotEnoughETH =
        ethBalance < parseUnits(displayFeeEth?.toString() || "0", 18);

    const [valid, setValid] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [withdrawalHash, setWithdrawalHash] = useState("");

    const [shine, setShine] = useState(false);

    const { writeContractAsync: writeStandard, isPending: isStandardPending } =
        useWriteDsfWithdraw();
    const {
        writeContractAsync: writeOptimized,
        isPending: isOptimizedPending,
    } = useWriteDsfFeesOptimizationWithdrawal();

    const isPending = optimized ? isOptimizedPending : isStandardPending;

    const lpAmountToWithdraw = useMemo(() => {
        if (!amountToWithdrawInPercentage || dsfLpBalance === 0n) return 0n;
        return BigInt(
            Math.floor(Number(dsfLpBalance) * amountToWithdrawInPercentage)
        );
    }, [dsfLpBalance, amountToWithdrawInPercentage]);

    const currencyIndex = useMemo(() => {
        switch (selectedCurrency) {
            case "DAI":
                return 0;
            case "USDC":
                return 1;
            case "USDT":
            default:
                return 2;
        }
    }, [selectedCurrency]);

    const handleWithdraw = async () => {
        try {
            const tokenAmounts: [bigint, bigint, bigint] = [0n, 0n, 0n];

            const tx = optimized
                ? await writeOptimized({
                      args: [lpAmountToWithdraw, tokenAmounts],
                  })
                : await writeStandard({
                      args: [
                          lpAmountToWithdraw,
                          tokenAmounts,
                          1,
                          BigInt(currencyIndex),
                      ],
                  });

            if (tx) {
                setWithdrawalHash(tx);
                setSuccessModal(true);
                resetContext();
            }
        } catch (err) {
            console.error("❌ Withdrawal error:", err);
        }
    };

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

    const availableToWithdrawUSDTNum = useMemo(() => {
        const parsed = Number(availableToWithdrawUSDT);
        return isNaN(parsed) ? 0 : parsed;
    }, [availableToWithdrawUSDT]);

    const showNotEnoughToken =
        parseUnits(availableToWithdrawUSDT.toString(), 18) <
        parseUnits(amountToWithdraw || "0", 18);

    const isZeroBalance =
        Number(walletInfo?.dsf_lp_balance ?? "0") < 0.01 ||
        Number(availableToWithdrawUSDT) < 0.01;

    const hasRedCondition =
        isZeroBalance || showNotEnoughToken || showNotEnoughETH;

    const buttonDisabled =
        !valid ||
        !selectedCurrency ||
        showNotEnoughETH ||
        isPending ||
        !isConnected;

    const isButtonDisabled = () =>
        !selectedCurrency ||
        !valid ||
        hasRedCondition ||
        !isConnected ||
        isPending;

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

        if (isZeroBalance && isConnected) {
            return {
                variant: "error",
                textClassName: "text-red-500",
                content: (
                    <span className="text-red-500">
                        {t("your_dont_have_deposit_balance_is_zero")}
                    </span>
                ),
            };
        }

        if (!isZeroBalance && Number(amountToWithdraw) === 0 && isConnected) {
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

        if (showNotEnoughToken && isConnected) {
            return {
                variant: "error",
                textClassName: "text-red-500",
                content: (
                    <span className="text-red-500">
                        {t("you_need_to_top_up_on_deposite")}
                    </span>
                ),
            };
        }

        if (
            !showNotEnoughToken &&
            !isZeroBalance &&
            Number(amountToWithdraw) !== 0 &&
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

        if (!selectedCurrency) {
            return {
                variant: "outline",
                textClassName: "text-blue",
                content: <span>{t("select_currency_prompt")}</span>,
            };
        }

        if (isPending && isConnected) {
            return {
                variant: shine ? "shine" : "filled",
                textClassName: "",
                content: (
                    <>
                        <Spinner />
                        <span className="ml-2">{t("withdrawing")}</span>
                    </>
                ),
            };
        }

        return {
            variant: shine ? "shine" : "filled",
            textClassName: "",
            content: <>{t("withdraw")}</>,
        };
    };

    const {
        variant: buttonVariant,
        content: buttonContent,
        textClassName,
    } = renderButtonContent();

    useEffect(() => {
        const interval = setInterval(() => {
            // Shine Gas Button
            const eventGas = new CustomEvent("shineGasFee");
            window.dispatchEvent(eventGas);

            // Shine GasFee Button after 500 ms
            setTimeout(() => {
                // Shine Currency Button
                const eventCurrency = new CustomEvent("shineCurrency");
                window.dispatchEvent(eventCurrency);
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

    return (
        <>
            <div
                className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center mx-auto"
                style={{ transform: "translateY(-20px)" }}
            >
                <div className="w-full">
                    <h2 className="font-bold text-gray-900 text-[1.5rem] mb-3">
                        {t("withdraw_title")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-1 justify-center">
                        <CurrencySection onValidChange={setValid} />
                        <GasFeeSection />
                        <ResultSection />
                    </div>

                    <div className="mt-4 space-y-2">
                        <FullWidthButton
                            variant={buttonVariant}
                            disabled={isButtonDisabled() || isPending}
                            onClick={handleWithdraw}
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

            <SuccessWithdrawal
                opened={successModal}
                onClose={() => setSuccessModal(false)}
                etherscanLink={`https://etherscan.io/tx/${withdrawalHash}`}
            />
        </>
    );
};

export default WithdrawalOnePage;
