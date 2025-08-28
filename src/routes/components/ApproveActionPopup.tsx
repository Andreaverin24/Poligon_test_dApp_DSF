import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Spinner from "../components/Spinner";

import FullWidthButton from "../../components/FullWidthButton";
import useApprove from "../../hooks/useApprove";
import useGlobalContext from "../../hooks/useGlobalContext";
import useReApprove from "../../hooks/useReApprove";

interface Props {
    tokenAddress: `0x${string}`;
    amount: bigint;
    isReset?: boolean;
    isUSDT?: boolean;
    onClose: () => void;
}

const ApproveActionPopup = ({
    tokenAddress,
    amount,
    isReset = false,
    isUSDT = false,
    onClose,
}: Props) => {
    const { t } = useTranslation("approve");
    const { walletInfo } = useGlobalContext();

    const gasPriceGwei = walletInfo?.static_gas?.gasPriceGwei || 0.25;
    const ethPriceUsd = walletInfo?.static_gas?.ethPriceUsd || 2500;

    const GAS_APPROVE = 55000;
    const gasEth = (GAS_APPROVE * gasPriceGwei) / 1e9;
    const gasUsd = gasEth * ethPriceUsd;

    const {
        approve: resetApprove,
        isLoading: isResetLoading,
        isSuccess: isResetSuccess,
    } = useReApprove({
        tokenAddress,
        amount,
        isUSDT,
    });

    const {
        approve: approveWrite,
        isPending: isApproveLoading,
        isSuccess: isApproveSuccess,
    } = useApprove(tokenAddress);

    const isLoading = isReset ? isResetLoading : isApproveLoading;
    const isSuccess = isReset ? isResetSuccess : isApproveSuccess;

    const handleConfirm = () => {
        if (isReset) return resetApprove();
        return approveWrite();
    };

    useEffect(() => {
        if (isSuccess) {
            onClose();
        }
    }, [isSuccess, onClose]);

    // Заголовки и описания
    const title = isReset
        ? isUSDT
            ? t("reset_approval_title_usdt")
            : t("reset_approval_title")
        : t("approval_needed");

    const description = isReset
        ? isUSDT
            ? t("reset_approval_description_usdt")
            : t("reset_approval_description")
        : t("approval_description");

    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
                {/* Заголовок */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {title}
                </h2>

                {/* Описание */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {description}
                </p>

                {/* Внимание про комиссию */}
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md p-3 text-sm mb-6">
                    {t("approve_gas_fee_warning")}
                    <br />≈ {gasEth.toFixed(6)} ETH
                    <br />≈ ${gasUsd.toFixed(2)} USD
                </div>

                {/* Кнопка подтверждения */}
                <FullWidthButton
                    variant="filled"
                    onClick={handleConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Spinner />
                            <span className="ml-2">
                                {t("confirm_in_wallet")}
                            </span>
                        </div>
                    ) : (
                        t(isReset ? "reset_approval" : "approve")
                    )}
                </FullWidthButton>

                {/* Кнопка отмены */}
                <div className="mt-4 space-y-2">
                    <FullWidthButton
                        onClick={onClose}
                        variant="outline"
                        textClassName="mt-4 w-full text-sm text-gray-500 hover:underline"
                    >
                        {t("cancel")}
                    </FullWidthButton>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ApproveActionPopup;
