// walletIcons.tsx

import React, { useState } from 'react';
import { InlineSvg } from '../../components/InlineSvg';

// svg icons
import metamaskSvg from '../../assets/svg/wallets/metamask';
import walletconnectSvg from '../../assets/svg/wallets/walletconnect';
import rabbySvg from '../../assets/svg/wallets/rabby';
import safepalSvg from '../../assets/svg/wallets/safepal';
import trustwalletSvg from '../../assets/svg/wallets/trustwallet';

import fallbackSvg from '../../assets/svg/wallets/fallback';

import { normalizeWalletName } from './walletNameNormalizer'; 

type Props = {
  walletName?: string;
  className?: string;
};

const getCdnIconUrl = (walletName: string) =>
  `https://raw.githubusercontent.com/walletconnect/walletconnect-assets/master/logo/svg/${walletName}.svg`;

export const WalletIcon: React.FC<Props> = ({ walletName, className = 'w-4 h-4 mr-1' }) => {
  const [cdnError, setCdnError] = useState(false);
  const name = normalizeWalletName(walletName);

  const localSvgs: Record<string, string> = {
    metamask: metamaskSvg,
    walletconnect: walletconnectSvg,
    rabby: rabbySvg,
    safepal: safepalSvg,
    trustwallet: trustwalletSvg,
  };

  const localSvg = localSvgs[name];

  if (localSvg) {
    return <InlineSvg svg={localSvg} className={className} />;
  }

  if (!cdnError && name) {
    return (
      <img
        src={getCdnIconUrl(name)}
        alt={name}
        className={className}
        onError={() => setCdnError(true)}
      />
    );
  }

  return <InlineSvg svg={fallbackSvg} className={`${className} text-gray-400`} />;
};
