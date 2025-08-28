// hooks/fetchWalletInfo.ts

import { erc20Abi } from 'viem';
import tokenAddresses from '../utils/tokens_addresses.json';
import dsfAddresses from '../utils/dsf_addresses.json';

export const fetchAllowances = async ({
  client,
  address,
}: {
  client: any;
  address: `0x${string}`;
}) => {
  const contractAddress = dsfAddresses.DSF as `0x${string}`;
  const tokens = ['USDT', 'USDC', 'DAI'] as const;

  const results = await Promise.allSettled(
    tokens.map((token) =>
      client.readContract({
        address: tokenAddresses[token] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, contractAddress],
      })
    )
  );

  return {
    USDT: results[0].status === 'fulfilled' ? results[0].value : 0n,
    USDC: results[1].status === 'fulfilled' ? results[1].value : 0n,
    DAI: results[2].status === 'fulfilled' ? results[2].value : 0n,
  };
};

export const fetchBalances = async ({
  client,
  address,
}: {
  client: any;
  address: `0x${string}`;
}) => {
  const tokens = ['USDT', 'USDC', 'DAI'] as const;

  const results = await Promise.allSettled(
    tokens.map((token) =>
      client.readContract({
        address: tokenAddresses[token] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      })
    )
  );

  return {
    USDT: results[0].status === 'fulfilled' ? results[0].value : 0n,
    USDC: results[1].status === 'fulfilled' ? results[1].value : 0n,
    DAI: results[2].status === 'fulfilled' ? results[2].value : 0n,
  };
};
