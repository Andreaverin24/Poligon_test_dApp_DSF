// wagmi/config.ts

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet } from 'wagmi/chains';
import { createConfig, http, fallback } from 'wagmi';

const projectId = import.meta.env.VITE_WEB3_MODAL_PROJECT_ID || '';

const infuraKey = import.meta.env.VITE_INFURA_API_KEY || '';
const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY || '';

const rpcUrls = [
  `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  `https://mainnet.infura.io/v3/${infuraKey}`,
  'https://rpc.ankr.com/eth',
  'https://eth-pokt.nodies.app',
  'https://ethereum.publicnode.com',
  'https://rpc.builder0x69.io',
  'https://cloudflare-eth.com',
];

export const wagmiAdapter  = new WagmiAdapter({
  projectId,
  ssr: true,
  networks: [
    {
      ...mainnet,
      rpcUrls: {
        default: {
          http: rpcUrls,
        },
      },
    },
  ],
});

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: fallback(
      rpcUrls.map((url) => http(url)),
    {
      rank: true,
      retryDelay: 500,
    }),
  },
});
