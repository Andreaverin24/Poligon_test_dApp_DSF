// useApprove.tsx

import { useCallback, useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { erc20Abi, maxUint256 } from 'viem'
import dsfAddresses from '../utils/dsf_addresses.json';
import { getStableTokenByAddress } from '../utils/getStableTokenByAddress';
import useGlobalContext from './useGlobalContext';

const useApprove = (tokenAddress: `0x${string}`) => {
  const { isConnected } = useAccount();
  const { tokenAllowances, setTokenAllowances } = useGlobalContext();
  const { writeContractAsync, isPending, isSuccess, error, data } = useWriteContract()
  const [isApproving, setIsApproving] = useState(false);

  const updateGlobalAllowance = useCallback((newAmount: bigint) => {
      const token = getStableTokenByAddress(tokenAddress);
      if (!token) return;
      setTokenAllowances(prev => ({
        ...prev,
        [token]: newAmount,
      }));
    }, [tokenAddress, setTokenAllowances]);

  const approve = useCallback(async (): Promise<`0x${string}` | undefined> => {
    if (isApproving) {
      console.warn('Approve already in progress...');
      return;
    }

    if (!isConnected) {
      console.warn('🚫 Wallet not connected');
      return;
    }

    setIsApproving(true);
    
    try {
      const txHash = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [dsfAddresses.DSF as `0x${string}`, maxUint256],
      });
      console.log('✅ Approve successful tx sent:', txHash);
      
      updateGlobalAllowance(maxUint256);

      return txHash;
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.includes('User rejected')) {
        console.warn('⛔ Approve cancelled by user');
      } else {
        console.error('❌ Approve failed:', err);
      }
      return undefined;
    } finally {
      setIsApproving(false);
    }
  }, [tokenAddress, writeContractAsync]);

  return {
    approve,
    isPending: isPending || isApproving,
    isSuccess,
    error,
    data,
  };
};

export default useApprove;
