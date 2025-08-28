// DashboardPage.tsx

import { useAppKit } from "@reown/appkit/react";
import { useTranslation } from "react-i18next";
// import { RotatingLines } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";

// components
import useFilteredTransactions from "../hooks/useFilteredTransactions";
import useGlobalContext from "../hooks/useGlobalContext";
import AccruedYield from "./dashboard/AccruedYield";
import Deposits from "./dashboard/Deposits";
import FAQ from "./dashboard/FAQ";
import SavedGas from "./dashboard/SavedGas";

import { floorToFixed } from "../utils/floorToFixed";

const DashboardPage = () => {
    const { open } = useAppKit();
    const { t } = useTranslation("deposit");

    const { address, isConnecting } = useAccount();

    if (!isConnecting && !address) return <Navigate to="/deposit" replace />;

    const {
        walletInfo: globalWalletInfo,
        transactions,
        managedInDSF,
        userDeposits,
        withdrawableIncome,
    } = useGlobalContext();

    const isLoading = !globalWalletInfo;

    const parse = (val?: string) => parseFloat(val ?? "0");

    const {
        user_deposits,
        available_to_withdraw,
        cvx_share,
        crv_share,
        cvx_cost,
        crv_cost,
        apy_365,
        apy_today,
        annual_yield_rate,
        eth_saved_deposit,
        eth_saved_withdraw,
        usd_saved_deposit,
        usd_saved_withdraw,
    } = globalWalletInfo || {};

    const userDepositsAPI = parse(user_deposits);
    const availableToWithdrawAPI = parse(available_to_withdraw);
    const cvxShareAPI = parse(cvx_share);
    const crvShareAPI = parse(crv_share);
    const cvxCostAPI = parse(cvx_cost);
    const crvCostAPI = parse(crv_cost);
    const interestRate = parse(apy_365);
    const currentInterestRate = parse(apy_today);
    const personalApy = parse(annual_yield_rate);
    const gasSavedOnDeposits = parse(eth_saved_deposit);
    const gasSavedOnWithdrawals = parse(eth_saved_withdraw);
    const usdSavedOnDeposits = parse(usd_saved_deposit);
    const usdSavedOnWithdrawals = parse(usd_saved_withdraw);

    const pendingDeposits = useFilteredTransactions(
        transactions,
        "pendingDeposit"
    );
    const pendingWithdrawals = useFilteredTransactions(
        transactions,
        "pendingWithdrawal"
    );

    function renderConnectWallet() {
        if (!address && window.innerWidth > 800) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white w-[670px] h-[400px] rounded-3xl shadow-lg flex flex-col items-center justify-center px-[110px]">
                        <div className="text-[#3956FE] text-[22px] font-bold text-center">
                            {t("please_connect_wallet")}
                        </div>
                        <button
                            className="flex items-center gap-2 bg-[#3956FE] text-white px-4 py-2 rounded-xl mt-[50px] px-[30px] active:opacity-75"
                            onClick={() => open({ view: "Connect" })}
                        >
                            <img
                                src="/wallet-wh1.svg"
                                alt="wallet"
                                width={20}
                                height={20}
                            />
                            {t("connect_wallet")}
                        </button>
                        <div className="text-[#979797] text-[16px] font-bold text-center mt-[50px]">
                            {t("connect_wallet_description")}
                        </div>
                    </div>
                </div>
            );
        } else if (!address && window.innerWidth <= 800) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white w-[95%] h-[80vh] rounded-3xl shadow-lg flex flex-col items-center justify-center px-[50px]">
                        <div className="text-[#3956FE] text-[22px] font-bold text-center">
                            {t("please_connect_wallet")}
                        </div>
                        <button
                            className="flex items-center gap-2 bg-[#3956FE] text-white px-4 py-2 rounded-xl mt-[50px] px-[30px] active:opacity-75"
                            onClick={() => open({ view: "Connect" })}
                        >
                            <img
                                src="/wallet-wh1.svg"
                                alt="wallet"
                                width={20}
                                height={20}
                            />
                            {t("connect_wallet")}
                        </button>
                        <div className="text-[#979797] text-[16px] font-bold text-center mt-[50px]">
                            {t("connect_wallet_description")}
                        </div>
                    </div>
                </div>
            );
        }
    }

    function renderLoader() {
        if (isLoading && window.innerWidth > 800) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="bg-white w-[670px] h-[150px] rounded-3xl shadow-lg flex flex-row items-center justify-center px-[60px]">
                        {/* <RotatingLines
                            strokeColor="#3956FE"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="70"
                            visible={true}
                        /> */}
                        <div className="text-[#3956FE] text-[22px] font-bold text-center ml-[20px]">
                            {t("loader_content")}
                        </div>
                    </div>
                </div>
            );
        } else if (isLoading && window.innerWidth <= 800) {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="bg-white w-[95%] h-[150px] rounded-3xl shadow-lg flex flex-row items-center justify-center px-[30px]">
                        {/* <RotatingLines
                            strokeColor="#3956FE"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="70"
                            visible={true}
                        /> */}
                        <div className="text-[#3956FE] text-[22px] font-bold text-center ml-[20px]">
                            {t("loader_content")}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
    return (
        <div className="flex flex-col tablet:flex-row gap-8 tablet:gap-10 text-[14px] max-h-[calc(100vh-68px-2.5rem)] overflow-y-scroll">
            {renderConnectWallet()}
            {renderLoader()}
            <section className="tablet:w-3/5 tablet:sticky top-0 left-0">
                <Deposits
                    depositAmount={userDepositsAPI.toString()}
                    currentInterestRate={currentInterestRate}
                    interestRate={interestRate}
                    pendingDeposits={pendingDeposits}
                    pendingWithdrawals={pendingWithdrawals}
                    availableToWithdraw={floorToFixed(
                        availableToWithdrawAPI,
                        2
                    )}
                    personalApy={personalApy.toString()}
                />
            </section>
            <div className="flex flex-col gap-10 tablet:w-full">
                <section>
                    <AccruedYield
                        cvxAmount={cvxShareAPI}
                        crvAmount={crvShareAPI}
                        cvxAmountInUsd={floorToFixed(cvxCostAPI, 2)}
                        crvAmountInUsd={floorToFixed(crvCostAPI, 2)}
                        availableToWithdraw={floorToFixed(
                            availableToWithdrawAPI - userDepositsAPI,
                            2
                        )}
                        loading={managedInDSF > 0 && !userDeposits}
                    />
                </section>
                <section>
                    <SavedGas
                        deposits={gasSavedOnDeposits}
                        withdrawals={gasSavedOnWithdrawals}
                        usdSavedOnDeposits={usdSavedOnDeposits}
                        usdSavedOnWithdrawals={usdSavedOnWithdrawals}
                    />
                </section>
                <section>
                    <FAQ />
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
