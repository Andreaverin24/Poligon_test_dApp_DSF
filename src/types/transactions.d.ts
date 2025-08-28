// transactions.d.ts

interface Deposit {
  id: number;
  wallet: string;
  amount: string;
  currency: StableType;
  lpshares: string;
  timestamp: string;
  gasSaved: string;
  txHash: string;
  blockNumber: number;
  state: string;
  ETHPrice: string;
  lpPrice: string;
  gasSpent: string;
  transactionType: TransactionType;
}

interface Withdrawal extends Deposit {
  withdrawalType: number;
}

// interface Transaction extends Withdrawal {
//   action: 'deposit' | 'withdrawal';
// }

type TransactionType = 'premium' | 'smart' | 'default';

// Новый тип транзакций для /request/transactions
export interface TransactionAPI {
  id: string;
  action: TransactionActionType;
  status?: TransactionStatus; // может отсутствовать у transfer-in/out
  txHash: string;
  timestamp: string;
  unixtime: number;
  currency: string;
  amount: number;
  to?: string;
  from?: string;
  gasSpentEth?: number;
  gasSpentUsd?: number;
  lpShares?: number;
}

type TransactionActionType =
  | 'deposit'
  | 'withdrawal'
  | 'pendingWithdrawal'
  | 'pendingDeposit'
  | 'transfer-in'
  | 'transfer-out';

type TransactionStatus =
  | 'completed'
  | 'failed'
  | 'pending'
  | 'cancelled'
  | 'standard'
  | 'transfered'
  | 'premium'; 

