"use client";

import 'react-toastify/dist/ReactToastify.css';
import { useTranslations } from 'next-intl';
import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
  useEffect,
} from 'react';

import { Pi } from '@pinetwork-js/sdk';
import axiosClient from '@/config/client';
import { onIncompletePaymentFound } from '@/utils/auth';
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
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const registerUser = async () => {
    logger.info('Initializing Pi SDK');

    await Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });
    const isInitiated = Pi.initialized;

    if (!isInitiated) {
      logger.error("Pi SDK failed to initialize.");
      return;
    }

    try {
      setIsSigningInUser(true);

      const pioneerAuth: AuthResult = await window.Pi.authenticate(
        ['username', 'payments'],
        onIncompletePaymentFound
      );

      const res = await axiosClient.post(
        "/users/authenticate",
        {},
        {
          headers: {
            Authorization: `Bearer ${pioneerAuth.accessToken}`,
          },
        }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.user);
        logger.info("User authenticated.");
      } else {
        setCurrentUser(null);
        logger.error("User authentication failed.");
      }

    } catch (err) {
      logger.error("registerUser failed:", err);
    } finally {
      setIsSigningInUser(false);
    }
  };

  const autoLoginUser = async () => {
    try {
      const res = await axiosClient.get("/users/me", { withCredentials: true });

      if (res.status === 200) {
        setCurrentUser(res.data);
      }
    } catch (error) {
      await registerUser();
    }
  };

  useEffect(() => {
    autoLoginUser();
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
