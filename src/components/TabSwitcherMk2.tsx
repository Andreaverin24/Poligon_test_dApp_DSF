import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

type TabType = "deposit" | "withdraw";

interface TabSwitcherProps {
    initialTab?: TabType;
}

const TabSwitcherMk2 = ({ initialTab = "deposit" }: TabSwitcherProps) => {
    const { t } = useTranslation("common");
    const location = useLocation();
    const navigate = useNavigate();

    const getCurrentTab = (): TabType =>
        location.pathname.startsWith("/withdraw") ? "withdraw" : "deposit";

    const [activeTab, setActiveTab] = useState<TabType>(getCurrentTab());

    const tabs: TabType[] = ["deposit", "withdraw"];

    const handleClick = (tab: TabType) => {
        setActiveTab(tab);
        navigate(`/${tab}`);
    };

    return (
        <ul className="flex flex-row bg-gray text-gray p-1 rounded-2xl gap-1 shadow-md">
            {tabs.map((tab) => (
                <li
                    key={tab}
                    onClick={() => handleClick(tab)}
                    className={`
            px-5 py-2 rounded-2xl cursor-pointer whitespace-nowrap
            transition-all duration-200
            ${activeTab === tab ? "bg-white text-blue font-semibold" : ""}
          `}
                >
                    {t(tab)}
                </li>
            ))}
        </ul>
    );
};

export default TabSwitcherMk2;
