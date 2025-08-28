// icons
import { ReactComponent as SuccessIcon } from "../assets/images/common/success.svg?react";

interface StepsProps {
  steps: string[];
  activeStepIndex: number;
  onClick: (index: number) => void;
  isDisabled?: boolean;
}

const Steps = (props: StepsProps) => {
  const { steps, activeStepIndex, onClick, isDisabled = false } = props;

  return (
    <div className="flex justify-between font-semibold">
      {steps.map((step, index) => (
        <div
          key={index}
          onClick={() => {
            if (!isDisabled) onClick(index);
          }}
          className={`
            flex
            flex-col
            items-center
            w-[25%]
            tablet:max-w-[unset]
            ${isDisabled ? "cursor-default text-gray-400" : "cursor-pointer"}
            ${!isDisabled && index <= activeStepIndex ? "text-gray-900" : "text-default"}
            tablet:flex-row
            tablet:w-max

          `}
        >
          <div
            key={index}
            className={`
                flex
                items-center
                justify-center
                w-8
                h-8
                rounded-xl
                mb-3
                ${index < activeStepIndex ? "bg-green-400" : "bg-gray"}
                tablet:mb-0
                tablet:mr-3
              `}
          >
            <span
              className={`
                text-sm
                ${index < activeStepIndex ? "text-white" : ""}
              `}
            >
              {index < activeStepIndex ? (
                <SuccessIcon className="w-8 h-8" />
              ) : (
                index + 1
              )}
            </span>
          </div>
          <span
            className={`
                text-center
                text-sm
                tablet:whitespace-nowrap
                ${index <= activeStepIndex ? "text-gray-900" : "text-default"}
                ${index < activeStepIndex ? "underline" : ""}
                ${isDisabled ? "opacity-50" : ""}
              `}
          >
            {steps[index]}
          </span>
          <hr
            className={`
              hidden
              mx-3
              border-0
              h-[1px]
              tablet:inline-block
              ${index >= steps.length - 1 ? "w-0" : "w-7"}
              ${index < activeStepIndex - 1 ? "bg-gray-900" : "bg-default"}
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default Steps;
