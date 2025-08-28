import { useTranslation } from 'react-i18next';

import Socials from '../../components/Socials';
import FAQAccordion from '../../components/FAQAccordion';

const FAQ = () => {
  const { t } = useTranslation('withdraw');

  return (
    <section className="mt-8 mb-6 bg-gray rounded-3xl p-6 tablet:mt-10 tablet:p-10">
      <div className="flex items-start justify-between">
        <h2 className="font-bold text-gray-900 text-[1.5rem]">FAQ</h2>
        <Socials short />
      </div>
      <div className="mt-3">
        {t('faq_hint', { ns: 'deposit' })}
      </div>
      <div className="mt-5">
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
      </div>
    </section>
  )
};

export default FAQ;
