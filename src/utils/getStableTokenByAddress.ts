// src/utils/getStableTokenByAddress.ts

import tokenAddresses from './tokens_addresses.json';

const stableTokenAddresses = {
  USDT: tokenAddresses.USDT.toLowerCase(),
  USDC: tokenAddresses.USDC.toLowerCase(),
  DAI: tokenAddresses.DAI.toLowerCase(),
};

export const getStableTokenByAddress = (
  address: string
): StableType | undefined => {
  const lower = address.toLowerCase();

  return (Object.entries(stableTokenAddresses).find(
    ([, value]) => value === lower
  )?.[0] ?? undefined) as StableType | undefined;
};
