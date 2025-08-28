// useTokensBalance.tsx

import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import tokensAddresses from "../utils/tokens_addresses.json";

const useTokensBalance = () => {
    const { address, isConnected } = useAccount();

    const [balances, setBalances] = useState<Record<StableType, number>>({
        USDT: 0,
        USDC: 0,
        DAI: 0,
    });

    const { data: usdtData, isSuccess: usdtSuccess } = useBalance({
        address,
        token: tokensAddresses.USDT as `0x${string}`,
        query: { refetchInterval: 10_000, enabled: Boolean(address) },
    });

    const { data: usdcData, isSuccess: usdcSuccess } = useBalance({
        address,
        token: tokensAddresses.USDC as `0x${string}`,
        query: { refetchInterval: 10_000, enabled: Boolean(address) },
    });

    const { data: daiData, isSuccess: daiSuccess } = useBalance({
        address,
        token: tokensAddresses.DAI as `0x${string}`,
        query: { refetchInterval: 10_000, enabled: Boolean(address) },
    });

    useEffect(() => {
        if (!isConnected || !address) {
            setBalances({ USDT: 0, USDC: 0, DAI: 0 });
            return;
        }

        const format = (
            formatted: string | undefined,
            success: boolean
        ): number => {
            const val = formatted ? +formatted : NaN;
            return !isNaN(val) && success ? val : 0;
        };

        setBalances({
            USDT: format(usdtData?.formatted, usdtSuccess),
            USDC: format(usdcData?.formatted, usdcSuccess),
            DAI: format(daiData?.formatted, daiSuccess),
        });
    }, [
        usdtData,
        usdcData,
        daiData,
        usdtSuccess,
        usdcSuccess,
        daiSuccess,
        isConnected,
        address,
    ]);

    return balances;
};

export default useTokensBalance;
