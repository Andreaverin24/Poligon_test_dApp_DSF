// DepositPage.tsx

import {
  useEffect,
  useState,
} from 'react';
import { formatUnits } from 'viem';
import { useAppKit, useWalletInfo } from '@reown/appkit/react';
import { useBalance, useAccount, useChainId } from 'wagmi';
import type { UseAppKitAccountReturn } from '@reown/appkit/react';
import { Navigate, useParams } from 'react-router-dom';
import useDepositContext from '../hooks/useDepositContext';
import useGlobalContext from '../hooks/useGlobalContext';

import { useSimulateGasEstimates } from '../hooks/useSimulateGasEstimates';

import axios from 'axios';
import Logger from '../utils/logger';

// components
import DepositNavigation from './deposit/DepositNavigation';
import DepositCard from './deposit/DepositCard';
import Disclaimer from './deposit/Disclaimer';
import FAQ from './deposit/FAQContainer';
import { useTranslation } from 'react-i18next';

const DepositPage = () => {
  const { open } = useAppKit();
  const rawWalletInfo = useWalletInfo().walletInfo;
  const walletInfo = rawWalletInfo as UseAppKitAccountReturn | undefined;
  
  const { address, isConnecting } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const chainId = useChainId();

  useSimulateGasEstimates();

  const { customPart } = useParams();
  const [sended, setSended] = useState(false); 

  const {
    currentStep,
    setInterestRate,
    resetContext,
  } = useDepositContext();

  const {
    walletInfo: globalWalletInfo,
    walletName,
    tokenBalances,
    tokenAllowances,
  } = useGlobalContext();

  // 🧼 Reset context on unmount and on address change
  // on wallet change
  useEffect(() => {
    resetContext();
    return () => resetContext();
  }, [address]);

  const { t } = useTranslation('deposit');
  const savedCustomPart = localStorage.getItem('customPart');

  async function addUserToReferral(address: string, customPart: string) {
    if (sended) return;  
    setSended(true);    

    try {
      const resp = await axios.post('https://alex.dsf.finance/api/addUsertoReferal', {
        address: address,
        customPart: customPart,
      });

      if (resp.data.success) {
        // console.log(resp.data.message);
      }
    } catch (error) {
      // console.error("Error sending referral request:", error);
    }
  }
  
  useEffect(() => {
    if(address && chainId){
      Logger.setUserContext({
        address,
        networkId: chainId,
        walletName: walletName,
        tokenBalances: {
          USDT: tokenBalances.USDT.toString(),
          USDC: tokenBalances.USDC.toString(),
          DAI: tokenBalances.DAI.toString(),
        },
        tokenAllowances: {
          USDT: tokenAllowances.USDT.toString(),
          USDC: tokenAllowances.USDC.toString(),
          DAI: tokenAllowances.DAI.toString(),
        },
        ethBalance: ethBalance ? formatUnits(ethBalance.value, 18) : undefined,

      });
    }
    if (customPart && address) {
      addUserToReferral(address, customPart);
    } else if (customPart && !address) {
      localStorage.setItem('customPart', customPart);
    } else if (address && !customPart && savedCustomPart) {
      addUserToReferral(address, savedCustomPart);
    }
  }, [
    customPart, 
    address, 
    tokenBalances,
    tokenAllowances
  ]);

  useEffect(() => {
    if(address && (customPart || savedCustomPart)){
      setTimeout(() => {
        // console.log('clean duplicates');
        axios.get('https://alex.dsf.finance/api/cleanDuplicates').catch(e => {
          // console.error('cleanDuplicates error', e);
        });
      }, 10000);
    }
  }, [address, customPart, savedCustomPart]);

  useEffect(() => {
    if (globalWalletInfo?.apy_today) {
      setInterestRate(+(parseFloat(globalWalletInfo.apy_today)).toFixed(2));
    }
  }, [globalWalletInfo]);

  function renderConnectWallet() {
    if(!address && window.innerWidth >800) {
      return(
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-[670px] h-[400px] rounded-3xl shadow-lg flex flex-col items-center justify-center px-[110px]">
            <div className="text-[#3956FE] text-[22px] font-bold text-center">
              {t('please_connect_wallet')}
            </div>
            <button 
              className='flex items-center gap-2 bg-[#3956FE] text-white px-4 py-2 rounded-xl mt-[50px] px-[30px] active:opacity-75'
              onClick={() => open({ view: 'Connect' })}
            >
              <img src='/metamask.png' alt="wallet" />
                {t('connect_wallet')}
            </button>
            <div className="text-[#979797] text-[16px] font-bold text-center mt-[50px]">
              {t('connect_wallet_description')}
            </div>
          </div>
        </div>
      );
    } else if(!address && window.innerWidth <= 800) {
      return(
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] h-[80vh] rounded-3xl shadow-lg flex flex-col items-center justify-center px-[50px]">
            <div className="text-[#3956FE] text-[22px] font-bold text-center">
              {t('please_connect_wallet')}
            </div>
            <button 
              className='flex items-center gap-2 bg-[#3956FE] text-white px-4 py-2 rounded-xl mt-[50px] px-[30px] active:opacity-75' 
              onClick={() => open({ view: 'Connect' })}
            >
              <img src='/metamask.png' alt="wallet" />
                {t('connect_wallet')}
            </button>
            <div className="text-[#979797] text-[16px] font-bold text-center mt-[50px]">
              {t('connect_wallet_description')}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <>
    {/* {renderConnectWallet()} */}
      <DepositNavigation />
      <DepositCard />
      { currentStep > 1 && (<Disclaimer />)}
      <FAQ />
    </>
  );
};

export default DepositPage;
