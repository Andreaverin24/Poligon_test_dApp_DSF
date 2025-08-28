import useDepositContext from '../../hooks/useDepositContext';
import useGlobalContext from '../../hooks/useGlobalContext';

// components
import ZeroStep from './steps/ZeroStep';
import FirstStep from './steps/FirstStep';
import SecondStep from './steps/SecondStep';
import ThirdStep from './steps/ThirdStep';
import FourthStep from './steps/FourthStep';

const CurrentCard = () => {
  const { currentStep} = useDepositContext();
  const { wallet } = useGlobalContext();
    // let currentStep = 2; // Для доступа к след шагу 


  switch (currentStep) {
    case 0:
      if (!wallet) {
        return <ZeroStep />;
      }
      return <FirstStep />;
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

export default CurrentCard;
