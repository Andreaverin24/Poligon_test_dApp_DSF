// CompletedTransactionCoinContent.tsx

// components
import CurrencyIcon from '../../components/CurrencyIcon';
import { Tooltip } from 'flowbite-react';

// types
import type { TransactionActionType } from '../../types/transactions';

// icons
import { ReactComponent as QuestionIcon } from '../../assets/images/common/question.svg?react';

// i18n
import { useTranslation } from 'react-i18next';

interface IncompletedTransactionCoinContentProps {
  transactionToken: StableType;
  transactionAmount: number;
  amountPlaced: number;
  transactionAction: TransactionActionType;
}

const CompletedTransactionCoinContent = (props: IncompletedTransactionCoinContentProps) => {
  const {
    transactionAmount,
    amountPlaced,
    transactionToken,
    transactionAction,
  } = props;

  const { t } = useTranslation('statistics');

  const isIncoming =
    transactionAction === 'deposit' ||
    transactionAction === 'pendingDeposit' ||
    transactionAction === 'transfer-in';

  const isOutgoing =
    transactionAction === 'withdrawal' ||
    transactionAction === 'pendingWithdrawal' ||
    transactionAction === 'transfer-out';

  const displayedAmount = isIncoming ? transactionAmount : amountPlaced;

  const tooltipContent = (() => {
    switch (transactionAction) {
      case 'deposit':
        return t('tooltip_deposit');
      case 'pendingDeposit':
        return t('tooltip_pending_deposit');
      case 'transfer-in':
        return t('tooltip_transfer_in');
      case 'withdrawal':
        return t('tooltip_withdrawal');
      case 'pendingWithdrawal':
        return t('tooltip_pending_withdrawal');
      case 'transfer-out':
        return t('tooltip_transfer_out');
      default:
        return '';
    }
  })();
    
  return (
    <div className="flex flex-col gap-[6px] tablet:items-start">
      {(isIncoming || isOutgoing) && (
        <div className="flex items-center justify-end text-default">
          <div className="flex items-center transaction-currency">
            <CurrencyIcon currency={transactionToken}/>
            <span className="ml-1 text-sm">
              {displayedAmount.toLocaleString('en-US')} {transactionToken}
            </span>
            <span className="ml-1 text-sm">
               <Tooltip 
                 content={tooltipContent} 
                 style="light" 
                 arrow={false}
                 className="w-auto inline-block"
               >
                 <QuestionIcon className="ml-1 cursor-pointer" />
               </Tooltip>
             </span>
          </div>
        </div>
      )}
    </div>

    // <div className="flex flex-col gap-[6px] tablet:items-start">
    //   {isIncoming && (
    //     <div className="flex items-center justify-end text-default">
    //       <div className="flex items-center transaction-currency">
    //         <CurrencyIcon currency={transactionToken} />
    //         <span className="ml-1 text-sm">
    //           {transactionAmount.toLocaleString('en-US')} {transactionToken}
    //         </span>
    //       </div>
    //     </div>
    //   )}
    
    //   {isOutgoing && (
    //     <div className="flex items-center justify-end text-default">
    //       <div className="flex items-center transaction-currency">
    //         <CurrencyIcon currency={transactionToken} />
    //         <span className="ml-1 text-sm">
    //           {amountPlaced.toLocaleString('en-US')} {transactionToken}
    //         </span>
    //         <QuestionIcon className="ml-1" />
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default CompletedTransactionCoinContent;
