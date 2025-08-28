// components/SplashScreen.tsx

import { useEffect, useState, useRef } from 'react';
import { ReactComponent as Logo } from '../assets/images/logo.svg?react';
import { useWalletContext } from '../context/WalletStatusContext';

const SplashScreen = () => {
  const { status } = useWalletContext();
  const [hidden, setHidden] = useState(false);
  const [minVisible, setMinVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMinVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status !== 'loading' && minVisible) {
      const timeout = setTimeout(() => {
        if (ref.current && document.body.contains(ref.current)) {
          setHidden(true);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [status, minVisible]);

  const done = status !== 'loading' && minVisible;
  
  return (
    <div
      ref={ref}
      className={`
        fixed inset-0 z-50 bg-white flex items-center justify-center
        transition-opacity duration-500
        ${done ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        ${hidden ? 'hidden' : ''}
      `}
    >
      <Logo className="w-64 h-16 animate-pulse" />
    </div>
  );
};

export default SplashScreen;
