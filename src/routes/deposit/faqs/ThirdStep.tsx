import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const ThirdStep = () => {
  const { t } = useTranslation('deposit');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('why_commission_lower')}`,
          content: (
            <p className="whitespace-pre-wrap">
              {t('why_commission_lower_answer')}
              <br />
              {t('why_commission_lower_answer_important')}
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
        {
          title: `${t('why_fees')}?`,
          content: (
            <p>
              {t('why_fees_answer')}
            </p>
          ),
        },
      ]}
    />
  )
};

export default ThirdStep;
