import { useMemo } from 'react';
import type { TransactionStatus } from '../types/transactions';


interface CardProps {
  children: React.ReactNode;
  type?: TransactionStatus;
}

const Card = (props: CardProps) => {
  const {
    children,
    type
  } = props;

  const bgClass = useMemo(() => {
    switch (type) {
      case 'premium':
        return 'bg-[linear-gradient(#FBFBFD_50%,_#F1D7FF)]';
      case 'failed':
      case 'pending':
      case 'cancelled':
        return 'bg-[linear-gradient(#FBFBFD_50%,_#D7F5E8)]';
      case 'standard':
        return 'bg-[linear-gradient(#FBFBFD_50%,_#E0F3FF)]';
      case 'transfered':
        return 'bg-[linear-gradient(#FBFBFD_50%,_#F1D7FF)]';
      default:
        return 'bg-[linear-gradient(#FBFBFD_50%,_#E0F3FF)]';
    }
  }, [type]);

  return (
    <div className={`${bgClass} rounded-3xl p-6 tablet:px-10 py-8`}>
      {children}
    </div>
  )
};

export default Card;
