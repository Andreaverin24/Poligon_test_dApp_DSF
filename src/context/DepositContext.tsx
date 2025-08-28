import { createContext } from "react";

export interface DepositContextData {
    currentStep: number;
    changeCurrentStep: (step: number) => void;
    selectedCurrency: StableType | null;
    changeSelectedCurrency: (currency: StableType) => void;
    optimized: boolean | null;
    changeOptimized: (optimized: boolean | null) => void;
    depositAmount: string;
    changeDepositAmount: (amount: string) => void;
    optimizedGasPrice: number;
    changeOptimizedGasPrice: (gasPrice: number) => void;
    gasPrice: number;
    changeGasPrice: (gasPrice: number) => void;
    resetContext: () => void;
    interestRate: number;
    setInterestRate: (interestRate: number) => void;
    resetCurrentStepToStep: (stepIndex: number) => void;

    displayFeeUsd: number | null;
    setDisplayFeeUsd: (usd: number | null) => void;

    displayFeeEth: number | null;
    setDisplayFeeEth: (eth: number | null) => void;
}

export const DepositContext = createContext<DepositContextData | undefined>(
    undefined
);
