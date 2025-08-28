// components/swap/ResultSection.tsx

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CurrencyIcon from "../../components/CurrencyIcon";
import ValueWithFallback from "../../components/ValueWithFallback";
import useDepositContext from "../../hooks/useDepositContext";
import useGlobalContext from "../../hooks/useGlobalContext";

const ResultSection = () => {
    const { selectedCurrency, depositAmount } = useDepositContext();
    const { walletInfo } = useGlobalContext();
    const { t } = useTranslation("deposit");

    const interestRate = Number(walletInfo?.apy_today ?? 0);

    const isCalculatingSlippage = !walletInfo?.round_trip_efficiency;
    const depositResultWithSlippage = useMemo(() => {
        const eff = +(
            walletInfo?.round_trip_efficiency?.[selectedCurrency ?? "USDT"] ??
            "1"
        );
        return +(Number(depositAmount || 0) * eff).toFixed(2);
    }, [depositAmount, selectedCurrency, walletInfo]);

    // if (!selectedCurrency || !depositAmount) return null; text-blue-600 font-medium

    return (
        <div className="w-[384px] h-[215px] bg-[#FBFBFD] rounded-2xl p-4 flex flex-col justify-between mx-auto px-6 py-5 relative">
            {/* Заголовок */}
            <div className="flex justify-between items-center text-base font-medium text-blue-600 mb-2">
                <span>{t("result_slippage")}</span>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex-grow text-blue-900 text-[2rem]">
                    {!selectedCurrency ||
                    !depositAmount ||
                    Number(depositAmount) === 0 ? (
                        <span className="text-[40px] font-medium text-gray-400 select-none">
                            0.00
                        </span>
                    ) : (
                        <ValueWithFallback
                            value={depositResultWithSlippage}
                            loading={isCalculatingSlippage}
                            unit=""
                            precision={2}
                            className="w-full text-[40px] font-medium text-blue-900 text-[#3B4B66]
                                placeholder:text-gray-400 outline-none border-none
                                focus:outline-none focus:ring-0 bg-transparent text-left p-0"
                        />
                    )}
                </div>
                {selectedCurrency && (
                    <div className="ml-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        <CurrencyIcon currency={selectedCurrency} />
                        <span className="pl-1 text-base font-medium text-[#3B4B66]">
                            {selectedCurrency}
                        </span>
                    </div>
                )}
                {/* <div className="ml-2 w-[110px]">

                </div> */}
            </div>
            {/* <div className="flex items-center text-[2rem] font-semibold">
                <Tooltip
                    content={t("fourth_step_toltip")}
                    style="light"
                    arrow={false}
                >
                    <QuestionIcon className="ml-3 w-5 h-5 text-gray-400" />
                </Tooltip>
            </div> */}

            {/* Текст Текущая ставка доходности слева, значение справа */}
            <div className="text-base text-gray-500 mt-3 flex items-center justify-between w-full">
                <div className="flex justify-between items-center text-base font-medium text-blue-600">
                    <span>{t("estimate_rate")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ValueWithFallback
                        value={Number(interestRate)}
                        loading={
                            interestRate === undefined || interestRate === null
                        }
                        unit="%"
                        precision={2}
                        className=""
                    />
                </div>
            </div>
        </div>
    );
};

export default ResultSection;
