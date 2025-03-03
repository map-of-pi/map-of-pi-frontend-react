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

import { Pi } from '@pinetwork-js/sdk';
import axiosClient, {setAuthToken} from '@/config/client';
import { onIncompletePaymentFound } from '@/config/payment';
import { AuthResult } from '@/constants/pi';
import { IUser } from '@/constants/types';

import logger from '../logger.config.mjs';

interface IAppContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<SetStateAction<IUser | null>>;
  registerUser: () => void;
  autoLoginUser: ()=> void;
  isSigningInUser: boolean;
  reload: boolean;
  alertMessage: string | null;
  setAlertMessage: React.Dispatch<SetStateAction<string | null>>;
  showAlert: (message: string) => void;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  isSaveLoading: boolean;
  setIsSaveLoading: React.Dispatch<SetStateAction<boolean>>;
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  registerUser: () => { },
  autoLoginUser: ()=> {},
  isSigningInUser: false,
  reload: false,
  alertMessage: null,
  setAlertMessage: () => {},
  showAlert: () => {},
  setReload: () => {},
  isSaveLoading: false,
  setIsSaveLoading: () => {}
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

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null); // Clear alert after 5 seconds
    }, 5000);
  };

  const registerUser = async () => {
    logger.info('Initializing Pi SDK for user registration.');
    await Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });
    let isInitiated = Pi.initialized;

    if (isInitiated) {
      try {
        setIsSigningInUser(true);
        const pioneerAuth: AuthResult = await window.Pi.authenticate([
          'username', 
          'payments', 
          'wallet_address'
        ], onIncompletePaymentFound);
        const res = await axiosClient.post("/users/authenticate", 
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
          setTimeout(() => {
            setIsSigningInUser(false); // hide the splash screen after the delay
          }, 2500);
        } else if (res.status === 500) {
          setCurrentUser(null);
          logger.error('User authentication failed.');
          setIsSigningInUser(false);
        }        
      } catch (error) {
        logger.error('Error during user registration:', error);
        setIsSigningInUser(false);
      }
    } else {
      logger.error('PI SDK failed to initialize.');
    }
  };

  const autoLoginUser = async () => {
    logger.info('Attempting to auto-login user.');
    try {
      setIsSigningInUser(true);
      const res = await axiosClient.get('/users/me');

      if (res.status === 200) {
        logger.info('Auto-login successful.');
        setCurrentUser(res.data);
        setTimeout(() => {
          setIsSigningInUser(false); // hide the splash screen after the delay
        }, 2500);
      } else {
        setCurrentUser(null);
        logger.warn('Auto-login failed.');
        setIsSigningInUser(false);
      }
    } catch (error) {
      logger.error('Auto login unresolved; attempting Pi SDK authentication:', error);
      await registerUser();
    }
  }

  useEffect(() => {
    logger.info('AppContextProvider mounted.');
    if (!currentUser) {
      registerUser();
    } else {
      autoLoginUser();
    }
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser, isSigningInUser, reload, setReload, showAlert, alertMessage, setAlertMessage, isSaveLoading, setIsSaveLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
