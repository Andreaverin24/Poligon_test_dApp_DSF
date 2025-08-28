import react, { useCallback, useMemo, useState } from "react";
import { WithdrawalContextData } from "../context/WithdrawalContext";

const useWithdrawalContextValue = (): WithdrawalContextData => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedCurrency, setSelectedCurrency] = useState<StableType | null>(
        null
    );
    const [amountToWithdraw, setAmountToWithdraw] = useState<string>("");
    const [optimized, setOptimized] = useState<boolean | null>(null);
    const [optimizedGasPrice, setOptimizedGasPrice] = useState<number>(0);
    const [gasPrice, setGasPrice] = useState<number>(0);
    const [amountToWithdrawInPercentage, setAmountToWithdrawInPercentage] =
        useState<number>(0);

    const [displayFeeUsd, setDisplayFeeUsd] = react.useState<number | null>(
        null
    );
    const [displayFeeEth, setDisplayFeeEth] = react.useState<number | null>(
        null
    );

    const resetContext = useCallback(() => {
        setCurrentStep(0);
        setSelectedCurrency(null);
        setOptimized(null);
        setAmountToWithdraw("");
    }, [
        setCurrentStep,
        setSelectedCurrency,
        setOptimized,
        setAmountToWithdraw,
    ]);

    const resetCurrentStepToStep = useCallback(
        (stepIndex: number) => {
            if (stepIndex > currentStep) return;
            if (stepIndex === 0) {
                setCurrentStep(0);
                setOptimized(null);
                return;
            }
            setCurrentStep(stepIndex);
        },
        [setCurrentStep, currentStep, setOptimized]
    );

    return useMemo(
        () => ({
            currentStep,
            changeCurrentStep: setCurrentStep,
            selectedCurrency,
            changeSelectedCurrency: setSelectedCurrency,
            amountToWithdraw,
            changeAmountToWithdraw: setAmountToWithdraw,
            optimized,
            changeOptimized: setOptimized,
            optimizedGasPrice,
            changeOptimizedGasPrice: setOptimizedGasPrice,
            gasPrice,
            changeGasPrice: setGasPrice,
            resetContext,
            resetCurrentStepToStep,
            amountToWithdrawInPercentage,
            changeAmountToWithdrawInPercentage: setAmountToWithdrawInPercentage,
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
            amountToWithdraw,
            setAmountToWithdraw,
            optimized,
            setOptimized,
            optimizedGasPrice,
            setOptimizedGasPrice,
            gasPrice,
            setGasPrice,
            resetContext,
            resetCurrentStepToStep,
            amountToWithdrawInPercentage,
            setAmountToWithdrawInPercentage,
            displayFeeUsd,
            setDisplayFeeUsd,
            displayFeeEth,
            setDisplayFeeEth,
        ]
    );
};

export default useWithdrawalContextValue;
