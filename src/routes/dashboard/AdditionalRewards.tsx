import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';
import dropdownIcon from '../../assets/images/common/dropdown.png';
import { Tooltip } from 'flowbite-react';

// icons
import { ReactComponent as QuestionMark }  from '../../assets/images/common/question.svg?react';

// components
import Card from '../../components/Card';
import CurrencyIcon from '../../components/CurrencyIcon';
import Timer from '../../components/Timer';

interface AdditionalRewardsProps {
  cvxCRVAmount: number;
  cvxFXSAmount: number;
  FXSAmount: number;
  cvxCRVAmountInUsd: number;
  cvxFXSAmountInUsd: number;
  FXSAmountInUsd: number;
}

const AdditionalRewards = (props: AdditionalRewardsProps) => {
  const {
    cvxCRVAmount,
    cvxFXSAmount,
    FXSAmount,
    cvxCRVAmountInUsd,
    cvxFXSAmountInUsd,
    FXSAmountInUsd,
  } = props;
  const [opened, setOpened] = useState<boolean>(false);

  const totalSum = useMemo(() => {
    const sum = cvxCRVAmountInUsd + cvxFXSAmountInUsd + FXSAmountInUsd;
    if (sum > 0) return sum;
    return 0;
  }, [cvxCRVAmountInUsd, cvxFXSAmountInUsd, FXSAmountInUsd]);

  const triggerDropdown = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  const dateTillNextRewardsDistribution = useMemo(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 4);
    today.setDate(1);
    today.setHours(8, 0, 0, 0);
    const dayOfTheWeek = today.getDay();
    if (dayOfTheWeek < 6) {
      today.setDate(today.getDate() + (6 - dayOfTheWeek));
    } else {
      today.setDate(today.getDate() + (13 - dayOfTheWeek));
    }

    return today;
  }, []);

  return (
    <Card>
      <div className="flex items-center cursor-pointer" onClick={triggerDropdown}>
        <div className="tablet:flex items-center">
          <h2 className="text-gray-900 text-[24px] leading-8 font-bold">
            Additional rewards
          </h2>
          <div className="tablet:ml-2">
            <Timer endTime={dateTillNextRewardsDistribution} />
          </div>
        </div>
        <div className="ml-auto">
          <img src={dropdownIcon} alt="" className={opened ? '' : 'rotate-180'} />
        </div>
      </div>
      <div className={`${opened ? 'flex' : 'hidden'} flex-col gap-4 mt-4 font-medium`}>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <CurrencyIcon currency="cvxCRV" />
            cvxCRV
          </div>
          <span className="w-1/2">
            {(cvxCRVAmount > 0 ? cvxCRVAmount : 0).toFixed(4)} tokens
          </span>
          <span className="text-gray-900 font-semibold">
            ${(cvxCRVAmountInUsd > 0 ? cvxCRVAmountInUsd : 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <CurrencyIcon currency="cvxFXS" />
            cvxFXS
          </div>
          <span className="w-1/2">
            {(cvxFXSAmount > 0 ? cvxFXSAmount : 0).toFixed(4)} tokens
          </span>
          <span className="text-gray-900 font-semibold">
            ${(cvxFXSAmountInUsd > 0 ? cvxFXSAmountInUsd : 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <CurrencyIcon currency="FXS" />
            FXS
          </div>
          <span className="w-1/2">
            {(FXSAmount > 0 ? FXSAmount : 0).toFixed(4)} tokens
          </span>
          <span className="text-gray-900 font-semibold">
            ${(FXSAmountInUsd > 0 ? FXSAmountInUsd : 0).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4">
        <div className="flex items-center">
          Total earned, USD
          <span>
              <Tooltip
                content={`DSF uses its own funds to purchase CVX tokens from Convex. It participates in the Convex DAO
                  and shares the profits obtained with DSF users. To receive rewards, your deposit must remain in DSF.`}
                style="light"
                arrow={false}
                className="max-w-[300px]"
              >
                <QuestionMark className="ml-2" />
              </Tooltip>
            </span>
        </div>
        <span className="text-gray-900 font-semibold">
          ${totalSum.toFixed(2)}
        </span>
      </div>
    </Card>
  );
};

export default AdditionalRewards;
