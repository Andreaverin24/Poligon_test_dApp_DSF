// deposit/steps/SecondStep.tsx

import {
  useCallback,
  useMemo,
  useState
} from 'react';
import useDepositContext from '../../../hooks/useDepositContext';
import useGlobalContext from '../../../hooks/useGlobalContext';
import { useTranslation } from 'react-i18next';

// components
import StepsContainer from './StepsContainer';
import Input from '../../../components/Input';
import CurrencyIcon from '../../../components/CurrencyIcon';
import Button from '../../../components/CustomButton';

const SecondStep = () => {
  const {
    selectedCurrency,
    changeCurrentStep,
    depositAmount,
    changeDepositAmount,
  } = useDepositContext();
  const { walletInfo } = useGlobalContext();
  const [showCalc, setShowCalc] = useState(false);
  const { t } = useTranslation('deposit');

  const parsedBalance = useMemo(() => {
    if (!walletInfo?.balances || !selectedCurrency) return 0;
    const val = walletInfo.balances[selectedCurrency];
    const parsed = parseFloat(val ?? '0');
    return isNaN(parsed) ? 0 : parsed;
  }, [walletInfo?.balances, selectedCurrency]);
  
  const isDepositAmountValid = useMemo(() => {
    if (!depositAmount || !selectedCurrency) return false;
    if (Number(depositAmount) <= 0) return false;
    return Number(depositAmount) <= parsedBalance;
  } ,[depositAmount, parsedBalance, selectedCurrency]);

  const changeDepositAmountWithConvertation = useCallback((value: string) => {
    changeDepositAmount(value);
  } ,[changeDepositAmount]);

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth > 800 : true;

  if (!selectedCurrency) {
    return null;
  }

  function renderPcCalc(){
    if(showCalc){
      return(
        <div style={{
          // width: '100%',
          height: '380px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          }}
          >
             <iframe src="https://dsf.finance/ru"
             style={{
              width: '2000px',
              height: '2500px',
              top: '-1952px',
              overflow: 'hidden',
              position: 'absolute',}}
               scrolling="no"
             ></iframe>
             <div
             style={{
              width: '30%',
              height: '15px',
              bottom: '0',
              left: '70%',
              backgroundColor: '#f2f7fd',
              overflow: 'hidden',
              position: 'absolute',}}
             className=""></div>
          </div>
      )
    }
  }

  function renderMobileCalc(){
    if(showCalc){
      return(
        <div style={{
          width: '100%',
          height: '840px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          // scale: '0.7',
          }}
          >
             <iframe src="https://dsf.finance/ru"
             style={{
              // width: '800px',
              height: '4500px',
              top: '-3160px',
              overflow: 'hidden',
              position: 'absolute',}}
               scrolling="no"
             ></iframe>
      
          </div>
      )
    }
  }

  return (
    <div className="relative">
      <div className="scale-[0.3] absolute right-[0%] top-[-57px] z-[5] cursor-pointer" onClick={() => setShowCalc(!showCalc)}>
        <img src="/CALC_ICON.png" alt="" />
      </div>
      { window.innerWidth > 800 ? 
        renderPcCalc()
      :
        renderMobileCalc()
      }
       <StepsContainer title={t('amount')}>
      <div className="tablet:flex items-end gap-[20px]">
        <div className="mt-6 tablet:w-1/2">
          <Input
            label={t('deposit_amount')}
            value={depositAmount.toString()}
            onChange={changeDepositAmountWithConvertation}
            currency={selectedCurrency}
            maxValue={parsedBalance}
          />
        </div>
        <label className="block mt-6 pl-2 text-sm font-medium tablet:mt-0 tablet:w-1/2">
          {t('your_balance')}
          <div className="flex items-center rounded-xl px-4 py-3 mt-1 bg-gray">
            <CurrencyIcon currency={selectedCurrency} />
            <span className={`ml-3 text-gray-900 text-base ${parsedBalance > 0 ? '' : 'text-red-500'}`}>
            {`${parsedBalance} ${selectedCurrency}`}
          </span>
          </div>
        </label>
      </div>
      <div className="mt-6 flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
      {/* <div className="mt-6"> */}
        <Button
          variant="filled"
          onClick={() => changeCurrentStep(2)}
          disabled={!isDepositAmountValid}
        >
          {t('next', { ns: 'common' })}
        </Button>

        {!isDepositAmountValid && parsedBalance <= 0 && (
          <div className="font-medium text-[14px] leading-[20px] text-red-500">
            {t('you_need_to_top_up')}
          </div>
        )}
      </div>
    </StepsContainer>
    </div>
  )
};

export default SecondStep;
