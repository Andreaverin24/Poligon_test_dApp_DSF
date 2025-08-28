// src/context/WalletStatusContext.tsx

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, Connector } from 'wagmi';

type WalletStatus = 'loading' | 'connected' | 'disconnected';

interface WalletStatusContextType {
  status: WalletStatus;
  connect: (connector: Connector) => void;
  connectors: readonly Connector[];
  error: Error | null;
}

const WalletStatusContext = createContext<WalletStatusContextType>({
  status: 'loading',
  connect: () => {},
  connectors: [],
  error: null,
});

export const WalletStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, isConnecting, isReconnecting, address } = useAccount();
  const [status, setStatus] = useState<WalletStatus>('loading');
  
  const {
    connect: wagmiConnect,
    connectors,
    status: connectStatus,
    error,
  } = useConnect();

  const connect = (connector: Connector) => {
    setStatus('loading');
    wagmiConnect({ connector });
  };

  useEffect(() => {
    if (isConnected && address) {
      setStatus('connected');
    } else if (connectStatus === 'pending' || isConnecting || isReconnecting) {
      setStatus('loading');
    } else if (connectStatus === 'error') {
      setStatus('disconnected');
    } else if (!isConnecting && !isReconnecting && connectStatus === 'idle') {
      setStatus('disconnected');
    }
  }, [isConnected, address, isConnecting, isReconnecting, connectStatus]);


  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (status === 'loading') {
      timeout = setTimeout(() => {
        setStatus((prev) => (prev === 'loading' ? 'disconnected' : prev));
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <WalletStatusContext.Provider
      value={{
        status,
        connect,
        connectors,
        error,
      }}
    >
      {children}
    </WalletStatusContext.Provider>
  );
};

export const useWalletStatus = (): WalletStatus => useContext(WalletStatusContext).status;

export const useWalletContext = () => useContext(WalletStatusContext);
