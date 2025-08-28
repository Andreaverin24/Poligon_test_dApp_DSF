import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const FourthStep = () => {
  const { t } = useTranslation('deposit');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('slippage_question')}`,
          content: (
            <p>
              {t('slippage_answer1')}
              <br />
              {t('slippage_answer2')}
              <br />
              {t('slippage_answer3')}
              <br />
              {t('slippage_answer4')}
              <br />
              {t('slippage_answer5')}
              <br />
              {t('slippage_answer6')}
            </p>
          ),
        },
        {
          title: `${t('why_commission_lower')}`,
          content: (
            <p className="whitespace-pre-wrap">
              {t('why_commission_lower_answer')}
            </p>
          ),
        },
        {
          title: `${t('can_DSF_access')}`,
          content: (
            <p>
              {t('can_DSF_access_answer')}
            </p>
          ),
        },
      ]}
    />
  )
};

export default FourthStep;
