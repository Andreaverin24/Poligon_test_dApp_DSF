import useDepositContext from '../../hooks/useDepositContext';

// components
import Card from '../../components/Card';
import CurrentCard from './CurrentCard';


const DepositCard = () => {
  const { currentStep } = useDepositContext();

  return (
    <section className="mt-5 tablet:mt-6">
      {
        currentStep === 2
          ? <CurrentCard />
          : (
            <Card>
              <CurrentCard />
            </Card>
          )

      }
    </section>
  )
};

export default DepositCard;
