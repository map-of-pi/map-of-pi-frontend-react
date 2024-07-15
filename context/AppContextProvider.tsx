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
import { autoSigninUser, onIncompletePaymentFound } from '@/util/auth';
import { IUser } from '@/constants/types';

interface IAppContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<SetStateAction<IUser | null>>;
  loginUser: () => void;
  autoLoginUser:()=> void,
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  loginUser: () => { },
  autoLoginUser:()=> {},
};

export const AppContext = createContext<IAppContextProps>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const loginUser = async () => {
    const isInitiated= await Pi.initialized
    try {
      if (isInitiated) {
        const authResult = await Pi.authenticate(["payments", "username"], onIncompletePaymentFound)
        console.log('auth result', authResult)

        // Extract username and uid of the pi user
        const auth = {
          username: authResult.user.username,
          uid: authResult.user.uid
        }
        const res = await axiosClient.post("/users/authenticate", {auth}) 
        console.log('login response', res) 
        toast.success(res.data?.user?.username)
        setCurrentUser(res.data)
        localStorage.setItem("token", res.data?.token)
      } else {
        console.log("PI SDK failed to initialize.");
        toast.info("can not find pioneer info");
      }
    } catch (error: any) {
      console.log(error)
    }
  };

  const autoLoginUser = async () => {
    try {
      const data = await autoSigninUser()
      console.log('login response', data) 
      setCurrentUser(data)
      // toast.success(data.user.username)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, loginUser, autoLoginUser}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
