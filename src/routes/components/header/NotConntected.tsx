// header/NotConntected.tsx

import { useAppKit } from '@reown/appkit/react';
import { useTranslation } from 'react-i18next';

// components
import Button from '../../../components/CustomButton';

const NotConnected = () => {
  const { open } = useAppKit();
  const { t } = useTranslation('header');

  return (
    // Mobile version
    // <div className="flex items-center button__container">
    //   <Button 
    //     type="button" 
    //     variant="outline" 
    //     className="px-8 pt-[8px] pb-[8px] rounded-[12px] min-w-[120px]"
    //     onClick={() => open({ view: 'Connect' })}
    //   >
    //     {/* <Wallet size={16} className="mr-2" /> */}
    //     <span className="tablet:hidden">{t('wallet')}</span>
    //     <span className="hidden tablet:inline">{t('connect_wallet')}</span>
    //   </Button>
    // </div>
    <>
      {/* Mobile version */} 
      <div className="flex items-center tablet:hidden button__container-mobile">
        <Button 
          /*variant="outline"*/
          variant="filled"
          onClick={() => open({ view: 'Connect' })}
        >
          {t('wallet')}
        </Button>
      </div>
      {/* Tablet+ version */}
      <div className="hidden tablet:flex items-center button__container">
        <Button 
          /*variant="outline"*/
          variant="filled"
          onClick={() => open({ view: 'Connect' })}
        >
          {t('connect_wallet')}
        </Button>
      </div>
    </>
  )
};

export default NotConnected;
