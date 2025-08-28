import useDepositContext from '../../hooks/useDepositContext';
import useGlobalContext from '../../hooks/useGlobalContext';

// components
import ZeroStep from './faqs/ZeroStep';
import FirstStep from './faqs/FirstStep';
import SecondStep from './faqs/SecondStep';
import ThirdStep from './faqs/ThirdStep';
import FourthStep from './faqs/FourthStep';

const CurrentFAQ = () => {
  const { currentStep } = useDepositContext();
  const { wallet } = useGlobalContext();
      // let currentStep = 3; // Для доступа к след шагу


  switch (currentStep) {
    case 0:
      if (!wallet) {
        return <ZeroStep />;
      }
      // return <FirstStep />;
      return null;
    case 1:
      return <SecondStep />;
    case 2:
      return <ThirdStep />;
    case 3:
      return <FourthStep />;
    default:
      return null;
  }
};

export default CurrentFAQ;
