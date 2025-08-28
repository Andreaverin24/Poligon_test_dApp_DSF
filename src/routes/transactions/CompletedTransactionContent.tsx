// CompletedTransactionContent.tsx

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { TransactionStatus, TransactionActionType } from '../../types/transactions';

interface CompletedTransactionContentProps {
  transactionAction: TransactionActionType;
  transactionStatus: TransactionStatus;
  address?: string;
}

const CompletedTransactionContent = (props: CompletedTransactionContentProps) => {
  const {
    transactionAction,
    transactionStatus,
    address,
  } = props;
  const { t } = useTranslation('statistics');

  const shortAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const contentText = useMemo(() => {
    switch (transactionAction) {
      case 'deposit':
        return t('funds_placed_status');
      case 'withdrawal':
        return t('funds_withdrawn_status');
      case 'pendingDeposit':
        if (transactionStatus === 'failed') return t('deposit_failed_status');
        if (transactionStatus === 'cancelled') return t('deposit_cancelled_status');
        return t('funds_placed_status');
      case 'pendingWithdrawal':
        if (transactionStatus === 'failed') return t('withdrawal_failed_status');
        if (transactionStatus === 'cancelled') return t('withdrawal_cancelled_status');
        return t('funds_withdrawn_status');
      case 'transfer-in':
        return t('transfer-in_status', { shortAddress });
      case 'transfer-out':
        return t('transfer-out_status', { shortAddress });
      default:
        return 'Completed';
    }
  }, [transactionAction, transactionStatus, shortAddress, t]);

  return (
    <div className="bg-gray-100 tablet:bg-transparent rounded-2xl p-2 text-gray-900 mt-2 text-sm tablet:text-[14px] tx-fixs">
      {contentText}
    </div>
  );
};

export default CompletedTransactionContent;
