// useGlobalContextValue.tsx

import {
  useState,
  useMemo,
  useCallback,
} from 'react';
import { GlobalContextData } from '../context/GlobalContext';

const useGlobalContextValue = (): GlobalContextData => {
  const [wallet, setWallet] = useState<string>('');
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [ETHPrice, setETHPrice] = useState<number>(0);
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [managedInDSF, setManagedInDSF] = useState<number>(0);
  const [dsfLPPrice, setDSFLPPrice] = useState<number>(0);
  const [dsfLpTotalSupply, setDSFLPTotalSupply] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [currentInterestRate, setCurrentInterestRate] = useState<number>(0);
  const [withdrawableIncome, setWithdrawableIncome] = useState<number>(0);
  const [dsfLpBalance, setDsfLpBalance] = useState<bigint>(BigInt(0));
  
  const [balance, setBalance] = useState<BalanceType>({
    DAI: 0,
    USDC: 0,
    USDT: 0,
  });

  const [userDeposits, setUserDeposits] = useState<UserDeposits>({
    beforeCompound: 0,
    afterCompound: 0,
  });

  const [tokenAllowances, setTokenAllowances] = useState<Record<StableType, bigint>>({
    DAI: 0n,
    USDC: 0n,
    USDT: 0n,
  });

  const [tokenBalances, setTokenBalances] = useState<Record<StableType, bigint>>({
    USDT: 0n,
    USDC: 0n,
    DAI: 0n,
  });

  const changeBalance = useCallback((currency: StableType, amount: number) => {
    if (amount < 0) {
      throw new Error('Amount in balance cannot be negative');
    }
    const balanceCopy = { ...balance };
    balanceCopy[currency] = amount;
    setBalance(balanceCopy);
  },[balance, setBalance]);

  const setNewETHPrice = useCallback((newETHPrice: number) => {
    if (newETHPrice < 0) {
      throw new Error('ETH price cannot be negative');
    }

    setETHPrice(newETHPrice);
  },[setETHPrice]);

  const [depositGasFeeUsd, setDepositGasFeeUsd] = useState(0);
  const [optimizedDepositGasFeeUsd, setOptimizedDepositGasFeeUsd] = useState(0);
  const [withdrawalGasFeeUsd, setWithdrawalGasFeeUsd] = useState(0);
  const [optimizedWithdrawalGasFeeUsd, setOptimizedWithdrawalGasFeeUsd] = useState(0);

  const [depositGasFeeEth, setDepositGasFeeEth] = useState(0);
  const [optimizedDepositGasFeeEth, setOptimizedDepositGasFeeEth] = useState(0);
  const [withdrawalGasFeeEth, setWithdrawalGasFeeEth] = useState(0);
  const [optimizedWithdrawalGasFeeEth, setOptimizedWithdrawalGasFeeEth] = useState(0);

  const [walletName, setWalletName] = useState<string>('');

  return useMemo(() => ({
    wallet,
    changeWallet: setWallet,
    balance,
    changeBalance,
    ETHPrice,
    setETHPrice: setNewETHPrice,
    managedInDSF,
    changeManagedInDSF: setManagedInDSF,
    gasPrice,
    changeGasPrice: setGasPrice,
    dsfLPPrice,
    changeDSFLPPrice: setDSFLPPrice,
    dsfLpTotalSupply,
    changeDSFLPTotalSupply: setDSFLPTotalSupply,
    userDeposits,
    changeUserDeposits: setUserDeposits,
    interestRate,
    changeInterestRate: setInterestRate,
    withdrawableIncome,
    changeWithdrawableIncome: setWithdrawableIncome,
    changeDsfLpBalance: setDsfLpBalance,
    dsfLpBalance,
    currentInterestRate,
    changeCurrentInterestRate: setCurrentInterestRate,
    walletInfo,
    setWalletInfo,
    transactions,
    setTransactions,

    depositGasFeeUsd,
    changeDepositGasFeeUsd: setDepositGasFeeUsd,
    optimizedDepositGasFeeUsd,
    changeOptimizedDepositGasFeeUsd: setOptimizedDepositGasFeeUsd,
    
    withdrawalGasFeeUsd,
    changeWithdrawalGasFeeUsd: setWithdrawalGasFeeUsd,
    optimizedWithdrawalGasFeeUsd,
    changeOptimizedWithdrawalGasFeeUsd: setOptimizedWithdrawalGasFeeUsd,

    depositGasFeeEth,
    changeDepositGasFeeEth: setDepositGasFeeEth,
    optimizedDepositGasFeeEth,
    changeOptimizedDepositGasFeeEth: setOptimizedDepositGasFeeEth,
    
    withdrawalGasFeeEth,
    changeWithdrawalGasFeeEth: setWithdrawalGasFeeEth,
    optimizedWithdrawalGasFeeEth,
    changeOptimizedWithdrawalGasFeeEth: setOptimizedWithdrawalGasFeeEth,
  
    tokenAllowances,
    setTokenAllowances,

    tokenBalances,
    setTokenBalances,

    walletName,
    setWalletName,
  }), [
    wallet, setWallet,
    changeBalance, setNewETHPrice,
    ETHPrice, balance,
    managedInDSF, setManagedInDSF,
    gasPrice, setGasPrice,
    dsfLPPrice, setDSFLPPrice,
    dsfLpTotalSupply, setDSFLPTotalSupply,
    userDeposits, setUserDeposits,
    interestRate, setInterestRate,
    withdrawableIncome, setWithdrawableIncome,
    dsfLpBalance, setDsfLpBalance,
    currentInterestRate, setCurrentInterestRate,
    walletInfo, setWalletInfo,
    transactions, setTransactions,

    depositGasFeeUsd, setDepositGasFeeUsd,
    optimizedDepositGasFeeUsd, setOptimizedDepositGasFeeUsd,
    withdrawalGasFeeUsd, setWithdrawalGasFeeUsd,
    optimizedWithdrawalGasFeeUsd, setOptimizedWithdrawalGasFeeUsd,

    depositGasFeeEth, setDepositGasFeeEth,
    optimizedDepositGasFeeEth, setOptimizedDepositGasFeeEth,
    withdrawalGasFeeEth, setWithdrawalGasFeeEth,
    optimizedWithdrawalGasFeeEth, setOptimizedWithdrawalGasFeeEth,

    tokenAllowances, setTokenAllowances,
    tokenBalances, setTokenBalances,

    walletName, setWalletName,
  ]);
}

export default useGlobalContextValue;
