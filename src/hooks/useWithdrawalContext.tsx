import { useContext } from 'react';
import { WithdrawalContext } from '../context/WithdrawalContext';

const useWithdrawalContext = () => {
  const context = useContext(WithdrawalContext);

  if (!context) {
    throw new Error('useWithdrawalContext must be used within a WithdrawalProvider');
  }

  return context;
}

export default useWithdrawalContext;
