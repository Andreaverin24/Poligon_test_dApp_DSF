// CurrencyDropdown.tsx

import { useTranslation } from "react-i18next";

import CurrencyIcon from "../../components/CurrencyIcon";
import Dropdown from "../../components/CustomDropdown";
import DropdownItem from "./DropdownItem";

const AVAILABLE_COINS: Array<StableType> = ["USDT", "USDC", "DAI"];

interface CurrencyDropdownProps {
    selectedCurrency: StableType | null;
    changeSelectedCurrency: (currency: StableType) => void;
}

const CurrencyDropdown = (props: CurrencyDropdownProps) => {
    const { selectedCurrency, changeSelectedCurrency } = props;
    const { t } = useTranslation("deposit");

    return (
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
                <DropdownItem>
                    <CurrencyIcon currency={coin} />
                    {coin}
                </DropdownItem>
            ))}
            itemsValues={AVAILABLE_COINS}
            onChange={(value) => changeSelectedCurrency(value as StableType)}
            withBorder
        />
    );
};

export default CurrencyDropdown;
