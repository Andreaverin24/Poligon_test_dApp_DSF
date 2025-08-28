import useWithdrawalContext from '../../hooks/useWithdrawalContext';

// components
import Card from '../../components/Card';
import CurrentCard from './CurrentCard';

const WithdrawalCard = () => {
  const { currentStep } = useWithdrawalContext();

  return (
    <section className="mt-5 tablet:mt-6">
      {
        currentStep === 1
          ? <CurrentCard />
          : (
            <Card>
              <CurrentCard />
            </Card>
          )
      }
    </section>
  );
};

export default WithdrawalCard;
