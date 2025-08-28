import { useContext } from 'react';
import { DepositContext } from '../context/DepositContext';

const useDepositContext = () => {
  const context = useContext(DepositContext);
  if (!context) {
    throw new Error('useDepositContext must be used within a DepositProvider');
  }
  return context;
}

export default useDepositContext;