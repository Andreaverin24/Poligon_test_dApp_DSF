// SavedGas.tsx

import {
  useState,
  useCallback,
  useMemo,
} from 'react';

import useGlobalContext from '../../hooks/useGlobalContext';
import dropdownIcon from '../../assets/images/common/dropdown.png';

import { Tooltip } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

// icons
import { ReactComponent as QuestionMark } from '../../assets/images/common/question.svg?react';

// components
import Card from '../../components/Card';
import CurrencyIcon from '../../components/CurrencyIcon';
import ValueWithFallback from '../../components/ValueWithFallback';

interface SavedGasProps {
  deposits: number | null;
  withdrawals: number | null;
  usdSavedOnDeposits: number | null;
  usdSavedOnWithdrawals: number | null;
}

const SavedGas = (props: SavedGasProps) => {
  const {
    deposits,
    withdrawals,
    usdSavedOnDeposits,
    usdSavedOnWithdrawals
  } = props;
  const [opened, setOpened] = useState<boolean>(false);
  // const { ETHPrice } = useGlobalContext();
  const { t } = useTranslation('dashboard');

  const savedOnDepositsInUsd = (usdSavedOnDeposits || 0);
  const savedOnWithdrawalsInUsd = (usdSavedOnWithdrawals || 0);

  const triggerDropdown = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  return (
    <Card>
      <div className="flex items-center cursor-pointer" onClick={triggerDropdown}>
        <h2 className="text-gray-900 text-[24px] leading-8 font-bold">
          {t('saved_gas')}
        </h2>
        <div className="ml-auto">
          <img src={dropdownIcon} alt="" className={opened ? '' : 'rotate-180'} />
        </div>
      </div>
      <div className={`${opened ? 'flex' : 'hidden'} flex-col tablet:flex-row gap-4 mt-4 font-medium`}>
        <label className="text-sm tablet:w-1/2">
          {t('saved_on_deposits')}
          <div className="flex items-center justify-between bg-gray p-4 rounded-2xl text-base">
            <div className="flex items-center gap-[10px] text-gray-900">
              <CurrencyIcon currency="ETH" />
              <ValueWithFallback
                value={deposits ?? undefined}
                unit="ETH"
                precision={4}
                className="text-gray-900"
              />
            </div>
            <ValueWithFallback
              value={savedOnDepositsInUsd}
              unit="$"
              precision={2}
            />
          </div>
        </label>
        <label className="text-sm tablet:w-1/2">
          {t('saved_on_withdrawals')}
          <div className="flex items-center justify-between bg-gray p-4 rounded-2xl text-base">
            <div className="flex items-center gap-[10px] text-gray-900">
              <CurrencyIcon currency="ETH" />
              <ValueWithFallback
                value={withdrawals ?? undefined}
                unit="ETH"
                precision={4}
                className="text-gray-900"
              />
            </div>
            <ValueWithFallback
              value={savedOnWithdrawalsInUsd}
              unit="$"
              precision={2}
            />
          </div>
        </label>
      </div>
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4">
        <div className="flex items-center">
          {t('total_saved')}, USD
          <span>
            <Tooltip
              content={t('saved_gas_tooltip')}
              style="light"
              arrow={false}
              className="max-w-[300px]"
            >
              <QuestionMark className="inline-block ml-2" />
            </Tooltip>
          </span>
        </div>
        <ValueWithFallback
          value={savedOnDepositsInUsd + savedOnWithdrawalsInUsd}
          unit="$"
          precision={2}
          className={`font-semibold ${savedOnDepositsInUsd + savedOnWithdrawalsInUsd > 0 ? 'text-[#73D516]' : 'text-gray-900'}`}
        />
      </div>
    </Card>
  )
};

export default SavedGas;
