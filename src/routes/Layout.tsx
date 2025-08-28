// Layout.tsx

import { Outlet } from "react-router-dom";
import { DepositContext } from "../context/DepositContext";
import { GlobalContext } from "../context/GlobalContext";
import { WithdrawalContext } from "../context/WithdrawalContext";
import { useConnectionGuard } from "../hooks/useConnectionGuard";
import useDepositContextValue from "../hooks/useDepositContextValue";
import useGlobalContextValue from "../hooks/useGlobalContextValue";
import useWithdrawalContextValue from "../hooks/useWithdrawalContextValue";

// styles
import "./styles/header.css";

// components
import DataContainer from "./components/DataContainer";
import Header from "./components/Header";

export default function Layout() {
    useConnectionGuard();

    const globalContextValue = useGlobalContextValue();
    const depositContextValue = useDepositContextValue();
    const withdrawalContextValue = useWithdrawalContextValue();

    return (
        <GlobalContext.Provider value={globalContextValue}>
            <DepositContext.Provider value={depositContextValue}>
                <WithdrawalContext.Provider value={withdrawalContextValue}>
                    <DataContainer>
                        <Header />
                        <main className="container mx-auto">
                            <Outlet />
                        </main>
                        {import.meta.env.APP_VERSION && (
                            <div
                                className="fixed bottom-6 right-0 pointer-events-none select-none z-50"
                                style={{ right: "5px" }}
                            >
                                <div className="flex flex-col items-center justify-center gap-[11px]">
                                    {/* 🔽 Треугольник над текстом, связан с ним */}
                                    <div
                                        style={{
                                            width: 0,
                                            height: 0,
                                            borderLeft: "5px solid transparent",
                                            borderRight:
                                                "5px solid transparent",
                                            borderBottom:
                                                "7px solid rgba(0, 123, 255, 0.8)",
                                            marginBottom: "2px",
                                        }}
                                    />
                                    {/* 🔠 Версия, повёрнутая на 90°, связана с треугольником */}
                                    <div
                                        style={{
                                            transform: "rotate(90deg)",
                                            transformOrigin: "center center",
                                        }}
                                        className="whitespace-nowrap tracking-widest text-[10px] text-blue-400 opacity-70 leading-none"
                                    >
                                        {import.meta.env.APP_VERSION}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DataContainer>
                </WithdrawalContext.Provider>
            </DepositContext.Provider>
        </GlobalContext.Provider>
    );
}
