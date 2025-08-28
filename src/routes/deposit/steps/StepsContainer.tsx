// 

// icons
import { ReactComponent as QuestionIcon } from '../../../assets/images/common/question.svg?react';

interface StepsContainerProps {
  title: string;
  children: React.ReactNode;
}

const StepsContainer = (props: StepsContainerProps) => {
  const {
    title,
    children,
  } = props;

  return (
    <>
      <div className="flex justify-between relative">
        <h2 className="font-bold text-gray-900 text-[1.5rem]">{title}</h2>
      </div>
      {children}
    </>
  );
};

export default StepsContainer;
