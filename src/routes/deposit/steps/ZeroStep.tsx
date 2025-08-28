// deposit/steps/ZeroStep.tsx

import React from "react";
import { useAppKit } from "@reown/appkit/react";
import useGlobalContext from "../../../hooks/useGlobalContext";
import { useTranslation, Trans } from "react-i18next";
import { useWalletContext } from "../../../context/WalletStatusContext";

// icons
import { ReactComponent as WalletIcon } from "../../../assets/images/common/wallet.svg?react";
import { ReactComponent as CoinsIcon } from "../../../assets/images/common/coins.svg?react";
import { ReactComponent as ETH } from "../../../assets/images/currency/ETH.svg?react";
import { ReactComponent as WBTC } from "../../../assets/images/currency/WBTC.svg?react";

// components
import Button from "../../../components/CustomButton";
import ButtonOneLine from "../../../components/CastomButtonOneLine";
import StepsContainer from "./StepsContainer";
import CurrencyIcon from "../../../components/CurrencyIcon";
import ValueWithFallback from "../../../components/ValueWithFallback";
import Spinner from "../../components/Spinner";

const ZeroStep = () => {
  const { open } = useAppKit();
  const { interestRate, currentInterestRate } = useGlobalContext();
  const { t, i18n } = useTranslation("deposit");
  const { status } = useWalletContext();

  const guideUrl = t("guide_url");

  return (
    <StepsContainer title={t("to_begin")}>
      <ul className="flex flex-col gap-4 mt-6">
        <li className="flex items-center gap-3">
          <div className="flex justify-center items-center min-w-[3rem] h-12 bg-gray rounded-full">
            <WalletIcon />
          </div>
          <div className="flex text-[14px] font-semibold text-gray-900">
            <span className="mr-1">1.</span>
            <p>
              <Trans t={t}>
                to_begin_
                <a
                  href={guideUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue"
                >
                  1
                </a>
              </Trans>
            </p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <div className="flex justify-center items-center min-w-[3rem] h-12 bg-gray rounded-full">
            <CoinsIcon />
          </div>
          <div className="flex text-[14px] font-semibold text-gray-900">
            <span className="mr-1">2.</span>
            <p>
              <Trans t={t}>
                to_begin_2<b>1</b>
              </Trans>
            </p>
          </div>
        </li>
      </ul>
      <div className="bg-gray mt-6 p-6 rounded-2xl font-medium">
        <h3 className="text-gray-900 font-semibold text-[16px] tablet:text-[20px]">
          {t("place_assets")}
        </h3>
        <p className="mt-3">{t("current_strategy")}:</p>
        <div className="flex flex-col tablet:flex-row gap-2 tablet:gap-5 mt-4 tablet:mt-6">
          <div className="flex justify-between items-center gap-2 bg-gray rounded-2xl py-3 px-4 tablet:w-1/3">
            <div className="flex items-center gap-2 text-[14px]">
              <CurrencyIcon currency="MIXED" />
              {t("stablecoins")}:
            </div>
            <ValueWithFallback
              value={currentInterestRate}
              loading={!currentInterestRate}
              unit="%"
              precision={2}
              className="text-gray-900 text-[12px]"
            />
          </div>
          <div className="flex justify-between items-center gap-2 bg-gray rounded-2xl py-3 px-4 tablet:w-1/3">
            <div className="flex items-center gap-2">
              <ETH />
              ETH:
            </div>
            <span className="text-blue text-[12px] bg-gray py-1 px-2 rounded-2xl">
              {t("common:soon")}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2 bg-gray rounded-2xl py-3 px-4 tablet:w-1/3">
            <div className="flex items-center gap-2">
              <WBTC />
              WBTC:
            </div>
            <span className="text-blue text-[12px] bg-gray py-1 px-2 rounded-2xl">
              {t("common:soon")}
            </span>
          </div>
        </div>
        {/* <p className="mt-8">
          {t('annual_strategy')}:
        </p>
        <div className="flex flex-col tablet:flex-row gap-2 tablet:gap-5 mt-4 tablet:mt-6">
          <div className="flex justify-between items-center gap-2 bg-gray rounded-2xl py-3 px-4 tablet:w-1/3">
            <div className="flex items-center gap-2 text-[14px]">
              <CurrencyIcon currency="MIXED"/>
              {t('stablecoins')}:
            </div>
            <ValueWithFallback
              value={interestRate}
              loading={!interestRate}
              unit="%"
              precision={2}
              className="text-gray-900"
            />
          </div>
          <div className="flex justify-between items-center gap-2 bg-gray rounded-2xl py-3 px-4 tablet:w-1/3">
            <div className="flex items-center gap-2">
              <ETH/>
              ETH:
            </div>
            <span className="text-blue text-[12px] bg-gray py-1 px-2 rounded-2xl">
              {t('common:soon')}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2 bg-gray rounded-2xl py-3 px-4 tablet:w-1/3">
            <div className="flex items-center gap-2">
              <WBTC/>
              WBTC:
            </div>
            <span className="text-blue text-[12px] bg-gray py-1 px-2 rounded-2xl">
              {t('common:soon')}
            </span>
          </div>
        </div> */}
      </div>
      <div className="mt-6">
        {status === "loading" && (
          <ButtonOneLine
            variant="filled"
            disabled
            onClick={() => {}}
            // className="min-w-[180px]"
          >
            <Spinner size="sm" />
            {t("header:connecting")}
          </ButtonOneLine>
        )}

        {status === "disconnected" && (
          <Button variant="filled" onClick={() => open?.({ view: "Connect" })}>
            {t("header:connect_wallet")}
          </Button>
        )}
      </div>
    </StepsContainer>
  );
};

export default ZeroStep;
