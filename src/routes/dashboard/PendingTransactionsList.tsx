// PendingTransactionsList.tsx

import {
  useEffect,
  useRef,
} from 'react';
import { Link } from 'react-router-dom';
import useGlobalContext from '../../hooks/useGlobalContext';
import { useTranslation } from 'react-i18next';

import type { TransactionAPI } from '../../types/transactions';

// components
import Timer from '../../components/Timer';

interface PendingTransactionsListProps {
  pendingTransactions: TransactionAPI[];
}

const PendingTransactionsList = ({ pendingTransactions }: PendingTransactionsListProps) => {
  const { dsfLPPrice } = useGlobalContext();
  // const endTime = useRef<null | Date>(null);
  const { t } = useTranslation('dashboard');

  // useEffect(() => {
  //   endTime.current = new Date();
  //   endTime.current.setHours(6, 0, 0, 0);
  //   if (Date.now() > endTime.current.getTime()) {
  //     endTime.current.setDate(endTime.current.getDate() + 1);
  //   }
  // }, []);

  const deposits = pendingTransactions.filter(tx => tx.action === 'pendingDeposit' && tx.status === 'pending');
  const withdrawals = pendingTransactions.filter(tx => tx.action === 'pendingWithdrawal' && tx.status === 'pending');

  return (
    <ul className="flex flex-col gap-2 font-medium">
      {
        deposits.map((deposit) => (
          <li
            key={deposit.id}
            className="flex justify-between items-center bg-gray py-3 px-4 rounded-2xl"
          >
            <div className="flex flex-col gap-1">
              <span className="text-gray-900">
                {t('pending_deposits')}
              </span>
              <div className="bg-gray-100 py-1 px-2 rounded-2xl text-sm">
                <Timer endTime={new Date(deposit.unixtime * 1000 + 24 * 60 * 60 * 1000)} />
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              {/* ${Number(deposit.amount).toFixed(2)} */}
              ${(+deposit.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </li>
        ))
      }
      {
        withdrawals.map((withdrawal) => (
          <li
            key={withdrawal.id}
            className="flex justify-between items-center bg-gray py-3 px-4 rounded-2xl"
          >
            <div className="flex flex-col gap-1">
              <span className="text-gray-900">
                {t('pending_withdrawals')}
              </span>
              <div className="bg-gray-100 py-1 px-2 rounded-2xl text-sm w-fit">
                <Timer endTime={new Date(withdrawal.unixtime * 1000 + 24 * 60 * 60 * 1000)} />
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              ${
                (
                  +((withdrawal.lpShares || 0) * dsfLPPrice).toFixed(2)
                // ).toLocaleString('en-US')
                ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              }
            </span>
          </li>
        ))
      }
      <Link to="/transactions" className="text-blue font-semibold text-base text-center">
        {t('transaction_statistics')}
      </Link>
    </ul>
  )
};

export default PendingTransactionsList;
