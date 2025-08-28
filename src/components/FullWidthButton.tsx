interface CustomButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant: "outline" | "filled" | "error" | "shine";
    [x: string]: any;
}

const FullWidthButton = (props: CustomButtonProps) => {
    const { onClick, children, variant, shine = false, ...resProps } = props;

    const isShineActive = shine || variant === "shine";

    const buttonConfig = {
        outline: {
            bgColor: "bg-transparent",
            textColor: "text-blue",
            borderColor: "border-blue",
            borderWidth: "border-2",
            hover: "",
        },
        filled: {
            bgColor: "bg-blue",
            textColor: "text-white",
            borderColor: "border-blue",
            borderWidth: "border",
            hover: "hover:bg-blue-100 hover:text-white",
        },
        error: {
            bgColor: "bg-red-100",
            textColor: "text-red-500",
            borderColor: "border-red-500",
            borderWidth: "border-2",
            hover: "",
        },
        shine: {
            bgColor: "bg-blue",
            textColor: "text-white",
            borderColor: "border-blue",
            borderWidth: "border",
            hover: "hover:bg-blue-100 hover:text-white",
        },
    };

    return (
        <button
            className={`
                py-4
                px-8
                rounded-[20px]
                w-full
                font-semibold
                border-solid
                ${buttonConfig[variant].bgColor}
                ${buttonConfig[variant].textColor}
                ${buttonConfig[variant].borderColor}
                ${buttonConfig[variant].borderWidth}
                ${buttonConfig[variant].hover}
                ${isShineActive ? "shine-bg-fullb" : ""}
                disabled:opacity-100
                disabled:cursor-default
            `}
            onClick={onClick}
            {...resProps}
        >
            {children}
        </button>
    );
};

export default FullWidthButton;
