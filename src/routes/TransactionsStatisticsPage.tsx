// TransactionsStatisticsPage.tsx

import { Trans, useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import { useAccount } from "wagmi";
// import { RotatingLines } from 'react-loader-spinner';

// icons
import { ReactComponent as ArrowLeftIcon } from "../assets/images/common/arrow_left.svg?react";

// styles
import "./styles/transactions.css";

// components
import Card from "../components/Card";
import useGlobalContext from "../hooks/useGlobalContext";
import type { TransactionAPI } from "../types/transactions";
import DesktopTransaction from "./transactions/DesktopTransaction";
import Transaction from "./transactions/Transaction";

const TransactionsStatisticsPage = () => {
    const { address, isConnecting } = useAccount();

    if (!isConnecting && !address) return <Navigate to="/" replace />;

    const { t } = useTranslation("statistics");
    const { transactions } = useGlobalContext();

    const isLoading = !transactions || transactions.length === 0;
    const txList: TransactionAPI[] = transactions || [];

    return (
        <>
            <div className="flex flex-col tablet:flex-row tablet:justify-between tablet:items-center">
                <div>
                    <h2 className="text-gray-900 font-bold text-[24px] leading-8">
                        {t("transactions_statistics")}
                    </h2>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 mt-5 text-gray-900 cursor-pointer"
                    >
                        <ArrowLeftIcon />
                        <Trans t={t} ns="deposit">
                            back_<span className="font-bold">dashboard</span>
                        </Trans>
                    </Link>
                </div>
                <div>{/*filters*/}</div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center mt-8">
                    {/* <RotatingLines
            strokeColor="#3956FE"
            strokeWidth="5"
            animationDuration="0.75"
            width="70"
            visible={true}
          /> */}
                </div>
            )}

            {/* Mobile view */}
            <ul className="flex flex-col gap-3 text-[14px] leading-[20px] mt-4 tablet:hidden">
                {txList.map((tx) => (
                    <li key={tx.id}>
                        <Transaction
                            timestamp={new Date(tx.unixtime * 1000)}
                            transactionStatus={tx.status ?? "pending"}
                            transactionAction={tx.action}
                            transactionToken={tx.currency as StableType}
                            transactionAmount={+tx.amount}
                            amountPlaced={+tx.amount}
                            commissionUsd={tx.gasSpentUsd || 0}
                            commissionEth={tx.gasSpentEth || 0}
                            isFinished={
                                tx.status === "standard" ||
                                tx.status === "completed" ||
                                tx.status === "cancelled" ||
                                tx.status === "failed" ||
                                tx.status === "transfered"
                            }
                            txHash={tx.txHash}
                            lpShares={tx.lpShares || 0}
                            address={tx.to || tx.from || ""}
                        />
                    </li>
                ))}
            </ul>

            {/* Desktop view */}
            <div className="hidden tablet:block mt-4">
                <Card>
                    <table className="text-[14px] leading-[20px] w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="text-left font-normal tx-fixs2">
                                    {t("date")}
                                </th>
                                <th className="text-left font-normal">
                                    {t("operation_type")}
                                </th>
                                <th className="text-left font-normal">
                                    {t("coin")}
                                </th>
                                <th className="text-left font-normal">
                                    {t("Commissions_spent")}
                                </th>
                                <th className="text-left font-normal tx-fixs3">
                                    {t("status")}
                                </th>
                                <th />
                                <th />
                            </tr>
                        </thead>
                        <tbody className="text-gray-900">
                            {txList.map((tx) => (
                                <DesktopTransaction
                                    key={tx.id}
                                    timestamp={new Date(tx.unixtime * 1000)}
                                    transactionStatus={tx.status ?? "pending"}
                                    transactionAction={tx.action}
                                    transactionToken={tx.currency as StableType}
                                    transactionAmount={+tx.amount}
                                    amountPlaced={+tx.amount}
                                    commissionUsd={tx.gasSpentUsd || 0}
                                    commissionEth={tx.gasSpentEth || 0}
                                    isFinished={
                                        tx.status === "standard" ||
                                        tx.status === "completed" ||
                                        tx.status === "cancelled" ||
                                        tx.status === "failed" ||
                                        tx.status === "transfered"
                                    }
                                    txHash={tx.txHash}
                                    lpShares={tx.lpShares || 0}
                                    address={tx.to || tx.from || ""}
                                />
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </>
    );
};

export default TransactionsStatisticsPage;
