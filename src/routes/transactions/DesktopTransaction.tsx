// DesktopTransaction.tsx

import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

// icons
import { ReactComponent as ETHIcon } from '../../assets/images/currency/ETH.svg?react';
import { ReactComponent as LinkIcon } from '../../assets/images/common/link.svg?react';
import { ReactComponent as QuestionIcon } from '../../assets/images/common/question.svg?react';

// components
import CompletedTransactionCoinContent from './CompletedTransactionCoinContent';
import IncompletedTransactionCoinContent from './IncompletedTransactionCoinContent';
import CompletedTransactionContent from './CompletedTransactionContent';
import IncompletedTransactionContent from './IncompletedTransactionContent';
import Button from '../../components/CustomButton';

// types
import type { TransactionStatus, TransactionActionType } from '../../types/transactions';

// dsf hooks
import {
  useWriteDsfRemovePendingDeposit,
  useWriteDsfRemovePendingWithdrawal,
} from '../../wagmi.generated';

interface DesktopTransactionProps {
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

const DesktopTransaction = (props:DesktopTransactionProps) => {
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

  const cancelTransaction = useCallback(() => {
    try {
      if (transactionAction === 'pendingDeposit') {
        removePendingDeposit({ args: [] });
      } else if (transactionAction === 'pendingWithdrawal') {
        removePendingWithdrawal({ args: [] });
      }
    } catch (err) {
      console.error('Cancel tx error:', err);
    }
  }, [transactionAction, removePendingDeposit, removePendingWithdrawal]);

  const transactionActionContent = useMemo(() => transactionAction, [transactionAction]);

  return (
    <tr className="bg-gray">
      <td className="py-3 px-4 rounded-l-2xl">{timestamp.toLocaleString()}</td>
      <td className="py-3">
        <span className={`${transactionStatus} capitalize`}>{t(transactionActionContent)}</span>
      </td>
      <td className="py-3 tx-fixs">
        {isFinished && amountPlaced ? (
          <CompletedTransactionCoinContent
            transactionToken={transactionToken}
            transactionAmount={transactionAmount}
            amountPlaced={amountPlaced}
            transactionAction={transactionAction}
          />
        ) : ( 
          <IncompletedTransactionCoinContent
            transactionToken={transactionToken}
            transactionAmount={transactionAmount}
          />
        )}
      </td>
      <td className="py-3">
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
      </td>
      <td className="py-2 max-w-[160px]">
        {
          isFinished
            ? <CompletedTransactionContent
                transactionAction={transactionAction}
                transactionStatus={transactionStatus}
                address={address}
              />
            : <IncompletedTransactionContent
                transactionAction={transactionAction}
                cancelTransaction={cancelTransaction}
                isDisableToCancel={false}
                timestamp={timestamp}
              />
        }
      </td>
      <td className="py-2 button-cell">
        {
          isFinished
          ? null
          : (
            <div className="relative">
              <Tooltip content={
                <div className="w-[200px]">
                  In case of canceling the Smart Deposit, the funds will be returned to your wallet.
                </div>
              } style="light" arrow={false}>
                <QuestionIcon height={16} width={16} className="absolute -right-1 -top-2" />
              </Tooltip>
              <Button onClick={cancelTransaction} variant="outline">Cancel</Button>
            </div>
          )
        }
      </td>
      <td className="py3 px-4 rounded-r-2xl">
        <Link to={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer noopener">
          <LinkIcon />
        </Link>
      </td>
    </tr>
  );
};

export default DesktopTransaction;
