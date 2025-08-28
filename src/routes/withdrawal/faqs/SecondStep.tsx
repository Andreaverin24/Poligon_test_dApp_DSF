import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const SecondStep = () => {
  const { t } = useTranslation('withdraw');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('why_cheaper')}?`,
          content: (
            <p className="whitespace-pre-wrap">
              {t('why_cheaper_answer')}
            </p>
          ),
        },
        {
          title: `${t('can_DSF_access')}?`,
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

export default SecondStep;
