//  withdrawal/steps/SecondStep.tsx

import useGlobalContext from "../../../hooks/useGlobalContext";
import useWithdrawalContext from "../../../hooks/useWithdrawalContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/CustomButton";
import ValueWithFallback from "../../../components/ValueWithFallback";

// components
import Card from "../../../components/Card";
import { Tooltip } from "flowbite-react";
import OnlineIndicator from "../../../components/OnlineIndicator";

const SecondStep = () => {
  const { withdrawalGasFeeUsd, optimizedWithdrawalGasFeeUsd, walletInfo } =
    useGlobalContext();

  const fallbackWithdrawalFee =
    walletInfo?.static_gas?.estimates?.withdraw?.gasUsd;
  const fallbackOptimizedFee =
    walletInfo?.static_gas?.estimates?.feesOptimizationWithdrawal?.gasUsd;

  const finalWithdrawalFee =
    withdrawalGasFeeUsd && withdrawalGasFeeUsd > 0
      ? withdrawalGasFeeUsd
      : fallbackWithdrawalFee;
  const finalOptimizedFee =
    optimizedWithdrawalGasFeeUsd && optimizedWithdrawalGasFeeUsd > 0
      ? optimizedWithdrawalGasFeeUsd
      : fallbackOptimizedFee;

  const { changeCurrentStep, changeOptimized } = useWithdrawalContext();

  const {
    t,
    i18n: { language },
  } = useTranslation("withdraw");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModal2, setShowModal2] = useState<boolean>(false);

  const chooseNonOptimized = () => {
    changeOptimized(false);
    changeCurrentStep(2);
  };

  const chooseOptimized = () => {
    changeOptimized(true);
    changeCurrentStep(2);
  };

  function handleShowModalTwo() {
    setShowModal2(true);
  }

  // ✅ Mobile detect
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 800);
    }
  }, []);

  return (
    <div>
      {/*showModal2*/}
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
          <div className="flex flex-row items-center justify-center gap-2">
            <img src="/warn.png" alt="warn" />
            <h2 className="text-blue text-2xl"></h2>
          </div>
          <p className="text-[20px] text-gray-900 mt-6">
            {t("withdraw_in_3_stablecoins")}
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
                setShowModal2(false);
                chooseOptimized();
              }}
              disabled={false}
            >
              {t("btn_continue")}
            </Button>
            <Button
              variant="filled"
              onClick={() => {
                setShowModal2(false);
              }}
              disabled={false}
            >
              {t("back_to_app")}
            </Button>
          </div>
        </div>
      </div>

      <h2 className="font-bold text-gray-900 text-[1.5rem]">
        {t("fees_optimization")}
      </h2>
      <div className="flex flex-col gap-y-4 tablet:flex-row items-stretch justify-between mt-4">
        
        <div className="w-full tablet:w-[360px]">
          <Card>
            <div className="flex flex-row">
              <h3 className="font-semibold text-gray-900">
                {t("withdraw_balanced")}
              </h3>
              <div className="ml-5 cursor-pointer">
                <Tooltip
                  content={t("withdraw_in_3_stablecoins")}
                  style="light"
                  arrow={false}
                  className="max-w-[300px]"
                >
                  <div className="w-5 h-5 border-2 border-red-700 rounded-xl flex justify-center align-middle">
                    <h2 className="mt-[-4px] text-red-700">!</h2>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="bg-gray px-2 py-1 rounded-xl mt-[10px] flex justify-between items-center text-[12px]">
              {/* <div className="bg-gray px-2 py-1 rounded-xl mt-[10px]"> */}
              {t("estimated_fee", { ns: "deposit" })}:
              <ValueWithFallback
                value={finalOptimizedFee}
                loading={!finalOptimizedFee}
                unit="$"
                precision={2}
                className="text-gray-900 ml-[10px] text-[12px] font-medium"
              />
              <OnlineIndicator label={!isMobile ? t("online") : undefined} />
            </div>
            <div className="flex items-center min-h-[75px] mt-2">
              {t("withdraw_balanced_hint")}
            </div>
            <div className="flex justify-between items-center mt-[18px]">
              <button
                className={`
                  border-solid border-blue border py-2 px-7 rounded-full tablet:w-max font-semibold bg-blue text-white
                  hover:bg-blue-100 hover:text-white
                `}
                onClick={handleShowModalTwo}
              >
                {t("choose", { ns: "deposit" })}
              </button>
              {/* {
                language === 'en' && (
                  <div className="text-green-300 bg-[rgba(85,_221,_131,_0.12)] rounded-full py-2 px-2.5">
                    Smart Withdraw
                  </div>
                )
              } */}
              {/* <div className="text-green-300 font-semibold bg-[rgba(85,_221,_131,_0.12)] rounded-full py-2 px-3">
                Smart
              </div> */}
            </div>
          </Card>
        </div>
        <div className="w-full tablet:w-[360px]">
          <Card type="standard">
            <h3 className="font-semibold text-gray-900">
              {t("withdraw_fastest")}
            </h3>
            <div className="bg-gray px-2 py-1 rounded-xl mt-[10px] flex justify-between items-center text-[12px]">
              {/* <div className="bg-gray px-2 py-1 rounded-xl mt-[10px]"> */}
              {t("estimated_fee", { ns: "deposit" })}:
              <ValueWithFallback
                value={finalWithdrawalFee}
                loading={!finalWithdrawalFee}
                unit="$"
                precision={2}
                className="text-gray-900 ml-[10px] text-[12px] font-medium"
              />
              <OnlineIndicator label={!isMobile ? t("online") : undefined} />
            </div>
            <div className="flex items-center min-h-[75px] mt-2">
              {t("withdraw_fastest_hint")}
            </div>
            <div className="flex justify-between items-center mt-[18px]">
              <button
                className={`
                  border-solid border-blue border py-2 px-7 rounded-full tablet:w-max font-semibold bg-blue text-white
                  hover:bg-blue-100 hover:text-white
                `}
                onClick={chooseNonOptimized}
              >
                {t("choose", { ns: "deposit" })}
              </button>
              {/* {
                language === 'en' && (
                  <div className="text-blue-100 bg-[rgba(57,_86,_254,_0.12)] rounded-full py-2 px-3">
                    Withdrawal
                  </div>
                )
              } */}
              {/* <div className="text-[#3956FE] font-semibold bg-[rgba(57,_86,_254,_0.12)] rounded-full py-2 px-3">
                Fast
              </div> */}
            </div>
          </Card>
        </div>
        <div className="w-full tablet:w-[360px]">
          <Card>
            <div className="flex flex-col justify-between min-h-[219px]">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-400">
                  {t("withdraw_premium")}
                </h3>
                <span className="text-blue-100 ml-4">
                  {t("soon", { ns: "common" })}
                </span>
              </div>
              <div>{t("withdraw_premium_hint")}</div>
              <div className="flex justify-end">
                {/* {
                  language === 'en' && (
                    <div className="text-[#E239FE] bg-[rgba(226,_57,_254,_0.12)] rounded-full py-2 px-3">
                      Premium Withdraw
                    </div>
                  )
                } */}
                {/* <div className="text-[#E239FE] font-semibold bg-[rgba(226,_57,_254,_0.12)] rounded-full py-2 px-3">
                    Premium
                </div> */}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
