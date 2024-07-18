"use client";

import 'react-toastify/dist/ReactToastify.css';

import {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
} from 'react';
import { toast } from 'react-toastify';

import { Pi } from '@pinetwork-js/sdk';

import axiosClient from '@/config/client';
import { autoSigninUser, onIncompletePaymentFound, PiAuthentication } from '@/util/auth';
import { IUser } from '@/constants/types';

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
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const registerUser = async () => {
    const isInitiated= await Pi.initialized;
    if (isInitiated) {  
      try {
        const pioneerAuth = await Pi.authenticate(['username'], onIncompletePaymentFound);
        
        const authResult = await PiAuthentication(pioneerAuth.accessToken);
        console.log('Authenticated Pioneer ID: ', authResult.username);
        const user = {
          username: authResult.username,
          uid: authResult.uid
        }
        const res = await axiosClient.post("/users/authenticate", {user}) 
        console.log('signup response', res);
        localStorage.setItem("mapOfPiToken", res.data?.token);
        setCurrentUser(res.data);
        toast.success(`Logged in successfully as ${res.data?.user?.username}`);
      
      } catch (error: any) {
        console.log(error)
        toast.info("Pioneer data not found");
      }

    } else {
      console.log("PI SDK failed to initialize.");
      
    }
  };

  const autoLoginUser = async () => {
    try {
      const data = await autoSigninUser() 
      setCurrentUser(data)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
