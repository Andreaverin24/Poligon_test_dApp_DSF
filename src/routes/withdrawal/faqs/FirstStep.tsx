import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const FirstStep = () => {
  const { t } = useTranslation('withdraw');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('how_calculated')}?`,
          content: (
            <p>
              {t('how_calculated_answer')}
            </p>
          ),
        },
        {
          title: `${t('how_impacts')}?`,
          content: (
            <div>
              {t('how_impacts_answer_1')}
              <div className="mt-4">
                {t('how_impacts_answer_2')}:
                <ul className="list-[initial] pl-8">
                  <li>
                    {t('how_impacts_answer_3')}
                  </li>
                  <li>
                    {t('how_impacts_answer_4')}
                  </li>
                </ul>
              </div>
              <p className="mt-4">
                {t('how_impacts_answer_5')}
              </p>
            </div>
          ),
        },
      ]}
    />
  )
};

export default FirstStep;
