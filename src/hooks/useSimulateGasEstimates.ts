// useSimulateGasEstimates.ts

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { PublicClient } from "viem";
import { encodeFunctionData, parseUnits } from "viem";
import { useAccount } from "wagmi";

import useDepositContext from "./useDepositContext";
import { useFastGasClient } from "./useFastGasClient";
import useGlobalContext from "./useGlobalContext";
import useWithdrawalContext from "./useWithdrawalContext";

import dsfAbi from "../utils/dsf_abi.json";
import dsfAddresses from "../utils/dsf_addresses.json";

// 'DAI' -> 0n, 'USDC' -> 1n, 'USDT' -> 2n
const withdrawCurrencyIndexMap: Record<StableType, bigint> = {
    DAI: 0n,
    USDC: 1n,
    USDT: 2n,
};

/* -------------------------------------------------------------------------- */
/*                                helpers                                     */
/* -------------------------------------------------------------------------- */

const toBigIntSafe = (
    value: string | number | bigint | undefined | null,
    decimals = 0
): bigint => {
    if (typeof value === "bigint") return value;
    if (value === null || value === undefined) return 0n;

    try {
        // plain integer string
        if (/^\d+$/.test(String(value))) return BigInt(value as string);

        // → units
        const num = Number(value);
        if (Number.isFinite(num) && num >= 0) {
            return parseUnits(num.toString(), decimals);
        }
    } catch {
        /* ignore */
    }
    return 0n;
};

/** min bigint */
const minBigInt = (a: bigint, b: bigint): bigint => (a < b ? a : b);

const getPriorityFee = async (client: PublicClient): Promise<bigint> => {
    try {
        const tipHex = await client.request({
            method: "eth_maxPriorityFeePerGas",
        });
        return BigInt(tipHex);
    } catch {
        return 2_000_000_000n; // 2 gwei fallback
    }
};
/* -------------------------------------------------------------------------- */

