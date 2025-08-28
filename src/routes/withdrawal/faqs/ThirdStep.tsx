import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const ThirdStep = () => {
  const { t } = useTranslation('withdraw');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('why_less')}?`,
          content: (
            <>
              <p>
                {t('why_less_answer_1')}
              </p>
              <p className="mt-4">
                <span className="text-gray-900">{t('why_less_answer_2')}:</span>
                <div className="mt-4">
                  {t('why_less_answer_3')}
                  <ul>
                    <li>250 DAI</li>
                    <li>250 USDC</li>
                    <li>250 MM</li>
                    <li>250 USDT</li>
                  </ul>
                  <div>
                    <span className="text-gray-900">{t('why_less_answer_4')}: </span>
                    <span>1000 {t('why_less_answer_5')}</span>
                  </div>
                </div>
              </p>
              <p className="mt-4">
                <span className="text-gray-900">1 USDT {t('why_less_answer_6')}:</span>
                <ul>
                  <li>1 USDC</li>
                  <li>0.999 DAI</li>
                  <li>0.9899 MM</li>
                </ul>
              </p>
              <p className="mt-4">
                {t('why_less_answer_7')}
                <span className="text-gray-900"> 1000 USDT</span>
                , {t('why_less_answer_8')}
                <span className="text-gray-900"> $999.98 </span> {t('why_less_answer_9')}
              </p>
            </>
          ),
        },
      ]}
    />
  )
};

export default ThirdStep;
