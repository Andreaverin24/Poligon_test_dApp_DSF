// Transaction.tsx

import { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// icons
import { ReactComponent as LinkIcon } from '../../assets/images/common/link.svg?react';
import { ReactComponent as ETHIcon } from '../../assets/images/currency/ETH.svg?react';

// components
import Card from '../../components/Card';
import CompletedTransactionContent from './CompletedTransactionContent';
import IncompletedTransactionContent from './IncompletedTransactionContent';
import CompletedTransactionCoinContent from './CompletedTransactionCoinContent';
import IncompletedTransactionCoinContent from './IncompletedTransactionCoinContent';

// types
import type { TransactionStatus, TransactionActionType } from '../../types/transactions';

// dsf hooks
import {
  useWriteDsfRemovePendingDeposit,
  useWriteDsfRemovePendingWithdrawal,
} from '../../wagmi.generated';

interface TransactionProps {
  timestamp: Date;
  transactionStatus: TransactionStatus;
  transactionAction: TransactionActionType;
  transactionToken: StableType;
  transactionAmount: number;
  amountPlaced?: number;
  lpShares?: number;
  commissionEth: number;
  commissionUsd: number;
  isFinished: boolean;
  txHash: string;
  address: string;
}

const Transaction = (props: TransactionProps) => {
  const {
    timestamp,
    transactionStatus,
    transactionAction,
    transactionToken,
    transactionAmount,
    amountPlaced,
    commissionEth,
    commissionUsd,
    isFinished,
    txHash,
    address,
  } = props;

  const { t } = useTranslation('statistics');

  const { writeContract: removePendingDeposit } = useWriteDsfRemovePendingDeposit();
  const { writeContract: removePendingWithdrawal } = useWriteDsfRemovePendingWithdrawal();

  const transactionActionContent = useMemo(() => transactionAction, [transactionAction]);

  const cancelTransaction = useCallback(() => {
    try {
      if (transactionAction === 'pendingDeposit') {
        removePendingDeposit({ args: [] });
      } else if (transactionAction === 'pendingWithdrawal') {
        removePendingWithdrawal({ args: [] });
      }
    } catch (error) {
      console.error('Cancel tx error:', error);
    }
  }, [transactionAction, removePendingDeposit, removePendingWithdrawal]);

  return (
    <Card>
      <div className="mx-[-12px] my-[-21px]">
        <div className="flex items-center justify-between bg-gray rounded-2xl p-2 text-gray-900">
          <div>
            {timestamp.toLocaleString()}
          </div>
          <div className="flex items-center gap-3">
            <span className={`${transactionStatus} capitalize`}>{t(transactionActionContent)}</span>
            <Link to={`https://etherscan.io/tx/${txHash}`}>
              <LinkIcon />
            </Link>
          </div>
        </div>
        <div className="flex justify-between bg-gray rounded-2xl p-2 text-gray-900 mt-2">
        <span className="text-default">
          {t('coin')}:
        </span>
          {
            isFinished && amountPlaced
              ? (<CompletedTransactionCoinContent
                  transactionAmount={transactionAmount}
                  amountPlaced={amountPlaced}
                  transactionToken={transactionToken}
                  transactionAction={transactionAction}
                />)
              : (<IncompletedTransactionCoinContent
                  transactionAmount={transactionAmount}
                  transactionToken={transactionToken}
                />)
          }
        </div>
        <div className="flex justify-between bg-gray rounded-2xl p-2 text-gray-900 mt-2">
        <span className="text-default">
          {t('Commissions_spent')}:
        </span>
          <div className="flex items-center gap-2">
            <ETHIcon />
            <span>
            {`${commissionEth.toLocaleString('en-US')} `}
              ETH
          </span>
            <span className="text-default">
            $ {(commissionUsd).toLocaleString('en-US')}
          </span>
          </div>
        </div>
        <div className='tx-fixs4'>
        {
          isFinished
            ? (<CompletedTransactionContent 
              transactionAction={transactionAction}
              transactionStatus={transactionStatus}
              address={address}
            />)
            : (<IncompletedTransactionContent
              transactionAction={transactionAction}
              cancelTransaction={cancelTransaction}
              isDisableToCancel={false}
              timestamp={timestamp}
            />)
        }
        </div>
      </div>
    </Card>
  )
};

export default Transaction;
