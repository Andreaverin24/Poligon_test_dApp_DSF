import { createContext } from "react";

export interface WithdrawalContextData {
    currentStep: number;
    selectedCurrency: StableType | null;
    amountToWithdraw: string;
    optimized: boolean | null;
    changeCurrentStep: (step: number) => void;
    changeSelectedCurrency: (currency: StableType) => void;
    changeAmountToWithdraw: (amount: string) => void;
    changeOptimized: (optimized: boolean | null) => void;
    optimizedGasPrice: number;
    changeOptimizedGasPrice: (gasPrice: number) => void;
    gasPrice: number;
    changeGasPrice: (gasPrice: number) => void;
    resetContext: () => void;
    resetCurrentStepToStep: (stepIndex: number) => void;
    amountToWithdrawInPercentage: number;
    changeAmountToWithdrawInPercentage: (percentage: number) => void;

    displayFeeUsd: number | null;
    setDisplayFeeUsd: (usd: number | null) => void;

    displayFeeEth: number | null;
    setDisplayFeeEth: (eth: number | null) => void;
}

export const WithdrawalContext = createContext<
    WithdrawalContextData | undefined
>(undefined);
