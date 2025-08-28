import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import TabSwitcherMk2 from "./TabSwitcherMk2";
import "./styles/navigation.css";

const Navigation = () => {
    const [openedBurger, setOpenedBurger] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { t } = useTranslation(["header", "common"]);
    const location = useLocation();
    const { address, isConnected } = useAccount();
    const isWalletConnected = isConnected && Boolean(address);

    const isSavingActive =
        location.pathname === "/deposit" || location.pathname === "/withdraw";
    const savingActivePath =
        location.pathname === "/withdraw" ? "/withdraw" : "/deposit";

    const toggleBurger = useCallback(() => {
        setOpenedBurger(!openedBurger);
    }, [openedBurger]);

    const closeBurgerMenu = useCallback(() => {
        setOpenedBurger(false);
    }, []);

    const ddOpen = isHovered || isSavingActive;

    return (
        <div>
            <div className="tablet:hidden">
                <label
                    className={`burger ${!isWalletConnected ? "opacity-50 pointer-events-none" : ""}`}
                    htmlFor="burger"
                >
                    <input
                        type="checkbox"
                        id="burger"
                        checked={openedBurger}
                        onChange={toggleBurger}
                        disabled={!isWalletConnected}
                    />
                    <span className="bg-blue"></span>
                    <span className="bg-blue"></span>
                    <span className="bg-blue"></span>
                </label>
            </div>

            <div
                hidden={!openedBurger}
                className="fixed top-0 left-0 z-[10] w-[220px] h-screen text-gray-900
                bg-[linear-gradient(#FBFBFD_50%,_#E9F6FE_87%,_#E0F3FF)] animate-open-menu
                tablet:inline-block tablet:static tablet:w-[unset] tablet:h-[unset]
                tablet:bg-[linear-gradient(transparent,_transparent)]"
            >
                <div className="flex flex-col justify-center items-center w-full h-full tablet:flex-row">
                    <nav className="flex flex-col gap-14 w-[132px] tablet:w-[initial] tablet:flex-row">
                        <ul className="flex flex-col gap-5 tablet:flex-row tablet:gap-6">
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    onClick={closeBurgerMenu}
                                    className={({ isActive }) =>
                                        `transition-opacity duration-300 ${
                                            isWalletConnected
                                                ? ""
                                                : "pointer-events-none opacity-50"
                                        } ${isActive ? "font-bold text-blue-100" : ""}`
                                    }
                                >
                                    {t("dashboard")}
                                </NavLink>
                            </li>

                            <hr className="tablet:rotate-90 tablet:w-4 m-auto w-full" />

                            <li
                                className="relative peer"
                                onMouseEnter={() => {
                                    if (hoverTimeout.current)
                                        clearTimeout(hoverTimeout.current);
                                    setIsHovered(true);
                                }}
                                onMouseLeave={() => {
                                    hoverTimeout.current = setTimeout(
                                        () => setIsHovered(false),
                                        150
                                    );
                                }}
                            >
                                <NavLink
                                    to={savingActivePath}
                                    onClick={closeBurgerMenu}
                                    className={() =>
                                        `transition-opacity duration-300 whitespace-nowrap ${
                                            isWalletConnected
                                                ? ""
                                                : "pointer-events-none opacity-50"
                                        } ${isSavingActive ? "font-bold text-blue-100" : ""}`
                                    }
                                >
                                    {t("saving", { ns: "common" })}
                                </NavLink>

                                {(isHovered || isSavingActive) && (
                                    <div
                                        className={`
                                            absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50
                                            transition-all duration-200 ease-out
                                            ${
                                                isHovered || isSavingActive
                                                    ? "opacity-100 translate-x-0 pointer-events-auto"
                                                    : "opacity-0 -translate-x-2 pointer-events-none"
                                            }
                                        `}
                                        onMouseEnter={() => {
                                            if (hoverTimeout.current)
                                                clearTimeout(
                                                    hoverTimeout.current
                                                );
                                            setIsHovered(true);
                                        }}
                                        onMouseLeave={() => {
                                            hoverTimeout.current = setTimeout(
                                                () => setIsHovered(false),
                                                150
                                            );
                                        }}
                                    >
                                        <div className="w-full tablet:w-fit">
                                            <TabSwitcherMk2 />
                                        </div>
                                    </div>
                                )}
                            </li>

                            {(isHovered || isSavingActive) && (
                                <div className="w-48"></div>
                            )}

                            <hr className="tablet:rotate-90 tablet:w-4 m-auto w-full" />

                            {/* NEW: Swap */}
                            <li className="tablet:ml-auto">
                                <NavLink
                                    to="/swap"
                                    onClick={closeBurgerMenu}
                                    className={({ isActive }) =>
                                        `transition-opacity duration-300 whitespace-nowrap ${
                                            isWalletConnected
                                                ? ""
                                                : "pointer-events-none opacity-50"
                                        } ${isActive ? "font-bold text-blue-100" : ""}`
                                    }
                                >
                                    {t("swap", { ns: "common" })}
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
