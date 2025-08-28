// useResetAllContextsOnDisconnect.tsx;

import { useEffect } from "react";
import { useAccount } from "wagmi";
import useDepositContext from "./useDepositContext";
import useGlobalContext from "./useGlobalContext";
import useWithdrawalContext from "./useWithdrawalContext";

export const useResetAllContextsOnDisconnect = () => {
    const { address, isConnected } = useAccount();
    const { resetContext: resetDeposit } = useDepositContext();
    const { resetContext: resetWithdrawal } = useWithdrawalContext();
    const {
        changeWallet,
        setTokenAllowances,
        setTokenBalances,
        setWalletInfo,
        setTransactions,
        changeDsfLpBalance,
        changeManagedInDSF,
        changeDSFLPTotalSupply,
        changeDSFLPPrice,
        // changeCurrentInterestRate,
        // changeInterestRate,
    } = useGlobalContext();

    useEffect(() => {
        if (!isConnected || !address) {
            // Reset All
            resetDeposit();
            resetWithdrawal();

            changeWallet("");
            const emptyStableMap = {
                USDT: 0n,
                USDC: 0n,
                DAI: 0n,
            };

            setTokenAllowances(emptyStableMap);
            setTokenBalances(emptyStableMap);
            setWalletInfo({});
            setTransactions([]);
            changeDsfLpBalance(0n);
            changeManagedInDSF(0);
            changeDSFLPTotalSupply(0);
            changeDSFLPPrice(0);
            // changeCurrentInterestRate(0);
            // changeInterestRate(0);
        }
    }, [isConnected, address]);
};
