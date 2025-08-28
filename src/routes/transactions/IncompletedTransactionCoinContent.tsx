// IncompletedTransactionCoinContent.tsx

// components
import CurrencyIcon from '../../components/CurrencyIcon';

interface CompletedTransactionCoinContentProps {
  transactionToken: StableType;
  transactionAmount: number;
}

const IncompletedTransactionCoinContent = (props: CompletedTransactionCoinContentProps) => {
  const {
    transactionToken,
    transactionAmount
  } = props;

  return (
    <div className="flex items-center gap-2">
      <CurrencyIcon currency={transactionToken}/>
      {/* <CurrencyIcon currency={transactionToken} className="w-auto inline-block" /> */}
      <span>
        {`${transactionAmount.toLocaleString('en-US')} ${transactionToken}`}
      </span>
    </div>
  )
};

export default IncompletedTransactionCoinContent;
