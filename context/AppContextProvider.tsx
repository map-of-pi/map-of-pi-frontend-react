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
import { toast } from 'react-toastify';

import { Pi } from '@pinetwork-js/sdk';
import axiosClient, {setAuthToken} from '@/config/client';
import { onIncompletePaymentFound } from '@/util/auth';
import { IUser } from '@/constants/types';
import { UserSettingsProvider } from './UserSettingsContext';

import logger from '../logger.config.mjs';

type AuthResult = {
  accessToken: string,
  user: {
    uid: string,
    username: string
  }
};

interface IAppContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<SetStateAction<IUser | null>>;
  registerUser: () => void;
  autoLoginUser: () => void;
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  registerUser: () => { },
  autoLoginUser: () => {},
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const t = useTranslations();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const registerUser = async () => {
    logger.info('Initializing Pi SDK for user registration.');
    await Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });

    let isInitiated = Pi.initialized;
    logger.info(`Pi SDK initialized: ${isInitiated}`);

    if (isInitiated) {
      try {
        const pioneerAuth: AuthResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        const res = await axiosClient.post("/users/authenticate", {pioneerAuth});

        if (res.status === 200) {
          setAuthToken(res.data?.token);
          setCurrentUser(res.data.user);
          toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data?.user?.user_name}`);
          logger.info('User authenticated successfully.');
        } else if (res.status === 500) {
          setCurrentUser(null);
          toast.error(`${t('HOME.AUTHENTICATION.UNSUCCESSFUL_LOGIN_MESSAGE')}`);
          logger.error('User authentication failed.');
        }
      } catch (error: any) {
        logger.error('Error during user registration:', { error });
        toast.info(t('HOME.AUTHENTICATION.PI_INFORMATION_NOT_FOUND_MESSAGE'));
      }
    } else {
      logger.error('PI SDK failed to initialize.');
    }
  };

  const autoLoginUser = async () => {
    logger.info('Attempting to auto-login user.');
    try {
      const res = await axiosClient.get('/users/me');

      if (res.status === 200) {
        logger.info('Auto-login successful.');
        setCurrentUser(res.data);
        toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data.user_name}`);
      } else {
        setCurrentUser(null);
        logger.warn('Auto-login failed.');
      }
    } catch (error: any) {
      logger.error('Auto login unresolved; attempting Pi SDK authentication:', { error });
      await registerUser();
    }
  };

  useEffect(() => {
    logger.info('AppContextProvider mounted.');
    if (!currentUser) {
      registerUser();
    } else {
      autoLoginUser();
    }
  }, []);

  return (
    <UserSettingsProvider> {/* Wrap with UserSettingsProvider */}
      <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser }}>
        {children}
      </AppContext.Provider>
    </UserSettingsProvider>
  );
};

export default AppContextProvider;