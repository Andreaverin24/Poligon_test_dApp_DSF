// DataContainer.tsx

import { useCallback, useEffect, useRef } from "react";
import { fetchAllowances, fetchBalances } from "../../hooks/fetchWalletInfo";
import { useFastGasClient } from "../../hooks/useFastGasClient";
import useGlobalContext from "../../hooks/useGlobalContext";
import { useResetAllContextsOnDisconnect } from "../../hooks/useResetAllContextsOnDisconnect";
import useTokensBalance from "../../hooks/useTokensBalance";

import { useWalletInfo } from "@reown/appkit/react";
import { Navigate, useLocation } from "react-router-dom";

import axios from "axios";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import dsfABI from "../../utils/dsf_abi.json";
import dsfAddresses from "../../utils/dsf_addresses.json";

// Security
import { generateHmacHeadersGET } from "../../security-toolkit/client/generateHmacHeadersGET";

interface DataContainerProps {
    children: React.ReactNode;
}

const DataContainer = (props: DataContainerProps) => {
    const { walletInfo } = useWalletInfo();
    const { children } = props;

    useResetAllContextsOnDisconnect();

    const {
        changeWallet,
        changeBalance,
        balance,
        changeGasPrice,
        setETHPrice,
        changeManagedInDSF,
        changeDSFLPPrice,
        changeDSFLPTotalSupply,
        changeUserDeposits,
        changeInterestRate,
        changeCurrentInterestRate,
        userDeposits,
        dsfLpBalance,
        gasPrice,
        ETHPrice,
        changeWithdrawableIncome,
        changeDsfLpBalance,
        setWalletInfo,
        setTransactions,
        changeDepositGasFeeUsd,
        changeOptimizedDepositGasFeeUsd,
        changeWithdrawalGasFeeUsd,
        changeOptimizedWithdrawalGasFeeUsd,
        walletName,
        tokenBalances,
        tokenAllowances,
        setTokenAllowances,
        setTokenBalances,
        setWalletName,
    } = useGlobalContext();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { address, isConnected } = useAccount();
    const location = useLocation();

    const {
        USDT: usdtBalance,
        USDC: usdcBalance,
        DAI: daiBalance,
    } = useTokensBalance();

    // const client = usePublicClient();
    const client = useFastGasClient();
    if (!client) return;

    const { data: dsfLPBalance, isSuccess: isBalanceSuccess } = useReadContract(
        {
            address: dsfAddresses.DSF as `0x${string}`,
            abi: dsfABI,
            functionName: "balanceOf",
            args: [address],
            query: {
                refetchInterval: 15_000,
            },
        }
    );

    const { data: lpPrice, isSuccess: isPriceSuccess } = useReadContract({
        address: dsfAddresses.DSF as `0x${string}`,
        abi: dsfABI,
        functionName: "lpPrice",
        query: {
            refetchInterval: 15_200,
        },
    });

    const { data: dsfLPTotalSupply, isSuccess: isTotalSupplySuccess } =
        useReadContract({
            address: dsfAddresses.DSF as `0x${string}`,
            abi: dsfABI,
            functionName: "totalSupply",
            query: {
                refetchInterval: 15_300,
            },
        });

    const getEthPrice = useCallback(async () => {
        const ethPriceInUsdResponse = await axios.get(
            "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );

        return ethPriceInUsdResponse.data.USD;
    }, []);

    const getYields = useCallback(async () => {
        const hmacHeaders = await generateHmacHeadersGET(
            "anonymous",
            import.meta.env.VITE_DSF_HMAC_SECRET
        );

        const response = await axios.get(
            "https://watchdog.dsf.finance/proxy/yields_llama",
            {
                headers: {
                    "x-proxy-secret": import.meta.env.VITE_DSF_PROXY_SECRET,
                    "x-source": window.location.hostname,
                    ...hmacHeaders,
                },
            }
        );

        return response.data.data;
    }, []);

    const getAnnualIncome = useCallback(
        (yields: Array<{ apy: number }>): number => {
            if (!Array.isArray(yields) || yields.length === 0) return 0;
            const total = yields.reduce((a, b) => a + b.apy, 0);
            const average = total / yields.length;
            return +(average * 0.8).toFixed(2);
        },
        []
    );

    useEffect(() => {
        changeWallet(address || "");
    }, [address, changeWallet]);

    useEffect(() => {
        if (usdtBalance !== balance.USDT) changeBalance("USDT", usdtBalance);
        if (usdcBalance !== balance.USDC) changeBalance("USDC", usdcBalance);
        if (daiBalance !== balance.DAI) changeBalance("DAI", daiBalance);
    }, [usdtBalance, usdcBalance, daiBalance, balance, changeBalance]);

    const fetchGasPrice = useCallback(async () => {
        try {
            const gas = await client.getGasPrice();
            changeGasPrice(Number(formatUnits(gas, 9)));
        } catch (err: any) {
            if (
                err?.message === "TimeoutError" &&
                typeof client.transport?.retry === "function"
            ) {
                console.warn("⚠️ Gas price timeout, retrying...");
                client.transport.retry?.();
            } else {
                console.error("Failed to fetch gas price:", err);
            }
        }
    }, [client, changeGasPrice]);

    useEffect(() => {
        if (!client) return;

        fetchGasPrice();
        const interval = setInterval(fetchGasPrice, 15100); // apdate every 15 sec

        return () => clearInterval(interval);
    }, [fetchGasPrice]);

    useEffect(() => {
        getEthPrice().then(setETHPrice);
    }, [getEthPrice, setETHPrice]);

    useEffect(() => {
        if (lpPrice && isPriceSuccess) {
            changeDSFLPPrice(+formatUnits(lpPrice as bigint, 18));
        }
    }, [lpPrice, isPriceSuccess, changeDSFLPPrice]);

    useEffect(() => {
        if (dsfLPBalance && isBalanceSuccess) {
            changeDsfLpBalance(dsfLPBalance as bigint);
            changeManagedInDSF(+formatUnits(dsfLPBalance as bigint, 18));
        }
    }, [dsfLPBalance, isBalanceSuccess, changeManagedInDSF]);

    useEffect(() => {
        if (dsfLPTotalSupply && isTotalSupplySuccess) {
            changeDSFLPTotalSupply(
                +formatUnits(dsfLPTotalSupply as bigint, 18)
            );
        }
    }, [dsfLPTotalSupply, isTotalSupplySuccess, changeDSFLPTotalSupply]);

    useEffect(() => {
        getYields()
            .then((yields) => {
                if (!Array.isArray(yields) || yields.length === 0) {
                    console.warn("Empty or invalid yields array:", yields);
                    changeInterestRate(0);
                    changeCurrentInterestRate(0);
                    return;
                }

                changeInterestRate(getAnnualIncome(yields));

                const last = yields.at(-1);
                if (last && typeof last.apy === "number") {
                    changeCurrentInterestRate(+(last.apy * 0.8).toFixed(2));
                } else {
                    console.warn("Invalid last yield object:", last);
                    changeCurrentInterestRate(0);
                }
            })
            .catch((error) => {
                console.error(
                    "Something went wrong while getting yields: ",
                    error
                );
            });
    }, [getYields, getAnnualIncome, changeInterestRate]);

    useEffect(() => {
        if (!address) return;

        let isCancelled = false;
        const currentAddress = address;

        const fetchGlobalData = async () => {
            const mockWalletInfo = {
                user_deposits: "800.32",
                dsf_lp_balance: "622.250400316562831904",
                ratio_user: "0.0482597771913143",
                available_to_withdraw: "810.467892",
                available_to_withdraw_More: {
                    DAI: "810.805532727549234551",
                    USDC: "810.805134",
                    USDT: "810.467892",
                },
                cvx_share: "0.001887300864139535",
                cvx_cost: "0.004113",
                crv_share: "1.887300864139535683",
                crv_cost: "0.919662",
                annual_yield_rate: "6.26",
                apy_today: 6.97,
                apy_365: 14.42,
                eth_spent: "0.007257023291199472",
                usd_spent: "16.83",
                eth_saved_deposit: "0.020707409999999999",
                eth_saved_withdraw: "0.011121809999999999",
                usd_saved_deposit: "40.87",
                usd_saved_withdraw: "20.13",
                round_trip_efficiency: {
                    DAI: "0.999212911290561112",
                    USDC: "0.998912452419793429",
                    USDT: "0.999182144454461185",
                },
                eth_balance: "10.00034099999",
                balances: {
                    DAI: "0.000971003444238008",
                    USDC: "0.001839",
                    USDT: "19.988860",
                },
                allowances: {
                    DAI: "0.000000000000000000",
                    USDC: "0.000000",
                    USDT: "1.157920892373162e+71",
                },
                static_gas: {
                    ethPriceUsd: 2508.69,
                    gasPriceGwei: 0.25,
                    estimates: {
                        deposit: {
                            gasUnits: 1472983,
                            gasEth: 0.00064479,
                            gasUsd: 1.6176,
                        },
                        feesOptimizationDeposit: {
                            gasUnits: 86514,
                            gasEth: 0.00003787,
                            gasUsd: 0.095,
                        },
                        withdraw: {
                            gasUnits: 1186843,
                            gasEth: 0.00051954,
                            gasUsd: 1.3034,
                        },
                        feesOptimizationWithdrawal: {
                            gasUnits: 57449,
                            gasEth: 0.00002515,
                            gasUsd: 0.0631,
                        },
                    },
                },
            };

            const mockTransactions: any[] = []; // можешь добавить тестовые транзакции

            if (!isCancelled && address === currentAddress) {
                setWalletInfo(mockWalletInfo);
                setTransactions(mockTransactions);
            }
        };

        // const fetchGlobalData = async () => {
        //     try {
        //         const hmacSecret = import.meta.env.VITE_DSF_HMAC_SECRET;
        //         const hmacHeaders = await generateHmacHeadersGET(
        //             address,
        //             hmacSecret
        //         );
        //         const url = `https://watchdog.dsf.finance/proxy/walletinfo?wallet=${encodeURIComponent(address)}`;

        //         const response = await fetch(url, {
        //             method: "GET",
        //             headers: {
        //                 "x-proxy-secret": import.meta.env.VITE_DSF_PROXY_SECRET,
        //                 "x-source": window.location.hostname,
        //                 ...hmacHeaders,
        //             },
        //         });

        //         const { valid, body } = await verifyResponseFromHeadersWithBody(
        //             response,
        //             hmacSecret
        //         );

        //         if (!valid) {
        //             console.warn(
        //                 "❌ Ответ подделан или повреждён (verifyResponseFromHeadersWithBody)"
        //             );
        //             return;
        //         }

        //         const parsed = JSON.parse(body);
        //         const { walletInfo, transactions } = parsed;

        //         if (!isCancelled && address === currentAddress) {
        //             setWalletInfo(walletInfo);
        //             setTransactions(transactions);
        //         }
        //     } catch (error) {
        //         if (!isCancelled) {
        //             console.error(
        //                 "❌ Ошибка при получении данных кошелька:",
        //                 error
        //             );
        //         }
        //     }
        // };
        fetchGlobalData();

        const interval = setInterval(fetchGlobalData, 15_000);

        return () => {
            isCancelled = true;
            clearInterval(interval);
        };
    }, [address, setWalletInfo, setTransactions]);

    useEffect(() => {
        if (walletInfo?.name) {
            console.log(
                "👤 Wallet name updated from walletInfo:",
                walletInfo.name
            );
            setWalletName(walletInfo.name.toLowerCase());
        }
    }, [walletInfo?.name, setWalletName]);

    useEffect(() => {
        if (!client || !address) return;

        console.log("🔁 [BalancesEffect] Triggered: client/address changed", {
            address,
            client:
                typeof client?.transport?.url === "string"
                    ? client.transport.url
                    : "[unknown]",
        });

        const updateAllowancesBalances = async () => {
            try {
                const [allowances, balances] = await Promise.all([
                    fetchAllowances({ client, address }),
                    fetchBalances({ client, address }),
                ]);

                console.log("✅ Balances fetched", { balances });
                console.log("✅ Allowances fetched", { allowances });

                setTokenAllowances(allowances);
                setTokenBalances(balances);
            } catch (err) {
                console.warn(
                    "❌ Error in initial fetch of balances/allowances",
                    err
                );
            }
        };

        updateAllowancesBalances();
    }, [address]);

    // on mount
    useEffect(() => {
        if (!client) return;

        const transport = (client as any)?.transport;

        let resolvedUrl = "[unknown transport]";
        if (typeof transport?.url === "string") {
            resolvedUrl = transport.url;
        } else if (typeof transport?.key === "string") {
            resolvedUrl = `[WalletConnect: ${transport.key}]`;
        } else if (
            typeof transport?.name === "string" &&
            transport.name === "fallback"
        ) {
            resolvedUrl = "[WalletConnect: fallback chain RPC]";
        }

        try {
            console.log("🔍 Active RPC URL:", resolvedUrl);
        } catch (err) {
            console.warn("⚠️ Failed to log RPC URL", err);
        }
    }, []);

    // if (!address) {
    //     return <Navigate to="/deposit" replace />;
    // }

    if (!isConnected && location.pathname !== "/deposit") {
        return <Navigate to="/deposit" replace />;
    }

    return <>{children}</>;
};

export default DataContainer;
