import useWithdrawalContext from '../../hooks/useWithdrawalContext';
import useGlobalContext from '../../hooks/useGlobalContext';

// components
import ZeroStep from '../deposit/faqs/ZeroStep';
import FirstStep from './faqs/FirstStep';
import SecondStep from './faqs/SecondStep';
import ThirdStep from './faqs/ThirdStep';

const CurrentFAQ = () => {
  const { currentStep } = useWithdrawalContext();
  const { wallet } = useGlobalContext();

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

export default CurrentFAQ;
