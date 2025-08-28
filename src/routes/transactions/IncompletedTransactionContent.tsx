// IncompletedTransactionContent.tsx

import { useMemo } from 'react';
import { Tooltip } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

// icons
import { ReactComponent as QuestionIcon } from '../../assets/images/common/question.svg?react';

// components
import Button from '../../components/CustomButton';
import Timer from '../../components/Timer';

// types
import type { TransactionActionType } from '../../types/transactions';

interface IncompletedTransactionContentProps {
  transactionAction: TransactionActionType;
  cancelTransaction: () => void;
  isDisableToCancel: boolean;
  timestamp: Date;
}

const IncompletedTransactionContent = (props: IncompletedTransactionContentProps) => {
  const {
    transactionAction,
    cancelTransaction,
    isDisableToCancel,
    timestamp,
  } = props;
  const { t } = useTranslation('statistics');

  const awaitingText = useMemo(() => {
    if (transactionAction === 'pendingDeposit') return `${t('awaiting_placement_status')}:`;
    if (transactionAction === 'pendingWithdrawal') return `${t('awaiting_withdrawal_status')}:`;
    return 'Awaiting:';
  }, [transactionAction, t]);

  const endTime = useMemo(() => {
    const end = new Date(timestamp.getTime());
    end.setHours(end.getHours() + 24);
    return end;
  }, [timestamp]);

  return (
    <div className="mt-2">
      <div
        className={`
          flex tablet:flex-col items-center tablet:items-start justify-between 
          bg-gray tablet:bg-transparent rounded-2xl p-2 text-gray-900
        `}
      >
        <span className="text-default tablet:text-gray-900">
          {awaitingText}
        </span>
        <div className="tablet:text-default tablet:bg-gray tablet:py-1 tablet:px-2 tablet:mt-1 rounded-2xl">
          <Timer endTime={endTime} />
        </div>
      </div>
      <div className="relative mt-4 tablet:hidden">
        <Tooltip content={
          <div className="max-w-xs">
            {t('cancel-tooltip', { ns: 'common' })}
          </div>
        } style="light" arrow={false}>
          <QuestionIcon height={16} width={16} className="absolute -right-1 -top-2" />
        </Tooltip>
        <Button
          onClick={cancelTransaction}
          variant="outline"
          disabled={isDisableToCancel}
        >
          {t('cancel', { ns: 'common' })}
        </Button>
      </div>
    </div>
  );
};

export default IncompletedTransactionContent;
