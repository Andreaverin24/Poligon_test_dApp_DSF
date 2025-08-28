// header/Conntected.tsx

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi';
import { useAppKit, useWalletInfo } from '@reown/appkit/react';
import { useTranslation } from 'react-i18next';
import { WalletIcon } from '../../../utils/wallets/walletIcons';
import { useNotifications } from '../../notifications/NotificationContext';
import Spinner from '../../components/Spinner';
import useGlobalContext from '../../../hooks/useGlobalContext';
import Logger from '../../../utils/logger';
import { useAutoReconnect } from '../../../hooks/useAutoReconnect';

// icons
import { ReactComponent as Ethereum } from '../../../assets/images/currency/ETH.svg?react';

const Connected = () => {
  const { 
    walletName,
    tokenBalances,
    tokenAllowances, 
  } = useGlobalContext();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { t } = useTranslation('header');
  const { notify } = useNotifications();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [isConnectingFlag, setIsConnecting] = useState(false);
  const [resetReconnectTrigger, setResetReconnectTrigger] = useState(false);

  const chainId = useChainId();
  const isMetaMask = walletName === 'metamask';
  
  const shortAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  }, [address]);

  const statusDotColor = isMetaMask
    ? (chainId === 1 ? 'bg-green-300' : 'bg-red-500')
    : 'bg-green-300';
  
  const walletClickHandler = useCallback(async () => {
    if (isConnectingFlag) return;

    setResetReconnectTrigger(true);
    setIsConnecting(true);

    const openView = async (view: 'Connect' | 'Account') => {
      try {
        await open({ view });
      } catch (err) {
        console.error(`Failed to open view: ${view}`, err);
      }
    };
  
    try {
      if (address && isConnected) {
        await openView('Account');
        return;
      }
      
      // Show modal if not connected or not Ethereum mainnet
      if (!address) {
        await openView('Connect');
        return;
      }

      if (typeof window !== 'undefined' && (window as any).ethereum && chainId !== 1) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          });
        } catch (err: unknown) {
          console.error('Error switching chain:', err);

          const errorCode = typeof err === 'object' && err !== null && 'code' in err ? (err as any).code : null;

          if (errorCode === 4001) {
            // Refusal to change network            
            notify(t('switch_rejected') || 'Network switch rejected.', 'warning');
          } else {
            await openView('Connect');
          }
        }
      }

    } catch (err) {
      console.error('Open/connect error:', err);
      setTimeout(() => openView('Connect'), 500);
    } finally {
      setIsConnecting(false);
    }
  }, [address, chainId, open, isConnectingFlag, notify, t, isConnected]);

  useAutoReconnect(connectors.slice(), resetReconnectTrigger);

  useEffect(() => {
    if (resetReconnectTrigger) {
      setResetReconnectTrigger(false);
    }
  }, [resetReconnectTrigger]);
  
  if (!address || !isConnected) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Wallet status"
      onClick={walletClickHandler}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          walletClickHandler();
        }
      }}
      className={`flex items-center transition-opacity ${
        isConnectingFlag ? 'opacity-60 cursor-wait' : 'opacity-100 cursor-pointer'
      }`}
    >
      <div className="flex flex-col gap-1 mr-2">
        {/* Address – mobile */}
        <div className="flex items-center pl-[3px] text-blue text-[14px] font-semibold tablet:hidden ">
          <span className={`w-3 h-3 mr-1 rounded-full ${statusDotColor}`} />
          {WalletIcon && <WalletIcon walletName={walletName} className="mr-1 w-4 h-4" />}
          {shortAddress || 'NO ADDRESS'}
        </div>

        {/* Address – tablet+ */}
        <div className="hidden gap-1 items-center pl-[3px] text-blue text-[14px] font-semibold tablet:flex">
          <span className={`w-3 h-3 mr-1 rounded-full ${statusDotColor}`} />
          {WalletIcon && <WalletIcon walletName={walletName} className="mr-1 w-4 h-4" />}
          {shortAddress || 'NO ADDRESS'}
        </div>

        {/* Status */}
        {isConnectingFlag ? (
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <Spinner size="sm" />
            <span>{t('connecting') || 'Connecting...'}</span>
          </div>
        ) : isMetaMask && chainId !== 1 ? (
          <div className="text-[12px] font-medium text-red-500">
            {t('switch_to_eth') || 'Switch to Ethereum'}
          </div>
        ) : (
          <div className="flex items-center text-[12px] font-medium text-gray-800">
            <Ethereum className="mr-1 w-4 h-4" />
            Ethereum
          </div>
        )}
      </div>
    </div>
  )
};

export default Connected;
