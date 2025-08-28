import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

type TokenSym = "USDT" | "USDC" | "DAI" | "ETH" | "WBTC" | string;

export type SwapQuote = {
    amountIn: number; // в единицах токена (не wei)
    amountOut: number; // ожидаемый результат (не wei)
    priceImpactPct?: number; // необязательно
    routePayload?: `0x${string}`; // готовый payload для universalRouter.swapWithPayload(...)
    tokenIn?: TokenSym;
    tokenOut?: TokenSym;
    deadline?: number; // unix seconds
};

type Ctx = {
    // выбор токенов и сумм
    tokenIn: TokenSym | null;
    tokenOut: TokenSym | null;
    amountIn: string; // как строка из input, с max 2 знаками после запятой
    minAmountOut: string; // по слippage (напр. 0.5-1.0%) вычисляется из quote
    changeTokenIn: (s: TokenSym) => void;
    changeTokenOut: (s: TokenSym) => void;
    changeAmountIn: (s: string) => void;
    changeMinAmountOut: (s: string) => void;
    flipTokens: () => void;

    // комиссии газа / режим
    optimized: boolean | null;
    changeOptimized: (v: boolean) => void;
    displayFeeUsd?: number;
    displayFeeEth?: number;
    setDisplayFeeUsd: (v?: number) => void;
    setDisplayFeeEth: (v?: number) => void;

    // котировка и готовность
    quote: SwapQuote | null;
    setQuote: (q: SwapQuote | null) => void;
    isValid: boolean; // есть токены, amountIn>0, есть quote и minAmountOut<=quote.amountOut
};

const SwapContext = createContext<Ctx | null>(null);

export const SwapProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [tokenIn, setTokenIn] = useState<TokenSym | null>(null);
    const [tokenOut, setTokenOut] = useState<TokenSym | null>(null);
    const [amountIn, setAmountIn] = useState<string>("");
    const [minAmountOut, setMinAmountOut] = useState<string>("");

    const [optimized, setOptimized] = useState<boolean | null>(null);
    const [displayFeeUsd, setDisplayFeeUsd] = useState<number | undefined>();
    const [displayFeeEth, setDisplayFeeEth] = useState<number | undefined>();

    const [quote, setQuote] = useState<SwapQuote | null>(null);

    const changeTokenIn = useCallback((s: TokenSym) => setTokenIn(s), []);
    const changeTokenOut = useCallback((s: TokenSym) => setTokenOut(s), []);
    const changeAmountIn = useCallback((s: string) => setAmountIn(s), []);
    const changeMinAmountOut = useCallback(
        (s: string) => setMinAmountOut(s),
        []
    );
    const changeOptimized = useCallback((v: boolean) => setOptimized(v), []);
    const flipTokens = useCallback(() => {
        setTokenIn((prev) => {
            const nextIn = tokenOut ?? prev;
            setTokenOut(prev ?? tokenOut);
            return nextIn;
        });
    }, [tokenOut]);

    const isValid = useMemo(() => {
        const amt = Number(amountIn);
        const minOut = Number(minAmountOut);
        return (
            !!tokenIn &&
            !!tokenOut &&
            !!quote &&
            amt > 0 &&
            !Number.isNaN(minOut) &&
            quote.amountOut >= minOut &&
            quote.tokenIn === tokenIn &&
            quote.tokenOut === tokenOut
        );
    }, [tokenIn, tokenOut, amountIn, minAmountOut, quote]);

    const value: Ctx = {
        tokenIn,
        tokenOut,
        amountIn,
        minAmountOut,
        changeTokenIn,
        changeTokenOut,
        changeAmountIn,
        changeMinAmountOut,
        flipTokens,
        optimized,
        changeOptimized,
        displayFeeUsd,
        displayFeeEth,
        setDisplayFeeUsd,
        setDisplayFeeEth,
        quote,
        setQuote,
        isValid,
    };

    return (
        <SwapContext.Provider value={value}>{children}</SwapContext.Provider>
    );
};

export default function useSwapContext() {
    const ctx = useContext(SwapContext);
    if (!ctx)
        throw new Error("useSwapContext must be used within SwapProvider");
    return ctx;
}
