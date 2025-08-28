// deposit/steps/FirstStep.tsx

import { useCallback } from "react";
import useDepositContext from "../../../hooks/useDepositContext";
import useGlobalContext from "../../../hooks/useGlobalContext";

import { Tooltip } from "flowbite-react";
import { useTranslation } from "react-i18next";
import "../../styles/icons.css";

// icons
import { ReactComponent as QuestionIcon } from "../../../assets/images/common/question.svg?react";

// components
import Button from "../../../components/CustomButton";
import StepsContainer from "./StepsContainer";
import CurrencyDropdown from "../../components/CurrencyDropdown";
import ValueWithFallback from "../../../components/ValueWithFallback";

const FirstStep = () => {
  const { changeCurrentStep, selectedCurrency, changeSelectedCurrency } =
    useDepositContext();
  const { t } = useTranslation("deposit");

  const { walletInfo } = useGlobalContext();

  const interestRate =
    walletInfo?.apy_today !== undefined
      ? parseFloat(walletInfo.apy_today)
      : undefined;

  const isLoading = interestRate === undefined;

  const buttonClickHandler = useCallback(() => {
    if (selectedCurrency) {
      changeCurrentStep(1);
    }
  }, [selectedCurrency, changeCurrentStep]);

  return (
    <StepsContainer title={t("deposits_placed")}>
      <div className="tablet:flex items-center gap-[20px]">
        <div className="mt-6 tablet:w-1/2">
          <label className="font-medium text-[0.75rem]">
            {t("select_coin")}
          </label>
          <CurrencyDropdown
            selectedCurrency={selectedCurrency}
            changeSelectedCurrency={changeSelectedCurrency}
          />
        </div>
        <div
          hidden={!selectedCurrency}
          className="mt-6 font-medium tablet:w-1/2"
        >
          <label className="flex items-center text-sm mb-1">
            {t("estimate_rate", { coin: selectedCurrency })}
            <span>
              <Tooltip
                content={<div className="max-w-xs">{t("estimate_hint")}</div>}
                style="light"
                arrow={false}
              >
                <QuestionIcon height={16} width={16} className="ml-1" />
              </Tooltip>
            </span>
          </label>
          <ValueWithFallback
            value={interestRate}
            unit="%"
            precision={2}
            loading={isLoading}
            className="text-gray-900 py-[10px] px-4 rounded-xl w-full border border-gray-300 bg-white shadow-sm cursor-not-allowed"
          />
        </div>
      </div>

      <div className="tablet:flex justify-between items-center gap-4 tablet:w-1/2">
        <div className="mt-6">
          <Tooltip
            content={<div className="max-w-xs">{t("check_erc20")}</div>}
            style="light"
            arrow={false}
          >
            <Button
              variant="filled"
              onClick={buttonClickHandler}
              disabled={!selectedCurrency}
            >
              {t("next", { ns: "common" })}
            </Button>
          </Tooltip>
        </div>
      </div>
    </StepsContainer>
  );
};

export default FirstStep;
