// src/hooks/useReApprove.tsx

import { useState, useEffect, useCallback } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import dsfAddresses from '../utils/dsf_addresses.json';
import usdtAbi from '../utils/usdt_abi.json'
import { getStableTokenByAddress } from '../utils/getStableTokenByAddress';
import useGlobalContext from './useGlobalContext';

interface UseReApproveProps {
  tokenAddress: `0x${string}`;
  amount: bigint;
  isUSDT: boolean;
}

const useReApprove = ({ tokenAddress, amount, isUSDT }: UseReApproveProps) => {
  const [resetStep, setResetStep] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [currentTx, setCurrentTx] = useState<'reset' | 'approve' | null>(null);

  const [isReapproving, setIsReapproving] = useState(false);
  const { writeContractAsync, isPending, isSuccess, data } = useWriteContract()

  const { tokenAllowances, setTokenAllowances } = useGlobalContext();
  const { isConnected } = useAccount();
  
  const updateGlobalAllowance = useCallback((newAmount: bigint) => {
    const token = getStableTokenByAddress(tokenAddress);
    if (!token) return;
    setTokenAllowances(prev => ({
      ...prev,
      [token]: newAmount,
    }));
  }, [tokenAddress, setTokenAllowances]);

  const approve = useCallback(async (): Promise<`0x${string}` | undefined> => {
    if (isReapproving) {
      console.warn('[useReApprove] Already approving...');
      return;
    }

    if (!isConnected) {
      console.warn('🚫 Wallet not connected');
      return;
    }

    setIsReapproving(true);
    try {
      let txHash: `0x${string}` | undefined;

      if (isUSDT && !resetStep) {
        console.log('reset allowance...');
        setCurrentTx('reset');
        txHash = await writeContractAsync({
          address: tokenAddress,
          abi: usdtAbi,
          functionName: 'approve',
          args: [dsfAddresses.DSF as `0x${string}`, 0n],
        })
        console.log('✅ ReApprove successful TX:', txHash);

        updateGlobalAllowance(0n);

        setResetStep(true);
        setCurrentTx('approve');
      }

      if (!isUSDT || resetStep) {
        console.log('approve...');
        setCurrentTx('approve');
        txHash = await writeContractAsync({
          address: tokenAddress,
          abi: usdtAbi,
          functionName: 'approve',
          args: [dsfAddresses.DSF as `0x${string}`, amount],
        })
        console.log('✅ Approve successful TX:', txHash);

        updateGlobalAllowance(amount);

        setResetStep(false);
      }

      return txHash;
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.includes('User rejected')) {
        console.warn('⛔ ReApprove cancelled by user');
      } else {
        console.error('❌ ReApprove error:', err);
      }
      
      setError(err);
      return undefined;
    } finally {
      setCurrentTx(null);
      setIsReapproving(false);
    }
  }, [tokenAddress, amount, isUSDT, resetStep, writeContractAsync, updateGlobalAllowance]);

  useEffect(() => {
    console.log(
      '[useReApprove] currentTx:', currentTx,
      '[useReApprove] resetStep:', resetStep,
      '[useReApprove] amount:', amount.toString());
  }, [currentTx, resetStep, amount]);

  return {
    approve,
    isLoading: isPending || isReapproving,
    isSuccess,
    error,
    currentTx,
    data,
  };
};

export default useReApprove;
