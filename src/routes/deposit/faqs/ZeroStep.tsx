import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const ZeroStep = () => {
  const { t } = useTranslation('deposit');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('what_is_wallet')}?`,
          content: (
            <>
              <p>
                {t('what_is_wallet_answer')}
              </p>
              <p className="mt-2 text-blue">
                <a
                  href="https://dsf.finance/knowledge-base/how_to_defi/how_to_install_metamask"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('install_metamask')}
                </a>
              </p>
              <p className="mt-2 text-blue">
                <a
                  href="https://dsf.finance/knowledge-base/how_to_defi/how_to_install_trust_wallet_and_start_using_them"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('install_trust_wallet')}
                </a>
              </p>
            </>
          )
        },
        {
          title: `${t('what_means')}?`,
          content: (
            <p>
              {t('what_means_answer')}
            </p>
          ),
        },
      ]}
    />
);
};

export default ZeroStep;
