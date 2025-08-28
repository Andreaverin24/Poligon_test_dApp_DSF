// Header.tsx

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// icons
import { ReactComponent as Logo } from '../../assets/images/logo.svg?react';

// styles
import '../styles/header.css';

// components
import Navigation from '../../components/Navigation';
import NotConnected from './header/NotConntected';
import Connected from './header/Connected';
import Loading from './header/Loading';
import { useWalletContext } from '../../context/WalletStatusContext';
import Spinner from './Spinner';

const Header = () => {
  const { status } = useWalletContext();
  const [coloredHeader, setColoredHeader] = useState<boolean>(false);
  const { t } = useTranslation('header');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const scrollEvent = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setColoredHeader(window.scrollY > 50);
      }, 50);
    };

    window.addEventListener('scroll', scrollEvent);

    return () => window.removeEventListener('scroll', scrollEvent);
  }, []);
  
  return (
    <header 
      role="banner"
      className={`z-10 sticky top-0 left-0 w-full h-[68px] transition-colors duration-300 ${coloredHeader ? 'filled' : ''}`}
    >
      <div className="flex justify-between h-full container mx-auto">
        <div className="flex items-center tablet:flex-row-reverse">
          <Navigation />
          <Link to="https://dsf.finance">
            <Logo className="w-[146px] h-[40px] ml-3 tablet:ml-0 tablet:mr-6" />
          </Link>
        </div>
        {status === 'loading' && <Loading />}
        {status === 'connected' && <Connected />}
        {status === 'disconnected' && <NotConnected />}
      </div>
    </header>
  )
};

export default Header;
