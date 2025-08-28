// deposit/steps/ThirdStep.tsx

import { useEffect, useState } from "react";
import useGlobalContext from "../../../hooks/useGlobalContext";
import useDepositContext from "../../../hooks/useDepositContext";
import { useTranslation } from "react-i18next";
import OnlineIndicator from "../../../components/OnlineIndicator";
// components
import Card from "../../../components/Card";
import ValueWithFallback from "../../../components/ValueWithFallback";

const ThirdStep = () => {
  const { depositGasFeeUsd, optimizedDepositGasFeeUsd, walletInfo } =
    useGlobalContext();

  const fallbackDepositFee = walletInfo?.static_gas?.estimates?.deposit?.gasUsd;
  const fallbackOptimizedFee =
    walletInfo?.static_gas?.estimates?.feesOptimizationDeposit?.gasUsd;

  const finalDepositFee =
    depositGasFeeUsd && depositGasFeeUsd > 0
      ? depositGasFeeUsd
      : fallbackDepositFee;
  const finalOptimizedFee =
    optimizedDepositGasFeeUsd && optimizedDepositGasFeeUsd > 0
      ? optimizedDepositGasFeeUsd
      : fallbackOptimizedFee;

  const { changeCurrentStep, changeOptimized } = useDepositContext();

  const {
    t,
    i18n: { language },
  } = useTranslation("deposit");

  const chooseNonOptimized = () => {
    changeOptimized(false);
    changeCurrentStep(3);
  };

  const chooseOptimized = () => {
    changeOptimized(true);
    changeCurrentStep(3);
  };

  // ✅ Mobile detect
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 800);
    }
  }, []);

  // ✅ Debug
  useEffect(() => {
    console.log("[ThirdStep] 💰 depositGasFeeUsd:", depositGasFeeUsd);
    console.log(
      "[ThirdStep] 💡 optimizedDepositGasFeeUsd:",
      optimizedDepositGasFeeUsd
    );
  }, [depositGasFeeUsd, optimizedDepositGasFeeUsd]);

  return (
    <div>
      <h2 className="font-bold text-gray-900 text-[1.5rem]">{t("fees")}</h2>
      <div className="flex flex-col gap-y-4 tablet:flex-row items-stretch justify-between mt-4">
        {/* Smart Deposit */}
        <div className="w-full tablet:w-[360px]">
          <Card>
            <h3 className="font-semibold text-gray-900">
              {t("deposit_balanced")}
            </h3>
            <div className="bg-gray px-2 py-1 rounded-xl mt-[10px] flex flex-row justify-between text-[12px]">
              {t("estimated_fee")}:
              <ValueWithFallback
                value={finalOptimizedFee}
                loading={
                  finalOptimizedFee === undefined || finalOptimizedFee === null
                }
                unit="$"
                precision={2}
                className="text-gray-900 ml-[10px] text-[12px] font-medium"
              />
              <OnlineIndicator label={!isMobile ? t("online") : undefined} />
            </div>
            <div className="flex items-center min-h-[75px] mt-2">
              {t("deposit_balanced_hint")}
            </div>
            <div className="flex justify-between items-center mt-[18px]">
              <button
                className={`
                  border-solid border-blue border py-2 px-4 rounded-full tablet:w-max font-semibold bg-blue text-white
                  hover:bg-blue-100 hover:text-white
                `}
                onClick={chooseOptimized}
              >
                {t("choose")}
              </button>
              {/* {
                language === 'en' && (
                  <div className="text-green-300 bg-[rgba(85,_221,_131,_0.12)] rounded-full py-2 px-3">
                    Smart Deposit
                  </div>
                )
              } */}
              {/* <div className="text-green-300 font-semibold bg-[rgba(85,_221,_131,_0.12)] rounded-full py-2 px-3">
                Smart Deposit
              </div> */}
            </div>
          </Card>
        </div>

        {/* Fast Deposit */}
        <div className="w-full tablet:w-[360px]">
          <Card type="standard">
            <h3 className="font-semibold text-gray-900">
              {t("deposit_fastest")}
            </h3>
            <div className="bg-gray px-2 py-1 rounded-xl mt-[10px] flex flex-row justify-between text-[12px]">
              {t("estimated_fee")}:
              <ValueWithFallback
                value={finalDepositFee}
                loading={
                  finalDepositFee === undefined || finalDepositFee === null
                }
                unit="$"
                precision={2}
                className="text-gray-900 ml-[10px] text-[12px] font-medium"
              />
              <OnlineIndicator label={!isMobile ? t("online") : undefined} />
            </div>
            <div className="flex items-center min-h-[75px] mt-2">
              {t("deposit_fastest_hint")}
            </div>
            <div className="flex justify-between items-center mt-[18px]">
              <button
                className={`
                  border-solid border-blue border py-2 px-4 rounded-full tablet:w-max font-semibold bg-blue text-white
                  hover:bg-blue-100 hover:text-white
                `}
                onClick={chooseNonOptimized}
              >
                {t("choose")}
              </button>
              {/* {
                language === 'en' && (
                  <div className="text-blue-100 bg-[rgba(57,_86,_254,_0.12)] rounded-full py-2 px-3">
                    Deposit
                  </div>
                )
              } */}
              {/* <div className="text-[#3956FE] font-semibold bg-[rgba(57,_86,_254,_0.12)] rounded-full py-2 px-3">
                Deposit
               </div> */}
            </div>
          </Card>
        </div>

        {/* Premium Placeholder */}
        <div className="w-full tablet:w-[360px]">
          <Card>
            <div className="flex flex-col justify-between min-h-[219px]">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-400">
                  {t("deposit_premium")}
                </h3>
                <span className="text-blue-100 ml-4">
                  {t("soon", { ns: "common" })}
                </span>
              </div>
              <div>{t("deposit_premium_hint")}</div>
              <div className="flex justify-end">
                {language === "en" && (
                  <div className="text-[#E239FE] bg-[rgba(226,_57,_254,_0.12)] rounded-full py-2 px-3">
                    Premium Deposit
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThirdStep;
