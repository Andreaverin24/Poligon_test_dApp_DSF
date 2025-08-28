// CurrencyIcon.tsx

import React from 'react';

// icons
import MixedToken from './MixedToken';
import { ReactComponent as USDT } from '../assets/images/currency/USDT.svg?react';
import { ReactComponent as USDC } from '../assets/images/currency/USDC.svg?react';
import { ReactComponent as DAI } from '../assets/images/currency/DAI.svg?react';
import { ReactComponent as CRV } from '../assets/images/currency/CRV.svg?react';
import { ReactComponent as CVX } from '../assets/images/currency/CVX.svg?react';
import { ReactComponent as cvxCRV } from '../assets/images/currency/cvxCRV.svg?react';
import { ReactComponent as cvxFXS } from '../assets/images/currency/cvxFXS.svg?react';
import { ReactComponent as FXS } from '../assets/images/currency/FXS.svg?react';
import { ReactComponent as ETH } from '../assets/images/currency/ETH.svg?react';

const CurrencyIcon = ({ 
    currency,
    className = 'w-6 h-6',
}: { 
    currency: StableType | YieldType | RewardsType | BlockChainType | 'MIXED';
    className?: string;
}) => {
    
    if (currency === 'MIXED') {
        return <MixedToken className={className} />;
    }

    const currencyIcons = {
        USDT: USDT,
        USDC: USDC,
        DAI: DAI,
        CRV: CRV,
        CVX: CVX,
        cvxCRV: cvxCRV,
        cvxFXS: cvxFXS,
        FXS: FXS,
        ETH: ETH
    };

    const Icon = currencyIcons[currency];

    return Icon ? <Icon className={className} /> : null;
};

export default CurrencyIcon;
