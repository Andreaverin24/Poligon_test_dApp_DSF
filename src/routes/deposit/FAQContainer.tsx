import { useTranslation } from 'react-i18next';

// components
import Socials from '../../components/Socials';
import CurrentFAQ from './CurrentFAQ';

const FAQContainer = () => {
  const { t } = useTranslation('deposit');

  return (
    <section id="faq" className="mt-8 mb-6 bg-gray rounded-3xl p-6 tablet:mt-24 tablet:p-10">
      <div className="flex items-start justify-between">
        <h2 className="font-bold text-gray-900 text-[1.5rem]">FAQ</h2>
        <Socials short />
      </div>
      <div className="mt-3">
        {t('faq_hint')}
      </div>
      <div className="mt-5">
        <CurrentFAQ />
      </div>
    </section>
  )
};

export default FAQContainer;
