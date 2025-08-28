// wagmi.config.ts

import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { mainnet } from 'wagmi/chains';
import dsfAbi from './src/utils/dsf_abi.json' assert { type: 'json' };
import { Abi } from 'viem';

export default defineConfig({
  out: './src/wagmi.generated.ts',
  plugins: [
    react(),
  ],
  contracts: [
    {
      name: 'DSF',
      abi: dsfAbi as Abi,
      address: {
        [mainnet.id]: '0x22586ea4fDaA9Ef012581109B336f0124530Ae69',
      },
    },
  ],
});
