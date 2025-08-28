// Input.tsx

import {
  useCallback
} from 'react';
import { useTranslation } from 'react-i18next';

import './styles/input.css';

import CurrencyIcon from './CurrencyIcon';


interface InputProps {
  value: string;
  onChange: (value: string) => void;
  currency?: StableType;
  label: React.ReactNode;
  withRange?: boolean;
  maxValue: number;
}

const Input = (props: InputProps) => {
  const {
    value,
    onChange,
    currency,
    label,
    withRange,
    maxValue,
  } = props;
  const { t } = useTranslation('deposit');

  const changeInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    onChange(value);
  }, [onChange]);

  const maxButtonClickHandler = useCallback(() => {
    onChange(maxValue.toString());
  }, [maxValue, onChange]);

  const getStep = (max: number): number => {
    if (max === 0 || isNaN(max)) return 0.01;
  
    const magnitude = Math.floor(Math.log10(max));
    const baseStep = Math.pow(10, magnitude - 2);
  
    return Math.max(0.01, Math.floor(baseStep * 100) / 100);
  };

  return (
    <div>
      <label className="block text-sm font-medium">
        {label}
        <div className="relative">
          {
            currency && (
              <div className="absolute left-4 top-1 bottom-0 flex items-center">
                <CurrencyIcon currency={currency} />
              </div>
            )
          }
          <input
            type="number"
            className={`w-full h-12 pr-14 ${currency ? 'pl-12' : ''} rounded-xl border-gray-border text-gray-900 border-2 mt-1`}
            value={value}
            onChange={changeInputValue}
          />
          <button
            className="absolute right-4 top-1 bottom-0 text-blue text-base"
            onClick={maxButtonClickHandler}
          >
            {t('max')}
          </button>
          {
            withRange &&
            <input
              type="range"
              step={getStep(maxValue)}
              min={0}
              max={maxValue}
              value={parseFloat(value) || 0}
              onChange={changeInputValue}
              className="absolute bottom-0 left-4 right-0 z-1 w-[calc(100%-2rem)] h-[2px] bg-blue rounded-lg appearance-none cursor-pointer range-xs dark:bg-gray-700 range-input"
            />
          }
        </div>
      </label>
    </div>
  )
};

export default Input;
