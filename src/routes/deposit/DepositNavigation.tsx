import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import useDepositContext from '../../hooks/useDepositContext';
import useGlobalContext from '../../hooks/useGlobalContext';

// icons
import { ReactComponent as ArrowLeftIcon } from '../../assets/images/common/arrow_left.svg?react';

// components
import TabSwitcher from '../../components/TabSwitcher';
import Steps from '../../components/Steps';

const DepositNavigation = () => {
  const {
    currentStep,
    resetCurrentStepToStep,
  } = useDepositContext();
  const { wallet } = useGlobalContext();
  const { t } = useTranslation('deposit');

  const { address, isConnected } = useAccount();
  const isWalletConnected = isConnected && Boolean(address);

  return (
    <section className="block">
      <div className="tablet:flex tablet:items-center tablet:justify-between">
        <div className="w-full tablet:w-fit">
          <TabSwitcher tabs={[
            {
              title: 'deposit',
              disabled: !wallet,
            },
            {
              title: 'withdraw',
              disabled: !wallet,
            }
          ]} activeTab="deposit"/>
        </div>
        <div className="mt-5 tablet:mt-0">
          <Steps
            steps={[t('currency'), t('amount'), t('fees'), t('review')]}
            activeStepIndex={currentStep}
            onClick={resetCurrentStepToStep}
            isDisabled={!isWalletConnected}
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
            <Trans t={t}>back</Trans>
          </div>
          )
          : (
            <Link
              to={isWalletConnected ? "/dashboard" : "#"}
              onClick={(e) => {
                if (!isWalletConnected) e.preventDefault();
              }}
              className={`flex items-center gap-2 mt-5 w-fit ${
                isWalletConnected ? 'text-gray-900 cursor-pointer' : 'text-gray-400 cursor-default'
              }`}
            >
            {/* <Link to="/dashboard" className="flex items-center gap-2 mt-5 text-gray-900 cursor-pointer w-fit"> */}
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

export default DepositNavigation;
