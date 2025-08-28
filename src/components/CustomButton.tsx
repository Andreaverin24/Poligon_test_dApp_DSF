interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: 'outline' | 'filled';
  [x:string]: any;
}

const CustomButton = (props: CustomButtonProps) => {
  const {
    onClick,
    children,
    variant,
    ...resProps
  } = props;

  const buttonConfig = {
    outline: {
      bgColor: 'bg-transparent',
      textColor: 'text-blue',
    },
    filled: {
      bgColor: 'bg-blue',
      textColor: 'text-white',
    }
  };

  return (
    <button
      className={`
        border-solid
        border-blue
        border
        py-4
        px-8
        rounded-[20px]
        min-w-[200px]
        mobile:w-full
        tablet:w-max
        font-semibold
        ${buttonConfig[variant].bgColor}
        ${buttonConfig[variant].textColor}
        hover:bg-blue-100
        hover:text-white
        disabled:opacity-20
        disabled:pointer-events-none
      `}
      onClick={onClick}
      {...resProps}
    >
      {children}
    </button>
  )
};

export default CustomButton;