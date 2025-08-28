// components/RequireWallet.tsx

import { Navigate, useLocation } from 'react-router-dom';
import { useWalletContext } from '../context/WalletStatusContext';

const RequireWallet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useWalletContext();
    const location = useLocation();

    const isReady = status !== 'loading';
    const isConnected = status === 'connected';

    if (isReady && !isConnected && !location.pathname.startsWith('/deposit')) {
        return <Navigate to="/deposit" replace state={{ from: location }} />;
    }
    
    return <>{children}</>;
};

export default RequireWallet;
