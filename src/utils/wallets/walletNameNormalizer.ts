// utils/walletNameNormalizer.ts

const knownWallets: Record<string, string> = {
    'io.metamask': 'metamask',
    'com.walletconnect': 'walletconnect',
    'xyz.rabby': 'rabby',
    'trustwallet': 'trustwallet',
    // 'safepal wallet': 'trustwallet',
    'safepal wallet': 'safepal',
  };
  
  export function normalizeWalletName(rawName: string | undefined): string {
    if (!rawName) return '';
    const name = rawName.toLowerCase();
    return knownWallets[name] || name.split('.').pop() || name;
  }
  
