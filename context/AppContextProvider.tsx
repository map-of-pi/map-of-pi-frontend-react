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
import { onIncompletePaymentFound, PiAuthentication } from '@/util/auth';
import { IUser } from '@/constants/types';
import { error } from 'console';

interface IAppContextProps {
  currentUser: string | null;
  setCurrentUser: React.Dispatch<SetStateAction<string | null>>;
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
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const registerUser = async () => {
    const isInitiated= await Pi.initialized;

    if (isInitiated) {  
      try {
        // localStorage.removeItem("mapOfPiToken");
        const pioneerAuth = await Pi.authenticate(['username'], onIncompletePaymentFound);
        
        const authResult = await PiAuthentication(pioneerAuth.accessToken);
        console.log('Authenticated Pioneer ID: ', authResult.username);
        const user: IUser = {
          pi_username: authResult.username,
          pi_uid: authResult.uid,
          user_name: authResult.username,
        }
        const res = await axiosClient.post("/users/authenticate", {user}) 

        if (res.status===200){
          console.log('Signup response', res);
          setAuthToken(res.data?.token)
          // localStorage.setItem("mapOfPiToken", res.data?.token);
          setCurrentUser(res.data.username);
          toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data.username}`);
          // window.alert(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data?.user_name}`);

        }else if(res.status===500){
          setCurrentUser(null);
          toast.error(`user authentication failed: ${res.data.message}`)
        }        
      
      } catch (error: any) {
        console.log(error);
        toast.info(t('HOME.AUTHENTICATION.PI_INFORMATION_NOT_FOUND_MESSAGE'));
        // window.alert(t('HOME.AUTHENTICATION.PI_INFORMATION_NOT_FOUND_MESSAGE'));
      }

    } else {
      console.log("PI SDK failed to initialize.");
    }
  };

  const autoLoginUser = async () => {
    try {
      const res = await axiosClient.get('/users/me');

      if (res.status===200){
        console.log('Login result from autoSigninUser: ', res.data);
        setCurrentUser(res.data);
        toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data}`);
      }

    } catch (error: any) {
      console.log('something is wrong with login', error);
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
