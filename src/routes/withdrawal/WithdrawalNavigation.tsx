import useWithdrawalContext from '../../hooks/useWithdrawalContext';
import { Link } from 'react-router-dom';
import {Trans, useTranslation} from 'react-i18next';

// components
import TabSwitcher from '../../components/TabSwitcher';
import Steps from '../../components/Steps';

// icons
import { ReactComponent as ArrowLeftIcon } from '../../assets/images/common/arrow_left.svg?react';

const WithdrawalNavigation = () => {
  const {
    currentStep,
    resetCurrentStepToStep,
  } = useWithdrawalContext();
  const { t } = useTranslation(['deposit', 'withdraw']);

  return (
    <section className="block">
      <div className="tablet:flex tablet:items-center tablet:justify-between">
        <div className="w-full tablet:w-fit">
          <TabSwitcher tabs={[
            {
              title: 'deposit',
            },
            {
              title: 'withdraw',
            }
          ]} activeTab="withdraw"/>
        </div>
        <div className="mt-5 tablet:mt-0">
          <Steps
            steps={[
              t('deal', { ns: 'withdraw' }),
              t('fees_optimization', { ns: 'withdraw' }),
              t('review', { ns: 'withdraw' }),
              t('confirmation', { ns: 'withdraw' })
            ]}
            activeStepIndex={currentStep}
            onClick={resetCurrentStepToStep}
          />
        </div>
      </div>
      {
        currentStep > 0
          ? (
            <div
            className="flex items-center gap-2 mt-5 text-gray-900 cursor-pointer w-fit"
            onClick={() => resetCurrentStepToStep(currentStep - 1)}
          >     
            <ArrowLeftIcon />
              <Trans t={t}>
                back
              </Trans>
            </div>
            )
            : (
              <Link to="/dashboard" className="flex items-center gap-2 mt-5 text-gray-900 cursor-pointer w-fit">
              <ArrowLeftIcon />
              <Trans t={t}>
                   back_<span className="font-bold">dashboard</span>
              </Trans>
              </Link>
          )
      }
    </section>
);
};

export default WithdrawalNavigation;
