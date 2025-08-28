// MixedToken.tsx

import React from 'react';

// icons
import { ReactComponent as USDT } from '../assets/images/currency/USDT.svg?react';
import { ReactComponent as USDC } from '../assets/images/currency/USDC.svg?react';
import { ReactComponent as DAI } from '../assets/images/currency/DAI.svg?react';

const MixedToken = ({ 
  className = 'w-6 h-6' 
}: { 
  className?: string 
}) => {
  return (
    <div className="flex items-center mixed-currency">
      <USDT className={className} />
      <USDC className={className} />
      <DAI className={className} />
    </div>
  );
};

export default MixedToken;
