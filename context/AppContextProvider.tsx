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
import { onIncompletePaymentFound } from '@/utils/auth';
import { AuthResult } from '@/constants/pi';
import { IUser } from '@/constants/types';

import logger from '../logger.config.mjs';

interface IAppContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<SetStateAction<IUser | null>>;
  registerUser: () => void;
  autoLoginUser:()=> void,
  isSigningInUser: boolean
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  registerUser: () => { },
  autoLoginUser:()=> {},
  isSigningInUser:false
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const t = useTranslations();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isSigningInUser,setIsSigningInUser] = useState(false)

  const registerUser = async () => {
    logger.info('Initializing Pi SDK for user registration.');
    await Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });

    let isInitiated = Pi.initialized;
    logger.info(`Pi SDK initialized: ${isInitiated}`);

    if (isInitiated) {
      try {
        setIsSigningInUser(true)
        const pioneerAuth: AuthResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        const res = await axiosClient.post("/users/authenticate", {pioneerAuth});

        if (res.status === 200) {
          setAuthToken(res.data?.token)
          setCurrentUser(res.data.user);
          logger.info('User authenticated successfully.');
          setTimeout(() => {
            setIsSigningInUser(false); // hide the splash screen after the delay
          }, 5000);
        } else if (res.status === 500) {
          setCurrentUser(null);
          logger.error('User authentication failed.');
          setIsSigningInUser(false)
        }        
      } catch (error: any) {
        logger.error('Error during user registration:', { error });
        setIsSigningInUser(false)
      }
    } else {
      logger.error('PI SDK failed to initialize.');
    }
  };

  const autoLoginUser = async () => {
    logger.info('Attempting to auto-login user.');
    try {
      setIsSigningInUser(true)
      const res = await axiosClient.get('/users/me');

      if (res.status === 200) {
        logger.info('Auto-login successful.');
        setCurrentUser(res.data);
        setTimeout(() => {
          setIsSigningInUser(false); // hide the splash screen after the delay
        }, 5000);
      } else {
        setCurrentUser(null);
        logger.warn('Auto-login failed.');
        setIsSigningInUser(false)
      }
    } catch (error: any) {
      logger.error('Auto login unresolved; attempting Pi SDK authentication:', { error });
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
    <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser, isSigningInUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
