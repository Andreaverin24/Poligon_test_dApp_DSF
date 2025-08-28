// AccruedYield.tsx

import {
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Tooltip } from 'flowbite-react';
import dropdownIcon from '../../assets/images/common/dropdown.png';
import { useTranslation, Trans } from 'react-i18next';

// icons
import { ReactComponent as QuestionMark } from '../../assets/images/common/question.svg?react';

// components
import Card from '../../components/Card';
import CurrencyIcon from '../../components/CurrencyIcon';
import Timer from '../../components/Timer';
import ValueWithFallback from '../../components/ValueWithFallback';

interface AccruedYieldProps {
  cvxAmount: number;
  crvAmount: number;
  cvxAmountInUsd: number;
  crvAmountInUsd: number;
  availableToWithdraw: number;
  loading: boolean;
}

const AccruedYield = (props: AccruedYieldProps) => {
  const {
    cvxAmount,
    crvAmount,
    cvxAmountInUsd,
    crvAmountInUsd,
    availableToWithdraw,
    loading,
  } = props;
  const [opened, setOpened] = useState<boolean>(false);
  const { t } = useTranslation('dashboard');

  const triggerDropdown = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  const totalSum = useMemo(() => {
    const sum = Math.max(crvAmountInUsd, 0) + Math.max(cvxAmountInUsd, 0) + availableToWithdraw;
    if (sum > 0) return sum;
    return 0;
  }, [crvAmountInUsd, cvxAmountInUsd, availableToWithdraw])

  return (
    <Card>
      <div className="flex items-center cursor-pointer" onClick={triggerDropdown}>
        <div className="tablet:flex items-center">
          <h2 className="text-gray-900 text-[24px] leading-8 font-bold">
            {t('total_earned')}
          </h2>
          {/*<div className="tablet:ml-2">*/}
          {/*  <Timer endTime={dateTillNextCompound} />*/}
          {/*</div>*/}
        </div>
        <div className="ml-auto">
          <img src={dropdownIcon} alt="" className={opened ? '' : 'rotate-180'} />
        </div>
      </div>
      <div className={`${opened ? 'flex' : 'hidden'} flex-col gap-4 mt-4 font-medium`}>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <CurrencyIcon currency="CRV" />
            CRV
          </div>
          <ValueWithFallback
            value={crvAmount}
            unit={t('tokens')}
            loading={loading}
            precision={4}
            className="w-1/2"
          />
          <ValueWithFallback
            value={crvAmountInUsd}
            unit="$"
            loading={loading}
            precision={2}
            className="text-gray-900 font-semibold"
          />
        </div>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <CurrencyIcon currency="CVX" />
            CVX
          </div>
          <ValueWithFallback
            value={cvxAmount}
            unit={t('tokens')}
            loading={loading}
            precision={4}
            className="w-1/2"
          />
          <ValueWithFallback
            value={cvxAmountInUsd}
            unit="$"
            loading={loading}
            precision={2}
            className="text-gray-900 font-semibold"
          />
        </div>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl w-full">
          <div className="flex items-center gap-2">
            <CurrencyIcon currency="USDT" />
            USDT
          </div>
          <div className="flex items-center gap-1 w-1/2">
              <Trans t={t}>
                {/*Available <span className="hidden tablet:inline">to withdraw</span>*/}
                available_<span className="hidden tablet:inline">to</span>_withdraw
              </Trans>
              {/*Available <span className="hidden tablet:inline">to withdraw</span>*/}
            <span>
              <Tooltip
                content={t('available_hint')}
                style="light"
                arrow={false}
                className="max-w-[300px]"
              >
              <QuestionMark />
            </Tooltip>
          </span>
          </div>
          <ValueWithFallback
            value={availableToWithdraw}
            unit="$"
            loading={loading}
            precision={2}
            className="text-gray-900 font-semibold"
          />
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4">
        <div className="flex items-center">
          {t('total_earned_total')}, USD
          <span>
              <Tooltip
                content={t('total_earned_hint')}
                style="light"
                arrow={false}
                className="max-w-[300px]"
              >
              <QuestionMark className="ml-2" />
            </Tooltip>
            </span>
        </div>
        <ValueWithFallback
          value={totalSum}
          unit="$"
          loading={loading}
          precision={2}
          className="text-gray-900 font-semibold"
        />
      </div>
    </Card>
  );
};

export default AccruedYield;
