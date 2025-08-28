//  withdrawal/steps/FirstStep.tsx

import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import useGlobalContext from "../../../hooks/useGlobalContext";
import useWithdrawalContext from "../../../hooks/useWithdrawalContext";

// components
import Button from "../../../components/CustomButton";
import Input from "../../../components/Input";
import { floorToFixed } from "../../../utils/floorToFixed";
import CurrencyDropdown from "../../components/CurrencyDropdown";
import StepsContainer from "../../deposit/steps/StepsContainer";

const FirstStep = () => {
    const { address } = useAccount();
    const { t } = useTranslation("withdraw");
    const navigate = useNavigate();

    const MIN_UNSPENT_AMOUNT = 50; // $
    const MIN_UNSPENT_PERCENT = 0.25; // %

    const {
        selectedCurrency,
        changeSelectedCurrency,
        amountToWithdraw,
        changeAmountToWithdraw,
        changeCurrentStep,
        changeAmountToWithdrawInPercentage,
    } = useWithdrawalContext();

    const { walletInfo } = useGlobalContext();

    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModal2, setShowModal2] = useState<boolean>(false);

    const availableToWithdraw = useMemo(() => {
        const raw = parseFloat(
            walletInfo?.available_to_withdraw_More?.[
                selectedCurrency || "USDT"
            ] ||
                walletInfo?.available_to_withdraw ||
                "0"
        );
        return floorToFixed(raw, 2);
    }, [
        walletInfo?.available_to_withdraw_More,
        walletInfo?.available_to_withdraw,
        selectedCurrency,
    ]);

    const isWithdrawAmountValid = useMemo(() => {
        if (!amountToWithdraw || !selectedCurrency) return false;
        if (Number(amountToWithdraw) <= 0) return false;

        return Number(amountToWithdraw) <= availableToWithdraw;
    }, [amountToWithdraw, availableToWithdraw, selectedCurrency]);

    const undistributedProfits = useMemo(() => {
        const crv = parseFloat(walletInfo?.crv_cost || "0");
        const cvx = parseFloat(walletInfo?.cvx_cost || "0");
        return floorToFixed(crv + cvx, 2);
    }, [walletInfo]);

    useEffect(() => {
        changeAmountToWithdrawInPercentage(
            +amountToWithdraw / availableToWithdraw
        );
    }, [
        amountToWithdraw,
        availableToWithdraw,
        changeAmountToWithdrawInPercentage,
    ]);

    return (
        <StepsContainer title={t("deal")}>
            {/* {showModal} */}

            <div
                className={`
            fixed inset-0 z-30 backdrop-blur-sm justify-center items-center transition-all duration-200
            ${showModal ? "flex opacity-100 scale-100" : "hidden opacity-0 scale-95"}
          `}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`bg-white w-[95vw] max-w-[650px] max-h-[90vh] p-6 rounded-[20px] z-50 flex flex-col items-center justify-around text-black text-center`}
                >
                    <img src="/warn.png" alt="warn" />
                    <h2 className="text-blue text-2xl font-bold text-[1.5rem]">
                        <Trans
                            t={t}
                            values={{ unspended: undistributedProfits }}
                        >
                            unspended_text_h2
                        </Trans>
                    </h2>
                    <p className="text-[20px] text-gray-900 mt-6">
                        <Trans
                            t={t}
                            values={{ unspended: undistributedProfits }}
                        >
                            unspended_text_<span className="font-bold">1</span>
                        </Trans>
                    </p>
                    <p className="text-[20px] text-gray-900 mt-6">
                        <Trans
                            t={t}
                            values={{ unspended: undistributedProfits }}
                        >
                            unspended_text_2<span className="font-bold">1</span>
                        </Trans>
                    </p>
                    <div
                        className={`
                flex
                ${window.innerWidth < 800 ? "flex-col gap-5" : "flex-row gap-5"}
                justify-center
                z-50
                mt-4
                p-6
              `}
                    >
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowModal(false);
                                changeCurrentStep(1);
                            }}
                            disabled={false}
                        >
                            {t("btn_continue")}
                        </Button>
                        <Button
                            variant="filled"
                            onClick={() => {
                                setShowModal2(true);
                                setShowModal(false);
                            }}
                            disabled={false}
                        >
                            {t("btn_wait_ak")}
                        </Button>
                    </div>
                </div>
            </div>

            {/* {showModal2} */}
            <div
                className={`
            fixed inset-0 z-30 backdrop-blur-sm justify-center items-center transition-all duration-200
            ${showModal2 ? "flex opacity-100 scale-100" : "hidden opacity-0 scale-95"}
          `}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`bg-white w-[95vw] max-w-[650px] max-h-[90vh] p-6 rounded-[20px] z-50 flex flex-col items-center justify-around text-black text-center`}
                >
                    <div className="flex flex-row items-center justify-center gap-2 p-6">
                        <img src="/check.png" alt="check" />
                        <h2 className="text-blue text-2xl font-bold text-[1.5rem]">
                            <Trans t={t}>withdraw_cancelled</Trans>
                        </h2>
                    </div>
                    <p className="text-[20px] text-gray-900 mt-4">
                        <Trans t={t}>withdraw_cancelled_info</Trans>
                    </p>
                    <div
                        className={`
              flex
              ${window.innerWidth < 800 ? "flex-col gap-5" : "flex-col gap-5"}
              justify-center
              z-50
              p-6
              mt-4
            `}
                    >
                        <button
                            className="
                  border-solid
                  border-blue
                  border
                  py-3
                  px-8
                  rounded-[20px]
                  w-full
                  mobile:w-full
                  tablet:w-full
                  font-semibold
                  bg-blue
                  text-white
                  hover:bg-blue-100
                  hover:text-white
                  disabled:opacity-20
                  disabled:pointer-events-none
                "
                            onClick={() => {
                                setShowModal2(false);
                                window.open(
                                    "https://t.me/dsffinance",
                                    "_blank"
                                );
                            }}
                        >
                            <div className="flex flex-row items-center justify-center gap-2">
                                <img src="/tgicon.png" alt="telegramm" />
                                {t("go_to_channel")}
                            </div>
                        </button>

                        <button
                            className="
                  border-solid
                  border-blue
                  border
                  py-4
                  px-8
                  rounded-[20px]
                  w-full
                  mobile:w-full
                  tablet:w-full
                  font-semibold
                  bg-transparent
                  text-blue
                  hover:bg-blue-100
                  hover:text-white
                  disabled:opacity-20
                  disabled:pointer-events-none
                "
                            onClick={() => {
                                setShowModal2(false);
                                navigate("/dashboard");
                            }}
                        >
                            {t("back_to_app")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-[14px]">{t("balance_includes")}</div>
            <div className="tablet:flex gap-5 items-end">
                <div className="mt-2 tablet:w-1/2">
                    <label className="font-medium text-[0.75rem]">
                        {t("asset")}
                    </label>
                    <CurrencyDropdown
                        selectedCurrency={selectedCurrency}
                        changeSelectedCurrency={changeSelectedCurrency}
                    />
                </div>
                <div className="mt-6 tablet:mt-2 tablet:w-1/2">
                    <Input
                        withRange
                        value={amountToWithdraw}
                        onChange={changeAmountToWithdraw}
                        maxValue={availableToWithdraw}
                        label={
                            <div className="flex items-center justify-between">
                                <span>{t("amount_usd")}</span>
                                <div className="flex items-center text-sm">
                                    {t("manged_in_DSF")}:
                                    <span className="ml-1 text-gray-900">
                                        ${" "}
                                        {availableToWithdraw.toLocaleString(
                                            "en-US"
                                        )}
                                    </span>
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
            <div className="mt-6">
                <Button
                    variant="filled"
                    onClick={() => {
                        const percent =
                            (undistributedProfits / availableToWithdraw) * 100;

                        if (
                            undistributedProfits >= MIN_UNSPENT_AMOUNT ||
                            percent >= MIN_UNSPENT_PERCENT
                        ) {
                            setShowModal(true);
                        } else {
                            changeCurrentStep(1);
                        }
                    }}
                    disabled={!isWithdrawAmountValid}
                >
                    {t("next", { ns: "common" })}
                </Button>
            </div>
        </StepsContainer>
    );
};

export default FirstStep;
