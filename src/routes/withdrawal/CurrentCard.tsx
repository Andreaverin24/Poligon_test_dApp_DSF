import useWithdrawalContext from '../../hooks/useWithdrawalContext';
import useGlobalContext from '../../hooks/useGlobalContext';

// components
import ZeroStep from '../deposit/steps/ZeroStep';
import FirstStep from './steps/FirstStep';
import SecondStep from './steps/SecondStep';
import ThirdStep from './steps/ThirdStep';

const CurrentCard = () => {
  const { wallet } = useGlobalContext();
  const { currentStep } = useWithdrawalContext();
  // let currentStep = 1; // Для доступа к след шагу

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
    default:
      return null;
  }
};

export default CurrentCard;
