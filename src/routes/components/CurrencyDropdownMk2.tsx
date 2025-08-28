// CurrencyDropdownMk2.tsx;

import { useTranslation } from "react-i18next";
import CurrencyIcon from "../../components/CurrencyIcon";
import Dropdown from "../../components/CustomDropdown";
import DropdownItem from "./DropdownItem";

const AVAILABLE_COINS: Array<StableType> = ["USDT", "USDC", "DAI"];

interface CurrencyDropdownProps {
    selectedCurrency: StableType | null;
    changeSelectedCurrency: (currency: StableType) => void;
}

const CurrencyDropdownMk2 = (props: CurrencyDropdownProps) => {
    const { selectedCurrency, changeSelectedCurrency } = props;
    const { t } = useTranslation("deposit");

    return (
        <div
            className="
              flex items-center justify-between
              px-1 py-1
              rounded-full
              bg-[#F5F6FA]
              shadow-[0_1px_2px_rgba(0,0,0,0.06)]
              text-[#3B4B66]
              text-base
              font-medium
              w-[110px]
              cursor-pointer
              shadow-md
            "
        >
            <Dropdown
                label={
                    selectedCurrency ? (
                        <DropdownItem>
                            <CurrencyIcon currency={selectedCurrency} />
                            {selectedCurrency}
                        </DropdownItem>
                    ) : (
                        t("select_coin")
                    )
                }
                items={AVAILABLE_COINS.map((coin) => (
                    <DropdownItem key={coin}>
                        <CurrencyIcon currency={coin} />
                        {coin}
                    </DropdownItem>
                ))}
                itemsValues={AVAILABLE_COINS}
                onChange={(value) =>
                    changeSelectedCurrency(value as StableType)
                }
                withBorder={false}
            />
        </div>
    );
};

export default CurrencyDropdownMk2;
