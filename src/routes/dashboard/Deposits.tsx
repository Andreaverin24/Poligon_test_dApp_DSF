// Deposits.tsx

import { Tooltip } from "flowbite-react";
import { useCallback, useState } from "react";

import { useTranslation } from "react-i18next";
// import { RotatingLines } from 'react-loader-spinner'

// icons
import dropdownIcon from "../../assets/images/common/dropdown.png";
import { ReactComponent as QuestionMark } from "../../assets/images/common/question.svg?react";

// components
import Card from "../../components/Card";
import CurrencyIcon from "../../components/CurrencyIcon";
import ValueWithFallback from "../../components/ValueWithFallback";
import PendingTransactionsList from "./PendingTransactionsList";

interface DepositProps {
    depositAmount: string;
    interestRate: number;
    currentInterestRate: number;
    pendingDeposits: Array<any>;
    pendingWithdrawals: Array<any>;
    availableToWithdraw: number;
    personalApy: string;
}

const Deposits = (props: DepositProps) => {
    const {
        depositAmount,
        interestRate,
        currentInterestRate,
        pendingDeposits,
        pendingWithdrawals,
        availableToWithdraw,
        personalApy,
    } = props;
    const [opened, setOpened] = useState<boolean>(false);
    const { t } = useTranslation("dashboard");

    const userDepositsAmount = parseFloat(depositAmount);

    const triggerDropdown = useCallback(() => {
        setOpened(!opened);
    }, [opened]);

    return (
        <>
            <Card>
                <div
                    className="flex items-center tablet:justify-between cursor-pointer tablet:cursor-auto"
                    onClick={triggerDropdown}
                >
                    <h2 className="text-gray-900 text-[24px] leading-8 font-bold">
                        {t("deposits")}
                    </h2>
                    <div className="bg-gray-100 relative py-2 px-4 text-gray-900 rounded-2xl font-semibold ml-3">
                        <ValueWithFallback
                            value={userDepositsAmount}
                            unit="$"
                            precision={2}
                        />
                        <span className="absolute top-[-10px] right-[-10px]">
                            <Tooltip
                                content={t("deposit_tooltip")}
                                style="light"
                                arrow={false}
                                className="w-[300px]"
                            >
                                <QuestionMark className="ml-2 h-5 w-5" />
                            </Tooltip>
                        </span>
                    </div>
                    <div className="ml-auto tablet:hidden">
                        <img
                            src={dropdownIcon}
                            alt=""
                            className={opened ? "" : "rotate-180"}
                        />
                    </div>
                </div>
                <div className={`${opened ? "block" : "hidden"} tablet:block`}>
                    <hr className="my-6 tablet:hidden" />
                    <div className="overflow-scroll max-h-[136px] tablet:hidden">
                        <PendingTransactionsList
                            pendingTransactions={[
                                ...pendingDeposits,
                                ...pendingWithdrawals,
                            ]}
                        />
                    </div>
                </div>
            </Card>
            <div className="mt-6">
                <Card>
                    <div className="flex flex-row items-center justify-between w-[100%]">
                        <h2 className="text-gray-900 text-[24px] leading-8 font-bold flex-1">
                            {t("total_balance")}
                        </h2>
                        <div className="flex flex-row items-center justify-between flex-0 relative">
                            <div className="online-span">
                                <p className="blinking-dot">•</p>
                                {window.screen.width < 800 ? null : (
                                    <span>{t("online")}</span>
                                )}
                            </div>
                            <span className="absolute top-[-10px] right-[-10px]">
                                <Tooltip
                                    content={t("online-withdraw-tooltip")}
                                    style="light"
                                    arrow={false}
                                    className="w-[300px]"
                                >
                                    <QuestionMark className="ml-2 h-5 w-5" />
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-gray p-4 rounded-2xl mt-4 font-medium relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CurrencyIcon currency="MIXED" />
                                <span className="absolute top-[-10px] right-[-10px]">
                                    <Tooltip
                                        content={t("total_balance_hint")}
                                        style="light"
                                        arrow={false}
                                        className="w-[300px]"
                                    >
                                        <QuestionMark className="ml-2 h-5 w-5" />
                                    </Tooltip>
                                </span>
                            </div>
                            <ValueWithFallback
                                value={availableToWithdraw}
                                unit="" // unit="$"
                                precision={2}
                                className="text-gray-900 font-semibold"
                            />
                        </div>
                    </div>

                    {Number(personalApy) > 0 && (
                        <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4 relative">
                            <span>{t("personal_apy")}</span>
                            <ValueWithFallback
                                value={personalApy}
                                unit="%"
                                precision={2}
                                className="text-[#73D516] font-semibold"
                            />
                            <span className="absolute top-[-10px] right-[-10px]">
                                <Tooltip
                                    content={t("personal_apy_hint")}
                                    style="light"
                                    arrow={false}
                                    className="w-[300px]"
                                >
                                    <QuestionMark className="ml-2 h-5 w-5" />
                                </Tooltip>
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4 relative">
                        <span>{t("current_interest_rate")}</span>
                        <ValueWithFallback
                            value={currentInterestRate}
                            unit="%"
                            precision={2}
                            className="text-gray-900 font-semibold"
                        />
                        <span className="absolute top-[-10px] right-[-10px]">
                            <Tooltip
                                content={t("interest_rate_hint")}
                                style="light"
                                arrow={false}
                                className="w-[300px]"
                            >
                                <QuestionMark className="ml-2 h-5 w-5" />
                            </Tooltip>
                        </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4 relative">
                        <span>{t("interest_rate")}</span>
                        <ValueWithFallback
                            value={interestRate}
                            unit="%"
                            precision={2}
                            className="text-gray-900 font-semibold"
                        />
                        <span className="absolute top-[-10px] right-[-10px]">
                            <Tooltip
                                content={t("year_interest_rate_hint")}
                                style="light"
                                arrow={false}
                                className="w-[300px]"
                            >
                                <QuestionMark className="ml-2 h-5 w-5" />
                            </Tooltip>
                        </span>
                    </div>
                </Card>
            </div>
            <div className="hidden tablet:block tablet:sticky mt-6">
                <Card>
                    <div className="overflow-scroll max-h-[176px]">
                        <PendingTransactionsList
                            pendingTransactions={[
                                ...pendingDeposits,
                                ...pendingWithdrawals,
                            ]}
                        />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Deposits;
