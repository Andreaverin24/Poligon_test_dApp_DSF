import { useTranslation } from 'react-i18next';

// components
import FAQAccordion from '../../../components/FAQAccordion';

const FirstStep = () => {
  const { t } = useTranslation('deposit');

  return (
    <FAQAccordion
      items={[
        {
          title: `${t('what_is_approval')}?`,
          content: (
            <p>
              {t('what_is_approval_answer')}
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
        {
          title: `${t('what_is_included_interest')}?`,
          content: (
            <div>
              The interest rate encompasses two types of earnings:
              <div className="mt-4">
                <p>
                  <b className="text-gray-900">
                    Main income refers to the revenue generated through exchange operations on the Curve decentralized
                    exchange.
                  </b>
                </p>
                <p className="mt-3 ">
                  DSF receives part of the commissions from exchange operations on the Curve.fi decentralized exchange.
                  This reward is paid in CRV tokens. DSF also receives additional rewards from the income optimizer
                  convexfinance.com This reward is paid in CVX tokens.
                </p>
              </div>
              <div className="mt-4">
                <p>
                  <b className="text-gray-900">
                    Additional income encompasses supplementary rewards earned by DSF for its involvement in the Convex
                    DAO.
                  </b>
                </p>
                <p className="mt-3">
                  DSF buys CVX tokens, blocks them and participates in the DAO convexfinance.com. In return for this
                  participation, DSF receives additional awards from Convex.The reward is paid in CVX tokens.
                  Part of these rewards are subsequently distributed to DSF users.
                </p>
              </div>
              <p className="mt-4">
                The interest rate includes DSF commission and is updated several times a day.
              </p>
              <p className="m3">
                DSF commission is 15% of the actual income.
              </p>
            </div>
          ),
        },
      ]}
    />
  )
};

export default FirstStep;
