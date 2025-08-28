//  withdrawal/steps/ThirdStep.tsx

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWithdrawalContext from "../../../hooks/useWithdrawalContext";
import useGlobalContext from "../../../hooks/useGlobalContext";
import { useAccount, useBalance } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useTranslation } from "react-i18next";
import ValueWithFallback from "../../../components/ValueWithFallback";

// icons
import { ReactComponent as ETHIcon } from "../../../assets/images/currency/ETH.svg?react";

// components
import StepsContainer from "../../deposit/steps/StepsContainer";
import CurrencyIcon from "../../../components/CurrencyIcon";
import Button from "../../../components/CustomButton";
import SuccessWithdrawal from "../../../modals/SuccessWithdrawal";
import Spinner from "../../components/Spinner";

// dsf hooks
import {
  useWriteDsfWithdraw,
  useWriteDsfFeesOptimizationWithdrawal,
} from "../../../wagmi.generated";

const ThirdStep = () => {
  const {
    selectedCurrency,
    amountToWithdraw,
    optimized,
    resetContext,
    amountToWithdrawInPercentage,
  } = useWithdrawalContext();

  const {
    withdrawalGasFeeUsd,
    optimizedWithdrawalGasFeeUsd,
    withdrawalGasFeeEth,
    optimizedWithdrawalGasFeeEth,
    walletInfo,
  } = useGlobalContext();

  const { t } = useTranslation("withdraw");
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  const ethBalanceStr = walletInfo?.eth_balance ?? "0"; // например: "1.400124599941794834"
  const ethAvailable = Number(ethBalanceStr);

  const fallbackDepositFeeUsd =
    walletInfo?.static_gas?.estimates?.withdraw?.gasUsd;
  const fallbackOptimizedFeeUsd =
    walletInfo?.static_gas?.estimates?.feesOptimizationWithdrawal?.gasUsd;
  const fallbackDepositFeeEth =
    walletInfo?.static_gas?.estimates?.withdraw?.gasEth;
  const fallbackOptimizedFeeEth =
    walletInfo?.static_gas?.estimates?.feesOptimizationWithdrawal?.gasEth;

  const finalWithdrawaFeeUsd =
    withdrawalGasFeeUsd && withdrawalGasFeeUsd > 0
      ? withdrawalGasFeeUsd
      : fallbackDepositFeeUsd;
  const finalOptimizedFeeUsd =
    optimizedWithdrawalGasFeeUsd && optimizedWithdrawalGasFeeUsd > 0
      ? optimizedWithdrawalGasFeeUsd
      : fallbackOptimizedFeeUsd;
  const finalWithdrawaFeeEth =
    withdrawalGasFeeEth && withdrawalGasFeeEth > 0
      ? withdrawalGasFeeEth
      : fallbackDepositFeeEth;
  const finalOptimizedFeeEth =
    optimizedWithdrawalGasFeeEth && optimizedWithdrawalGasFeeEth > 0
      ? optimizedWithdrawalGasFeeEth
      : fallbackOptimizedFeeEth;

  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [dsfLpBalance, setDsfLpBalance] = useState<bigint>(BigInt(0));
  const [withdrawalHash, setWithdrawalHash] = useState<string>("");

  const {
    writeContractAsync: writeWithdraw,
    data: txWithdraw,
    isPending: isPendingWithdraw,
    isSuccess: isSuccessWithdraw,
  } = useWriteDsfWithdraw();
  const {
    writeContractAsync: writeOptimized,
    data: txOptimized,
    isPending: isPendingOptimized,
    isSuccess: isSuccessOptimized,
  } = useWriteDsfFeesOptimizationWithdrawal();

  // Fetch dsfLpBalance from API and scale it
  useEffect(() => {
    const fetchLpBalance = () => {
      if (walletInfo?.dsf_lp_balance) {
        const value = parseFloat(walletInfo.dsf_lp_balance);
        setDsfLpBalance(BigInt(Math.floor(value * 1e18)) - 10n ** 16n);
      }
    };
    fetchLpBalance();
  }, [walletInfo?.dsf_lp_balance]);

  const dsfLPAmountToWithdraw = useMemo(() => {
    if (!amountToWithdrawInPercentage || dsfLpBalance === 0n) return 0n;
    return BigInt(
      Math.floor(Number(dsfLpBalance) * amountToWithdrawInPercentage)
    );
  }, [dsfLpBalance, amountToWithdrawInPercentage]);

  const selectedCurrencyIndex = useMemo(() => {
    switch (selectedCurrency) {
      case "DAI":
        return 0;
      case "USDC":
        return 1;
      case "USDT":
        return 2;
      default:
        return 0;
    }
  }, [selectedCurrency]);

  const estimatedFeeETH = useMemo(() => {
    const val = optimized ? finalOptimizedFeeEth : finalWithdrawaFeeEth;
    return val ? Number(val) : 0;
  }, [finalWithdrawaFeeEth, finalOptimizedFeeEth, optimized]);

  useEffect(() => {
    console.log("[💸 ETH Available vs Estimated Fee]", {
      ethAvailable,
      estimatedFeeETH,
      enough: ethAvailable >= estimatedFeeETH,
    });
  }, [ethAvailable, estimatedFeeETH]);

  const withdrawResult = useMemo(() => {
    return (Number(amountToWithdraw) * 0.99902).toFixed(2);
  }, [amountToWithdraw]);

  const withdrawButtonClickHandler = useCallback(async () => {
    if (!isConnected) {
      console.warn("🚫 Wallet not connected");
      return;
    }

    try {
      const tokenAmounts: [bigint, bigint, bigint] = [0n, 0n, 0n];

      let result: `0x${string}` | undefined;

      if (optimized) {
        result = await writeOptimized({
          args: [dsfLPAmountToWithdraw, tokenAmounts] as const,
        });
      } else {
        result = await writeWithdraw({
          args: [
            dsfLPAmountToWithdraw,
            tokenAmounts,
            1,
            BigInt(selectedCurrencyIndex),
          ] as const,
        });
      }

      if (result) {
        console.log("TX sent:", result);
        setWithdrawalHash(result); // result — string (`0x...`) tx hash
      }
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  }, [
    optimized,
    dsfLPAmountToWithdraw,
    selectedCurrencyIndex,
    writeOptimized,
    writeWithdraw,
  ]);

  const isPending = optimized ? isPendingOptimized : isPendingWithdraw;
  const isSuccess = optimized ? isSuccessOptimized : isSuccessWithdraw;

  useEffect(() => {
    if (isSuccess && !isPending) {
      setSuccessModalOpened(true);
    }
  }, [isSuccess, isPending]);

  const closeSuccessModal = useCallback(() => {
    setSuccessModalOpened(false);
    navigate("/transactions");
    resetContext();
  }, [navigate, resetContext]);

  const disabledWithdrawalButton = useMemo(() => {
    return isPending || ethAvailable < estimatedFeeETH;
  }, [isPending, ethAvailable, estimatedFeeETH]);

  if (!selectedCurrency) return null;

  return (
    <StepsContainer title={t("you_get")}>
      <div className="tablet:flex items-end gap-5">
        <label className="block mt-6 text-sm tablet:w-1/2">
          {t("you_withdraw")}
          <div className="flex items-center justify-between rounded-xl bg-gray px-4 py-3 mt-1 text-base">
            <div className="flex items-center">
              <CurrencyIcon currency={selectedCurrency} />
              <span className="ml-[10px] text-gray-900 font-medium">{`${amountToWithdraw} ${selectedCurrency}`}</span>
            </div>
            <ValueWithFallback
              value={amountToWithdraw}
              unit="$"
              precision={2}
              loading={!amountToWithdraw}
            />
          </div>
        </label>
        <label className="block mt-5 tablet:w-1/2">
          <span className="text-sm">{t("fee")}</span>
          <div className="flex items-center justify-between bg-gray rounded-xl px-4 py-3 mt-1">
            <ValueWithFallback
              value={optimized ? finalOptimizedFeeUsd : finalWithdrawaFeeUsd}
              loading={
                optimized ? !finalOptimizedFeeUsd : !finalWithdrawaFeeUsd
              }
              unit="$"
              precision={2}
            />
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-gray rounded-full w-6 h-6">
                <ETHIcon />
              </div>
              <ValueWithFallback
                value={estimatedFeeETH}
                loading={!estimatedFeeETH}
                unit="ETH"
                precision={5}
              />
            </div>
          </div>
        </label>
        <label className="block mt-5 tablet:w-1/2">
          <span className="text-sm">{t("result_slippage")}</span>
          <div className="flex items-center gap-3 bg-gray rounded-xl px-4 py-3 mt-1">
            <CurrencyIcon currency={selectedCurrency} />
            {withdrawResult} {selectedCurrency}
          </div>
        </label>
      </div>

      {/* <div className="mt-5 tablet:mt-6"> */}
      <div className="mt-5 tablet:mt-6 flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
        <Button
          variant="filled"
          onClick={withdrawButtonClickHandler}
          disabled={disabledWithdrawalButton}
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <Spinner />
              <span className="ml-4">{t("withdrawing")}</span>
            </div>
          ) : (
            t("withdraw")
          )}
        </Button>

        {ethAvailable && ethAvailable < estimatedFeeETH && (
          <div className="font-medium text-[14px] leading-[20px] text-red-500">
            {t("not_enough_ETH", {
              amount: +(estimatedFeeETH - ethAvailable).toFixed(7),
              ns: "deposit",
            })}
          </div>
        )}
      </div>
      <SuccessWithdrawal
        opened={successModalOpened}
        onClose={closeSuccessModal}
        etherscanLink={`https://etherscan.io/tx/${withdrawalHash}`}
      />
    </StepsContainer>
  );
};

export default ThirdStep;
