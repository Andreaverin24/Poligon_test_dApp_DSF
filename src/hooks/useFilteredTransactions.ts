// useFilteredTransactions.ts

import { useMemo } from 'react';
import type { TransactionAPI } from '../types/transactions';

type PendingAction = 'pendingDeposit' | 'pendingWithdrawal';

/**
 * Filters transactions by `action` and `'pending'` status.
 *
 * @param transactions - Array of transactions
 * @param actionType - Type of action: 'pendingDeposit' or 'pendingWithdrawal'
 * @returns Filtered array of pending transactions
 */
export default function useFilteredTransactions(
  transactions: TransactionAPI[] | undefined,
  actionType: PendingAction
): TransactionAPI[] {
  return useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(
      (tx) => tx.action === actionType && tx.status === 'pending'
    );
  }, [transactions, actionType]);
}
