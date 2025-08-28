// TotalEarned.tsx

import {
  useState,
  useCallback,
  useMemo,
} from 'react';
import dropdownIcon from '../../assets/images/common/dropdown.png';
import { Tooltip } from 'flowbite-react';

// icons
import { ReactComponent as QuestionMark } from '../../assets/images/common/question.svg?react';

// components
import Card from '../../components/Card';

interface TotalEarnedProps {
  userMainProfit: number;
  cvxCRVAmount: number;
  cvxFXSAmount: number;
  FXSAmount: number;
}

const TotalEarned = (props: TotalEarnedProps) => {
  const {
    userMainProfit,
    cvxCRVAmount,
    cvxFXSAmount,
    FXSAmount,
  } = props;
  const [opened, setOpened] = useState<boolean>(false);

  const earnedOnAdditionalRewards = useMemo(() => {
    const sum = cvxCRVAmount + cvxFXSAmount + FXSAmount;
    if (sum > 0) return sum;
    return 0;
    }, [cvxCRVAmount, cvxFXSAmount, FXSAmount]);

  const totalEarned = useMemo(
    () => userMainProfit + earnedOnAdditionalRewards,
    [userMainProfit, earnedOnAdditionalRewards]
  );

  const triggerDropdown = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  return (
    <Card>
      <div className="flex items-center cursor-pointer" onClick={triggerDropdown}>
        <h2 className="text-gray-900 text-[24px] leading-8 font-bold">Total earned</h2>
        <div className="ml-auto">
          <img src={dropdownIcon} alt="" className={opened ? '' : 'rotate-180'} />
        </div>
      </div>
      <div className={`${opened ? 'flex' : 'hidden'} flex-col gap-4 mt-4 font-medium`}>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <span>
            Main strategy
          </span>
          <span className="text-gray-900 font-semibold">
            ${userMainProfit.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray p-4 rounded-2xl">
          <span>
            Additional rewards
          </span>
          <span className="text-gray-900 font-semibold">
            ${earnedOnAdditionalRewards.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 font-medium rounded-2xl mt-4">
        <div className="flex items-center">
          Total earned, USD
          <span>
            <Tooltip
              content="The total amount of income earned throughout your tenure with DSF."
              style="light"
              arrow={false}
              className="max-w-[300px]"
            >
              <QuestionMark className="ml-2" />
            </Tooltip>
          </span>
        </div>
        <span className="text-gray-900 font-semibold">
          ${totalEarned.toFixed(2)}
        </span>
      </div>
    </Card>
  );
};

export default TotalEarned;
