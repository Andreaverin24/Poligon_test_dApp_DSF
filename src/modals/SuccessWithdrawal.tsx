// SuccessWithdrawal.tsx

import { useTranslation } from 'react-i18next';
import './styles/success_deposit.css';

// images
import { ReactComponent as SuccessImage } from '../assets/images/success.svg?react';
import { ReactComponent as EtherscanIcon } from '../assets/images/blockchain/etherscan.svg?react'

// components
import Modal from '../components/CustomModal';
import Button from '../components/CustomButton';
import Socials from '../components/Socials';

interface SuccessWithdrawalProps {
  opened: boolean;
  onClose: () => void;
  etherscanLink: string;
}

const SuccessWithdrawal = (props: SuccessWithdrawalProps) => {
  const {
    opened,
    onClose,
    etherscanLink,
  } = props;
  const { t } = useTranslation('modals');

  return (
<Modal opened={opened} onClose={onClose}>
  <div className="flex flex-col items-center">
    <SuccessImage className="w-14 h-14"/>
    <div className="mt-3">{t('success_withdrawal')}</div>
    <div className="flex flex-col gap-3 mt-8 modal__button-container">
      <a href={etherscanLink} target="_blank" rel="noreferrer">
        <Button variant="filled" onClick={() => null}>
          <div className="flex items-center">
            <EtherscanIcon className="w-6 h-6 mr-3" />
            {t('view_transaction')}
          </div>
        </Button>
      </a>
      <div className="back-button__container">
        <Button variant="outline" onClick={onClose}>
          {t('back_to_DSF')}
        </Button>
      </div>
    </div>
    <div className="flex flex-col items-center mt-10">
      <div className="mb-4">
        {t('also_subscribe')}
      </div>
      <Socials />
    </div>
  </div>
</Modal>
  )
};

export default SuccessWithdrawal;
