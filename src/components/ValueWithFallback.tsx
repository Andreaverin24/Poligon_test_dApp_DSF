// components/ValueWithFallback.tsx

import React from "react";
import SpinnerGray from "../routes/components/SpinnerGray";

interface ValueWithFallbackProps {
    value?: string | number;
    unit?: string;
    className?: string;
    loading?: boolean;
    precision?: number;
    fallback?: React.ReactNode;
    approximate?: boolean;
}

const ValueWithFallback: React.FC<ValueWithFallbackProps> = ({
    value,
    unit = "",
    className = "",
    loading = false,
    precision = 2,
    fallback,
    approximate = false,
}) => {
    const shouldShowFallback =
        loading || value === undefined || value === null || Number.isNaN(value);
    const num = typeof value === "number" ? value : Number(value);

    const fallbackContent =
        fallback !== undefined ? (
            fallback
        ) : (
            <SpinnerGray size="sm" className="text-[#7782B7]" />
        );

    const renderValue = () => {
        if (!isFinite(num)) return "—";

        const formattedValue = num.toFixed(precision);

        let prefix = approximate ? "≈ " : "";
        if (unit === "$") return `${prefix}$${formattedValue}`;
        if (unit === "%") return `${prefix}${formattedValue}%`;
        return `${prefix}${formattedValue} ${unit}`;
    };

    const renderFallback = () => {
        if (unit === "$")
            return (
                <>
                    ${"\u00A0"}
                    {fallbackContent}
                </>
            );
        if (unit === "%")
            return (
                <>
                    {fallbackContent}
                    {"\u00A0"}%
                </>
            );
        return (
            <>
                {fallbackContent}
                {unit && ` ${unit}`}
            </>
        );
    };

    return (
        <span
            className={`inline-flex items-center transition-opacity duration-300 ${
                shouldShowFallback ? "opacity-50" : "opacity-100"
            } ${className}`}
        >
            {shouldShowFallback ? renderFallback() : renderValue()}
        </span>
    );
};

export default ValueWithFallback;
