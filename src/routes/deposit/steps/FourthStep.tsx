// deposit/steps/FourthStep.tsx

import { useMemo, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  useBalance,
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import useDepositContext from "../../../hooks/useDepositContext";
import useReApprove from "../../../hooks/useReApprove";
import useApprove from "../../../hooks/useApprove";
import tokensAddresses from "../../../utils/tokens_addresses.json";
import usdtAbi from "../../../utils/usdt_abi.json";
import useGlobalContext from "../../../hooks/useGlobalContext";
import dsfAbi from "../../../utils/dsf_abi.json";
import crvLpAbi from "../../../utils/crv_lp_contract_abi.json";
import dsfAddresses from "../../../utils/dsf_addresses.json";
import { useTranslation } from "react-i18next";
import { Tooltip } from "flowbite-react";

// icons
import { ReactComponent as QuestionIcon } from "../../../assets/images/common/question.svg?react";
import { ReactComponent as ETHIcon } from "../../../assets/images/currency/ETH.svg?react";

// components
import StepsContainer from "./StepsContainer";
import CurrencyIcon from "../../../components/CurrencyIcon";
import Button from "../../../components/CustomButton";
import SuccessDeposit from "../../../modals/SuccessDeposit";
import Spinner from "../../components/Spinner";
import ValueWithFallback from "../../../components/ValueWithFallback";

const FourthStep = () => {
  const { depositAmount, selectedCurrency, optimized, resetContext } =
    useDepositContext();

  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const {
    depositGasFeeUsd,
    optimizedDepositGasFeeUsd,
    depositGasFeeEth,
    optimizedDepositGasFeeEth,
    walletInfo,
  } = useGlobalContext();

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

  const interestRate = Number(walletInfo?.apy_today ?? 0);

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

  const navigate = useNavigate();
  const { t } = useTranslation("deposit");
  const { address, isConnected } = useAccount();
  const { writeContractAsync, data: depositResult } = useWriteContract();
  const [isDepositLoading, setIsDepositLoading] = useState(false);

  const decimals = selectedCurrency === "DAI" ? 18 : 6;
  const depositAmountInUnits = parseUnits(depositAmount.toString(), decimals);

  const balanceStr = balances?.[selectedCurrency || "USDT"] || "0";
  const balance: bigint = parseUnits(balanceStr, decimals);

  const allowanceStr = allowances?.[selectedCurrency || "USDT"] || "0";
  const allowance: bigint = useMemo(() => {
    const str = String(allowanceStr);

    if (/e\+?\d+$/i.test(str)) return depositAmountInUnits;

    if (/^\d+$/.test(str)) return BigInt(str);

    try {
      return parseUnits(str, decimals);
    } catch {
      console.warn("[FourthStep] bad allowance:", str);
      return 0n;
    }
  }, [allowanceStr, decimals, depositAmountInUnits]);

  const isCalculatingSlippage = !walletInfo?.round_trip_efficiency;

  const {
    approve: resetApprove,
    isLoading: isResetLoading,
    isSuccess: isResetSuccess,
  } = useReApprove({
    tokenAddress: tokensAddresses[selectedCurrency || "USDT"] as `0x${string}`,
    amount: depositAmountInUnits,
    isUSDT: selectedCurrency === "USDT",
  });

  const { approve: approveWrite, isPending: isApproveLoading } = useApprove(
    tokensAddresses[selectedCurrency || "USDT"] as `0x${string}`
  );
  const isApproved = useMemo(
    () => allowance >= depositAmountInUnits,
    [allowance, depositAmountInUnits]
  );

  const approvalHintText = useMemo(() => {
    if (selectedCurrency === "USDC" || selectedCurrency === "DAI") {
      return t("you_will_be_redirected");
    }
    if (
      selectedCurrency === "USDT" &&
      allowance > 0 &&
      allowance < depositAmountInUnits &&
      !resetComplete
    ) {
      return t("you_will_be_redirected_reapprove");
    }
    return t("you_will_be_redirected");
  }, [selectedCurrency, allowance, depositAmountInUnits, resetComplete, t]);

  useEffect(() => {
    if (isResetSuccess) setResetComplete(true);
  }, [isResetSuccess]);

  const renderApproveButton = useMemo(() => {
    if (selectedCurrency === "USDT") {
      if (allowance > 0 && allowance < depositAmountInUnits && !resetComplete) {
        return (
          <Button
            variant="filled"
            onClick={resetApprove}
            disabled={isResetLoading}
          >
            <div className="flex items-center justify-center">
              {isResetLoading && <Spinner />}
              <span className="ml-2">{t("reset_approval")}</span>
            </div>
          </Button>
        );
      }
    }
    if (!isApproved) {
      return (
        <Button
          variant="filled"
          onClick={approveWrite}
          loading={isApproveLoading}
        >
          <div className="flex items-center justify-center">
            {isApproveLoading && <Spinner />}
            <span className="ml-2">{t("approve")}</span>
          </div>
        </Button>
      );
    }
    return null;
  }, [
    selectedCurrency,
    allowance,
    depositAmountInUnits,
    isResetLoading,
    resetApprove,
    approveWrite,
    isApproved,
    resetComplete,
  ]);

  const depositAmounts = useMemo(() => {
    const zero = 0n;
    switch (selectedCurrency) {
      case "DAI":
        return [parseUnits(depositAmount.toString(), 18), zero, zero];
      case "USDC":
        return [zero, parseUnits(depositAmount.toString(), 6), zero];
      case "USDT":
      default:
        return [zero, zero, parseUnits(depositAmount.toString(), 6)];
    }
  }, [depositAmount, selectedCurrency]);

  const depositResultWithSlippage = useMemo(() => {
    const eff = +(
      walletInfo?.round_trip_efficiency?.[selectedCurrency ?? "USDT"] ?? "1"
    );
    return +(Number(depositAmount) * eff).toFixed(2);
  }, [depositAmount, selectedCurrency, walletInfo]);

  const handleDeposit = useCallback(async () => {
    if (!isConnected) {
      console.warn("🚫 Wallet not connected");
      return;
    }

    if (!isApproved) return;
    setIsDepositLoading(true);
    try {
      const txHash = await writeContractAsync({
        address: dsfAddresses.DSF as `0x${string}`,
        abi: dsfAbi,
        functionName: optimized ? "feesOptimizationDeposit" : "deposit",
        args: [depositAmounts],
      });
      console.log("Deposit tx:", txHash);
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.includes("User rejected")) {
        console.warn("⛔ User rejected deposit");
      } else {
        console.error("❌ Deposit error:", err);
      }
    } finally {
      setIsDepositLoading(false);
    }
  }, [isApproved, optimized, depositAmounts, writeContractAsync]);

  useEffect(() => {
    if (depositResult) setSuccessModalOpened(true);
  }, [depositResult]);

  const estimatedFeeETH = useMemo(() => {
    return +(optimized ? finalOptimizedFeeEth : finalDepositFeeEth).toFixed(5);
  }, [optimized, finalDepositFeeEth, finalOptimizedFeeEth]);

  const showNotEnoughToken = useMemo(() => {
    return balance < depositAmountInUnits;
  }, [balance, depositAmountInUnits]);

  const depositHash = useMemo(() => depositResult ?? "", [depositResult]);

  const disabledDepositButton = useMemo(() => {
    if (!ethBalance) return true;
    if (balance < depositAmountInUnits) return true;
    return isDepositLoading || +formatUnits(ethBalance, 18) < estimatedFeeETH;
  }, [
    ethBalance,
    isDepositLoading,
    estimatedFeeETH,
    balance,
    depositAmountInUnits,
  ]);

  const showNotEnoughETH = useMemo(() => {
    if (!ethBalance) return false;
    const currentEth = +formatUnits(ethBalance, 18);
    return currentEth < estimatedFeeETH;
  }, [ethBalance, estimatedFeeETH]);

  const closeSuccessModal = useCallback(() => {
    setSuccessModalOpened(false);
    navigate("/transactions");
    resetContext();
  }, [navigate, resetContext]);

  if (!selectedCurrency) return null;

  useEffect(() => {
    setResetComplete(false);
  }, [selectedCurrency]);

  return (
    <StepsContainer title={t("review")}>
      <div className="tablet:flex items-center gap-5">
        <label className="block mt-5 tablet:w-1/3">
          <span className="text-sm">{t("your_deposit")}</span>
          <div className="flex items-center gap-[10px] bg-gray rounded-xl px-4 py-3 mt-1">
            <CurrencyIcon currency={selectedCurrency} />
            <ValueWithFallback
              value={+depositAmount}
              unit={selectedCurrency}
              precision={2}
            />
          </div>
        </label>
        <label className="block mt-5 tablet:w-1/3">
          <span className="text-sm">{t("estimate_rate")}</span>
          <div className="flex items-center gap-[10px] bg-gray rounded-xl px-4 py-3 mt-1">
            <ValueWithFallback
              value={interestRate}
              unit="%"
              precision={2}
              loading={interestRate === 0}
            />
          </div>
        </label>
        <label className="block mt-5 tablet:w-1/3">
          <span className="text-sm">{t("blockchain_fee")}</span>
          <div className="flex items-center justify-between bg-gray rounded-xl px-4 py-3 mt-1">
            <ValueWithFallback
              value={optimized ? finalOptimizedFeeUsd : finalDepositFeeUsd}
              loading={optimized ? !finalOptimizedFeeUsd : !finalDepositFeeUsd}
              unit="$"
              precision={2}
            />

            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-gray rounded-full w-6 h-6">
                <ETHIcon />
              </div>
              <ValueWithFallback
                value={estimatedFeeETH}
                loading={
                  optimized ? !finalOptimizedFeeEth : !finalDepositFeeEth
                }
                unit="ETH"
                precision={5}
              />
            </div>
          </div>
        </label>
        <label className="block mt-6 tablet:w-1/3">
          <div className="flex flex-row">
            <span className="text-sm">{t("result_slippage")}</span>
            <div className="w-[30px] mt-[-2px]">
              <Tooltip
                content={t("fourth_step_toltip")}
                style="light"
                arrow={false}
                className="w-[300px]"
              >
                <QuestionIcon className="ml-2 h-5 w-5" />
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-[10px] bg-gray rounded-xl px-4 py-3 mt-1">
            <CurrencyIcon currency={selectedCurrency} />
            <ValueWithFallback
              value={depositResultWithSlippage}
              unit={selectedCurrency}
              precision={2}
              loading={isCalculatingSlippage}
            />
          </div>
        </label>
      </div>
      <div className="mt-6 flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
        {renderApproveButton}
        {!isApproved && (
          <div className="font-medium text-[14px] leading-[20px]">
            {approvalHintText}
          </div>
        )}
      </div>

      {isApproved && (
        <div className="mt-6 flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
          <Button
            variant="filled"
            onClick={handleDeposit}
            disabled={disabledDepositButton}
          >
            {isDepositLoading ? (
              <div className="flex items-center justify-center">
                <Spinner />
                <span className="ml-2">{t("placing_deposit")}</span>
              </div>
            ) : (
              t("place_deposit")
            )}
          </Button>

          {showNotEnoughETH && (
            <div className="font-light text-red-500">
              {t("not_enough_ETH", {
                amount: +(
                  estimatedFeeETH - +formatUnits(ethBalance || 0n, 18)
                ).toFixed(7),
              })}
            </div>
          )}
          {showNotEnoughToken && (
            <div className="font-light text-red-500">
              {t("you_need_to_top_up", {
                currency: selectedCurrency,
                amount: +(
                  Number(depositAmount) - +formatUnits(balance, decimals)
                ).toFixed(2),
              })}
            </div>
          )}
        </div>
      )}

      <SuccessDeposit
        opened={successModalOpened}
        onClose={closeSuccessModal}
        etherscanLink={`https://etherscan.io/tx/${depositHash}`}
      />
    </StepsContainer>
  );
};

export default FourthStep;