export const useSimulateGasEstimates = () => {
    const { address: activeAddress } = useAccount();

    const rawClient = useFastGasClient();
    const client = useMemo(() => rawClient, [rawClient]);
    if (!client) return;

    const depositIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const withdrawalIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const contractAddress = dsfAddresses.DSF as `0x${string}`;

    const {
        walletInfo,
        ETHPrice,
        gasPrice,
        depositGasFeeUsd,
        optimizedDepositGasFeeUsd,
        withdrawalGasFeeUsd,
        optimizedWithdrawalGasFeeUsd,
        depositGasFeeEth,
        optimizedDepositGasFeeEth,
        withdrawalGasFeeEth,
        optimizedWithdrawalGasFeeEth,
        changeDepositGasFeeUsd,
        changeOptimizedDepositGasFeeUsd,
        changeWithdrawalGasFeeUsd,
        changeOptimizedWithdrawalGasFeeUsd,
        changeDepositGasFeeEth,
        changeOptimizedDepositGasFeeEth,
        changeWithdrawalGasFeeEth,
        changeOptimizedWithdrawalGasFeeEth,
    } = useGlobalContext();

    const { selectedCurrency: selectedWithdrawCurrency } =
        useWithdrawalContext();
    const { selectedCurrency: selectedDepositCurrency } = useDepositContext();

    const isDepositEstimating = useRef(false);
    const isWithdrawalEstimating = useRef(false);

    /* ----------------------- balances / allowances ------------------------- */
    const balances = useMemo<Record<StableType, bigint>>(
        () => ({
            DAI: toBigIntSafe(walletInfo?.balances?.DAI, 18),
            USDC: toBigIntSafe(walletInfo?.balances?.USDC, 6),
            USDT: toBigIntSafe(walletInfo?.balances?.USDT, 6),
        }),
        [walletInfo?.balances]
    );

    const allowances = useMemo<Record<StableType, bigint>>(
        () => ({
            DAI: toBigIntSafe(walletInfo?.allowances?.DAI, 18),
            USDC: toBigIntSafe(walletInfo?.allowances?.USDC, 6),
            USDT: toBigIntSafe(walletInfo?.allowances?.USDT, 6),
        }),
        [walletInfo?.allowances]
    );

    /* ---------------------- вспомогательные вычисления --------------------- */
    const getDepositTokenAmounts = (
        currency: StableType
    ): [bigint, bigint, bigint] => {
        const dai =
            currency === "DAI"
                ? minBigInt(balances.DAI, allowances.DAI) / 2n
                : 0n;
        const usdc =
            currency === "USDC"
                ? minBigInt(balances.USDC, allowances.USDC) / 2n
                : 0n;
        const usdt =
            currency === "USDT"
                ? minBigInt(balances.USDT, allowances.USDT) / 2n
                : 0n;
        const result: [bigint, bigint, bigint] = [dai, usdc, usdt];
        // если всё 0n → fallback
        return result.every((v) => v === 0n) ? [0n, 0n, 1n] : result;
    };

    const depositTokenAmounts = useMemo(
        () => getDepositTokenAmounts(selectedDepositCurrency || "USDT"),
        [selectedDepositCurrency, balances, allowances]
    );

    const withdrawCurrencyIndex =
        withdrawCurrencyIndexMap[selectedWithdrawCurrency || "USDT"];

    const lpAmount = useMemo(() => {
        return walletInfo?.dsf_lp_balance && walletInfo.dsf_lp_balance > 0n
            ? walletInfo.dsf_lp_balance / 2n
            : 1_000_000_000_000_000n; // 0.001 LP в wei
    }, [walletInfo?.dsf_lp_balance]);

    /* -------------------------- fallback estimate -------------------------- */
    const fallbackEstimateGas = async (
        data: `0x${string}`
    ): Promise<bigint | null> => {
        const url =
            (client &&
                "transport" in client &&
                (client as any)?.transport?.url) ||
            "https://cloudflare-eth.com"; // fallback RPC
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "eth_estimateGas",
                    params: [
                        {
                            from: activeAddress,
                            to: contractAddress,
                            data,
                        },
                    ],
                }),
            });

            const json = await response.json();
            return json?.result ? BigInt(json.result) : null;
        } catch (err: any) {
            if (err?.message?.includes("Connection interrupted")) {
                console.warn(
                    "[Fallback Gas] Connection interrupted, ignoring..."
                );
                return null;
            }
            console.error("[Fallback Gas] Fetch failed:", err);
            return null;
        }
    };

    /* ------------------ универсальный расчёт через EIP‑1559 ----------------- */
    const estimateFromFunction = async (
        label: string,
        fnName: string,
        args: any[],
        currentUsd: number,
        currentEth: number,
        setterUsd: (val: number) => void,
        setterEth: (val: number) => void
    ) => {
        if (!client || !activeAddress) {
            console.log(`[${label}] ❌ Skipping estimate due to bad deps`, {
                gasPrice,
                ETHPrice,
                client,
            });
            return;
        }

        try {
            const data = encodeFunctionData({
                abi: dsfAbi,
                functionName: fnName as any,
                args,
            });

            // 1. gas units
            let gasUnitsRaw: bigint;
            try {
                gasUnitsRaw = await client.estimateGas({
                    account: activeAddress,
                    to: contractAddress,
                    data,
                });
            } catch {
                const fb = await fallbackEstimateGas(data);
                if (!fb) return;
                gasUnitsRaw = fb;
            }

            // --- 1.1 +10 % buffer & round to 256 --------------------------------
            const gasUnitsBuffered = (gasUnitsRaw * 105n) / 100n; // +10 %
            const gasUnits = ((gasUnitsBuffered + 0n) / 256n) * 256n; // ↑ до кратного 256

            // 2. EIP‑1559 fees
            const block = await client.getBlock();
            const baseFee = block.baseFeePerGas ?? 0n;
            const tip = await getPriorityFee(client as PublicClient);
            // const maxFeePerGas = (baseFee * 125n) / 100n + tip; // +25 %

            const profiles = {
                slow: { mult: 125n, label: "Низкий" }, // baseFee ×1.25
                market: { mult: 900n, label: "Средний" }, // baseFee ×2
                fast: { mult: 1400n, label: "Высокий" }, // baseFee ×3
            } as const;

            // 1.25× → «Медленно», 2× → «Рынок», 3× → «Быстро» (как MetaMask)
            const SPEED_MULTIPLIER = profiles.market.mult; // default «Средний»
            const maxFeePerGas = (baseFee * SPEED_MULTIPLIER) / 100n + tip;

            console.log(`[${label}] tip`, Number(tip) / 1e9, "gwei", profiles);

            // 3. cost
            const feeWei = gasUnits * maxFeePerGas;
            const eth = Number(feeWei) / 1e18;
            const usdRate =
                ETHPrice || walletInfo?.static_gas?.ethPriceUsd || 0;
            const usd = +(eth * usdRate).toFixed(4); // USD

            if (!Number.isFinite(usd) || usd === 0) return;

            if (usd > 1000) {
                console.warn(
                    `[${label}] ❗ Anomaly detected: unrealistically high gas fee`,
                    { gasUnits, gasPrice, ETHPrice, eth, usd }
                );
                return;
            }

            if (gasPrice > 5000 || ETHPrice > 100_000) {
                console.warn(`[${label}] ⚠️ Unusual gasPrice or ETHPrice`, {
                    gasPrice,
                    ETHPrice,
                });
            }

            if (
                !Number.isFinite(eth) ||
                !Number.isFinite(usd) ||
                usd === 0 ||
                eth === 0
            ) {
                console.warn(`[${label}] ❌ Skipped due to non-finite values`, {
                    eth,
                    usd,
                });
                return;
            }

            console.log(
                `[${label}] ⛽ Gas units: ${gasUnits} 💰 ETH: ${eth} 💸 USD: ${usd.toFixed(2)}`
            );

            if (
                Math.abs(eth - currentEth) > 0.0000001 ||
                Math.abs(usd - currentUsd) > 0.001
            ) {
                setterEth(eth);
                setterUsd(usd);
            }
        } catch (err) {
            console.warn(`[${label}] Gas estimation error`, err);
        }
    };

    // Deposit
    const runDepositEstimate = useCallback(async () => {
        if (isDepositEstimating.current) {
            console.log("[Deposit] ⏳ Still estimating, skipping...");
            return;
        }

        isDepositEstimating.current = true;
        try {
            await estimateFromFunction(
                "optimized deposit",
                "feesOptimizationDeposit",
                [depositTokenAmounts],
                optimizedDepositGasFeeUsd,
                optimizedDepositGasFeeEth,
                changeOptimizedDepositGasFeeUsd,
                changeOptimizedDepositGasFeeEth
            );

            await estimateFromFunction(
                "deposit",
                "deposit",
                [depositTokenAmounts],
                depositGasFeeUsd,
                depositGasFeeEth,
                changeDepositGasFeeUsd,
                changeDepositGasFeeEth
            );
        } catch (err) {
            console.warn("[Deposit] Estimate error", err);
        } finally {
            isDepositEstimating.current = false;
        }
    }, [
        depositTokenAmounts,
        optimizedDepositGasFeeUsd,
        depositGasFeeUsd,
        changeOptimizedDepositGasFeeUsd,
        changeOptimizedDepositGasFeeEth,
        changeDepositGasFeeUsd,
        changeDepositGasFeeEth,
        activeAddress,
    ]);

    useEffect(() => {
        const shouldRun =
            activeAddress &&
            selectedDepositCurrency &&
            depositTokenAmounts.some((v) => v > 0n);
        if (!shouldRun) {
            if (depositIntervalRef.current) {
                clearInterval(depositIntervalRef.current);
                console.log(
                    "[Deposit] 🧹 Cleared interval due to inactive state"
                );
            }
            depositIntervalRef.current = null;
            return;
        }

        runDepositEstimate();
        depositIntervalRef.current = setInterval(runDepositEstimate, 15_000);

        return () => {
            if (depositIntervalRef.current) {
                clearInterval(depositIntervalRef.current);
                console.log("[Deposit] 🧹 Interval cleared on unmount");
            }
            depositIntervalRef.current = null;
        };
    }, [
        activeAddress,
        runDepositEstimate,
        selectedDepositCurrency,
        depositTokenAmounts,
        gasPrice,
        ETHPrice,
    ]);

    // Withdraw
    const runWithdrawalEstimate = useCallback(async () => {
        if (isWithdrawalEstimating.current || !activeAddress) {
            console.log("[Withdrawal] ⏳ Still estimating, skipping...");
            return;
        }

        isWithdrawalEstimating.current = true;
        try {
            await estimateFromFunction(
                "optimized withdrawal",
                "feesOptimizationWithdrawal",
                [lpAmount, [0n, 0n, 0n]],
                optimizedWithdrawalGasFeeUsd,
                optimizedWithdrawalGasFeeEth,
                changeOptimizedWithdrawalGasFeeUsd,
                changeOptimizedWithdrawalGasFeeEth
            );

            await estimateFromFunction(
                "withdrawal",
                "withdraw",
                [lpAmount, [0n, 0n, 0n], 1, withdrawCurrencyIndex],
                withdrawalGasFeeUsd,
                withdrawalGasFeeEth,
                changeWithdrawalGasFeeUsd,
                changeWithdrawalGasFeeEth
            );
        } catch (err) {
            console.warn("[Withdrawal] Estimate error", err);
        } finally {
            isWithdrawalEstimating.current = false;
        }
    }, [
        lpAmount,
        withdrawCurrencyIndex,
        optimizedWithdrawalGasFeeUsd,
        withdrawalGasFeeUsd,
        changeOptimizedWithdrawalGasFeeUsd,
        changeOptimizedWithdrawalGasFeeEth,
        changeWithdrawalGasFeeUsd,
        changeWithdrawalGasFeeEth,
        activeAddress,
    ]);

    useEffect(() => {
        const shouldRun =
            activeAddress && selectedWithdrawCurrency && lpAmount > 0n;
        if (!shouldRun) {
            if (withdrawalIntervalRef.current) {
                clearInterval(withdrawalIntervalRef.current);
                console.log(
                    "[Withdrawal] 🧹 Cleared interval due to inactive state"
                );
            }
            withdrawalIntervalRef.current = null;
            return;
        }

        runWithdrawalEstimate();
        withdrawalIntervalRef.current = setInterval(
            runWithdrawalEstimate,
            15_000
        );

        return () => {
            if (withdrawalIntervalRef.current) {
                clearInterval(withdrawalIntervalRef.current);
                console.log("[Withdrawal] 🧹 Interval cleared on unmount");
            }
            withdrawalIntervalRef.current = null;
        };
    }, [
        activeAddress,
        runWithdrawalEstimate,
        selectedWithdrawCurrency,
        lpAmount,
        gasPrice,
        ETHPrice,
    ]);

    // If update Deposit data
    useEffect(() => {
        if (selectedDepositCurrency && depositTokenAmounts.some((v) => v > 0n))
            runDepositEstimate(); // 🚀 Recalculate
    }, [selectedDepositCurrency, depositTokenAmounts, runDepositEstimate]);

    // If update Withdraw data
    useEffect(() => {
        if (selectedWithdrawCurrency && lpAmount > 0n) runWithdrawalEstimate(); // 🚀 Recalculate
    }, [
        walletInfo?.dsf_lp_balance,
        selectedWithdrawCurrency,
        lpAmount,
        runWithdrawalEstimate,
    ]);
};
