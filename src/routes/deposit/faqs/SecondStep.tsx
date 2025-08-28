// components
import FAQAccordion from '../../../components/FAQAccordion';
import { useTranslation } from 'react-i18next';


const SecondStep = () => {
  const { t } = useTranslation('deposit');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('min_summ_question')}`,
          content: (
            <p className="whitespace-pre-wrap">
              {t('min_summ_answer')}
            </p>
          ),
        },
        {
          title: `${t('when_withdraw_question')}`,
          content: (
            <p className="whitespace-pre-wrap">
              {t('when_withdraw_answer')}
            </p>
          ),
        },
      ]}
    />
  )
};

export default SecondStep;
