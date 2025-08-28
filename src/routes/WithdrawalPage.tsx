// WithdrawalPage.tsx

import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';

import useWithdrawalContext from '../hooks/useWithdrawalContext';
import useGlobalContext from '../hooks/useGlobalContext';
import magicNumbers from '../utils/magic_numbers.json';
import { useSimulateGasEstimates } from '../hooks/useSimulateGasEstimates';

// components
import WithdrawalNavigation from './withdrawal/WithdrawalNavigation';
import WithdrawalCard from './withdrawal/WithdrawalCard';
import FAQ from './withdrawal/FAQContainer';

const WithdrawalPage = () => {
  const { resetContext } = useWithdrawalContext();

  useSimulateGasEstimates();
  
  const {
    ETHPrice,
    gasPrice,
  } = useGlobalContext();

  const { 
    address, 
    isConnecting,
  } = useAccount();

  if (!isConnecting && !address) return <Navigate to="/deposit" replace />;

  // when leaving the page
  // reset when changing wallet on the same page
  useEffect(() => {
    resetContext();
    return () => resetContext();
  }, [address]);

  return (
    <>
      <WithdrawalNavigation />
      <WithdrawalCard />
      <FAQ />
    </>
  )
};

export default WithdrawalPage;
