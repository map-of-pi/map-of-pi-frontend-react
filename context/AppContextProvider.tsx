"use client";

import 'react-toastify/dist/ReactToastify.css';

import { useTranslations } from 'next-intl';
import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
} from 'react';
import { toast } from 'react-toastify';

import { Pi } from '@pinetwork-js/sdk';
import axiosClient, {setAuthToken} from '@/config/client';
import { onIncompletePaymentFound } from '@/util/auth';
import { IUser } from '@/constants/types';


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
  autoLoginUser:()=> void,
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  registerUser: () => { },
  autoLoginUser:()=> {},
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const t = useTranslations();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const registerUser = async () => {
    console.log('in registerUser()');
    await Pi.init({version: '2.0', sandbox: process.env.NODE_ENV === 'development' });

    let isInitiated = Pi.initialized;

    if (isInitiated) {
      console.log('in isInitiated');
      try {
        const pioneerAuth: AuthResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        console.log('Pioneer Auth:', pioneerAuth);
        const res = await axiosClient.post("/users/authenticate", {pioneerAuth});

        if (res.status === 200) {
          console.log('Signup response', res);
          setAuthToken(res.data?.token)
          setCurrentUser(res.data.user);
          toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data?.user?.user_name}`);
        } else if (res.status === 500) {
          setCurrentUser(null);
          toast.error(`${t('HOME.AUTHENTICATION.UNSUCCESSFUL_LOGIN_MESSAGE')}`);
        }        
      } catch (error: any) {
        console.log(error);
        toast.info(t('HOME.AUTHENTICATION.PI_INFORMATION_NOT_FOUND_MESSAGE'));
      }
    } else {
      console.log("PI SDK failed to initialize.");
    }
  };

  const autoLoginUser = async () => {
    try {
      const res = await axiosClient.get('/users/me');

      if (res.status === 200) {
        console.log('Login result from autoSigninUser: ', res.data);
        setCurrentUser(res.data);
        toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data.user_name}`);
      } else {
        setCurrentUser(null);
      }
    } catch (error: any) {
      console.log('Auto login unresolved; attempting Pi SDK authentication', error);
      await registerUser();
    }
  }

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
