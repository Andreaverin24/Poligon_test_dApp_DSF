// GlobalContext.tsx

import {
  createContext,
} from 'react';

export interface GlobalContextData {
  wallet: string;
  changeWallet: (wallet: string) => void;
  balance: BalanceType;
  changeBalance: (currency: StableType, amount: number) => void;
  ETHPrice: number;
  setETHPrice: (ETHPrice: number) => void;
  managedInDSF: number;
  changeManagedInDSF: (managedInDSFUSD: number) => void;
  changeDsfLpBalance: (lpBalance: bigint) => void;
  gasPrice: number;
  changeGasPrice: (gasPrice: number) => void;
  dsfLPPrice: number;
  changeDSFLPPrice: (dsfLPPrice: number) => void;
  dsfLpTotalSupply: number;
  changeDSFLPTotalSupply: (dsfLPTotalSupply: number) => void;
  userDeposits: UserDeposits;
  changeUserDeposits: (userDeposits: UserDeposits) => void;
  interestRate: number;
  changeInterestRate: (interestRate: number) => void;
  currentInterestRate: number;
  changeCurrentInterestRate: (currentInterestRate: number) => void;
  withdrawableIncome: number;
  changeWithdrawableIncome: (withdrawableIncome: number) => void;
  dsfLpBalance: bigint;

  walletInfo: any;
  setWalletInfo: (info: any) => void;
  transactions: any[];
  setTransactions: (txs: any[]) => void;

  depositGasFeeUsd: number;
  changeDepositGasFeeUsd: (depositGasFeeUsd: number) => void;
  optimizedDepositGasFeeUsd: number;
  changeOptimizedDepositGasFeeUsd: (optimizedDepositGasFeeUsd: number) => void;

  withdrawalGasFeeUsd: number;
  changeWithdrawalGasFeeUsd: (withdrawalGasFeeUsd: number) => void;
  optimizedWithdrawalGasFeeUsd: number;
  changeOptimizedWithdrawalGasFeeUsd: (optimizedWithdrawalGasFeeUsd: number) => void;

  depositGasFeeEth: number;
  changeDepositGasFeeEth: (value: number) => void;
  optimizedDepositGasFeeEth: number;
  changeOptimizedDepositGasFeeEth: (value: number) => void;

  withdrawalGasFeeEth: number;
  changeWithdrawalGasFeeEth: (value: number) => void;
  optimizedWithdrawalGasFeeEth: number;
  changeOptimizedWithdrawalGasFeeEth: (value: number) => void;

  tokenAllowances: Record<StableType, bigint>;
  setTokenAllowances: React.Dispatch<React.SetStateAction<Record<StableType, bigint>>>;

  tokenBalances: Record<StableType, bigint>;
  setTokenBalances: (balances: Record<StableType, bigint>) => void;

  walletName: string;
  setWalletName: (name: string) => void;
}

export const GlobalContext = createContext<GlobalContextData | undefined>(
  undefined
);
