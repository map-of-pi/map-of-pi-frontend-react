"use client";

import 'react-toastify/dist/ReactToastify.css';
import { useTranslations } from 'next-intl';
import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useEffect
} from 'react';
import axiosClient, { setAuthToken } from '@/config/client';
import { onIncompletePaymentFound } from '@/config/payment';
import { AuthResult } from '@/constants/pi';
import { IUser } from '@/constants/types';

import logger from '../logger.config.mjs';

interface IAppContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<SetStateAction<IUser | null>>;
  registerUser: () => void;
  autoLoginUser: () => void;
  isSigningInUser: boolean;
  reload: boolean;
  alertMessage: string | null;
  setAlertMessage: React.Dispatch<SetStateAction<string | null>>;
  showAlert: (message: string) => void;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  isSaveLoading: boolean;
  setIsSaveLoading: React.Dispatch<SetStateAction<boolean>>;
  adsSupported: boolean;
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  registerUser: () => {},
  autoLoginUser: () => {},
  isSigningInUser: false,
  reload: false,
  alertMessage: null,
  setAlertMessage: () => {},
  showAlert: () => {},
  setReload: () => {},
  isSaveLoading: false,
  setIsSaveLoading: () => {},
  adsSupported: false
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const t = useTranslations();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isSigningInUser, setIsSigningInUser] = useState(false);
  const [reload, setReload] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [adsSupported, setAdsSupported] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
  };

  
  
  /* Register User via Pi SDK */
  const registerUser = async () => {
    logger.info('Starting user registration.');

    if (typeof window !== 'undefined' && window.Pi?.initialized) {
      try {
        setIsSigningInUser(true);
        const pioneerAuth: AuthResult = await window.Pi.authenticate([
          'username', 
          'payments', 
          'wallet_address'
        ], onIncompletePaymentFound);

        // Send accessToken to backend
        const res = await axiosClient.post(
          "/users/authenticate", 
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${pioneerAuth.accessToken}`,
            },
          }
        );

        if (res.status === 200) {
          setAuthToken(res.data?.token);
          setCurrentUser(res.data.user);
          logger.info('User authenticated successfully.');
        } else {
          setCurrentUser(null);
          logger.error('User authentication failed.');
        }
      } catch (error) {
        logger.error('Error during user registration:', error);
      } finally {
        setTimeout(() => setIsSigningInUser(false), 2500);
      }
    } else {
      logger.error('PI SDK failed to initialize.');
    }
  };

  /* Attempt Auto Login (fallback to Pi auth) */
  const autoLoginUser = async () => {
    logger.info('Attempting to auto-login user.');
    try {
      setIsSigningInUser(true);
      const res = await axiosClient.get('/users/me');

      if (res.status === 200) {
        logger.info('Auto-login successful.');
        setCurrentUser(res.data);
      } else {
        logger.warn('Auto-login failed.');
        setCurrentUser(null);
      }
    } catch (error) {
      logger.error('Auto login unresolved; attempting Pi SDK authentication:', error);
      await registerUser();
    } finally {
      setTimeout(() => setIsSigningInUser(false), 2500);
    }
  };

  /* Wait for Pi SDK to load (polling) */
  const waitForPi = (): Promise<typeof window.Pi> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && window.Pi) {
          clearInterval(interval);
          resolve(window.Pi);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Pi SDK failed to load.'));
      }, 5000);
    });
  };

  useEffect(() => {
    logger.info('AppContextProvider mounted.');

    const node_env = process.env.NODE_ENV;

    // Dynamically load the Pi SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;

    script.onload = async () => {
      try {
        const Pi = await waitForPi();

        Pi.init({ version: '2.0', sandbox: node_env === 'development' });
        
        // Initialize Ad Network
        const nativeFeaturesList = await Pi.nativeFeaturesList();
        const adNetworkSupported = nativeFeaturesList.includes("ad_network");
        setAdsSupported(adNetworkSupported);

        if (!currentUser) {
          registerUser();
        } else {
          autoLoginUser();
        }
      } catch (error) {
        logger.error('Error initializing Pi SDK:', error);
      }
    };

    document.head.appendChild(script);
  }, []);

  return (
    <AppContext.Provider 
      value={{ 
        currentUser, 
        setCurrentUser, 
        registerUser, 
        autoLoginUser, 
        isSigningInUser, 
        reload, 
        setReload, 
        showAlert, 
        alertMessage, 
        setAlertMessage, 
        isSaveLoading, 
        setIsSaveLoading, 
        adsSupported 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
