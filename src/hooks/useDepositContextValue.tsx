// useDepositContextValue.tsx

import react from "react";
import { DepositContextData } from "../context/DepositContext";

const useDepositContextValue = (): DepositContextData => {
    const [currentStep, setCurrentStep] = react.useState<number>(0);
    const [selectedCurrency, setSelectedCurrency] =
        react.useState<StableType | null>(null);
    const [optimized, setOptimized] = react.useState<boolean | null>(null);
    const [depositAmount, setDepositAmount] = react.useState<string>("");
    const [optimizedGasPrice, setOptimizedGasPrice] = react.useState<number>(0);
    const [gasPrice, setGasPrice] = react.useState<number>(0);
    const [interestRate, setInterestRate] = react.useState<number>(0);

    const [displayFeeUsd, setDisplayFeeUsd] = react.useState<number | null>(
        null
    );
    const [displayFeeEth, setDisplayFeeEth] = react.useState<number | null>(
        null
    );

    const resetContext = react.useCallback(() => {
        setCurrentStep(0);
        setSelectedCurrency(null);
        setOptimized(null);
        setDepositAmount("");
    }, [setCurrentStep, setSelectedCurrency, setOptimized, setDepositAmount]);

    const resetCurrentStepToStep = react.useCallback(
        (stepIndex: number) => {
            if (stepIndex > currentStep) return;
            if (stepIndex === 0) {
                setCurrentStep(0);
                setOptimized(null);
                setDepositAmount("");
                return;
            }
            if (stepIndex === 1) {
                setCurrentStep(1);
                setOptimized(null);
                return;
            }
            setCurrentStep(stepIndex);
        },
        [setCurrentStep, currentStep, setOptimized, setDepositAmount]
    );

    return react.useMemo(
        () => ({
            currentStep,
            changeCurrentStep: setCurrentStep,
            selectedCurrency,
            changeSelectedCurrency: setSelectedCurrency,
            optimized,
            changeOptimized: setOptimized,
            depositAmount,
            changeDepositAmount: setDepositAmount,
            optimizedGasPrice,
            changeOptimizedGasPrice: setOptimizedGasPrice,
            gasPrice,
            changeGasPrice: setGasPrice,
            resetContext,
            interestRate,
            setInterestRate,
            resetCurrentStepToStep,
            displayFeeUsd,
            setDisplayFeeUsd,
            displayFeeEth,
            setDisplayFeeEth,
        }),
        [
            currentStep,
            setCurrentStep,
            selectedCurrency,
            setSelectedCurrency,
            optimized,
            setOptimized,
            depositAmount,
            setDepositAmount,
            optimizedGasPrice,
            setOptimizedGasPrice,
            gasPrice,
            setGasPrice,
            resetContext,
            interestRate,
            setInterestRate,
            resetCurrentStepToStep,
            displayFeeUsd,
            setDisplayFeeUsd,
            displayFeeEth,
            setDisplayFeeEth,
        ]
    );
};

export default useDepositContextValue;
