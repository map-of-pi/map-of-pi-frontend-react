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
        const pioneerAuth = await Pi.authenticate(['username'], onIncompletePaymentFound) // obtain pioneer access token from sandbox
        
        const authResult = await PiAuthentication(pioneerAuth.accessToken);
        // Extract username and uid of the pi user
        const user: IUser = {
          pi_username: authResult.username,
          pi_uid: authResult.uid,
          user_name: authResult.username,
        }
        const res = await axiosClient.post("/users/authenticate", {user}) 
        console.log('Signup response', res);
        localStorage.setItem("mapOfPiToken", res.data?.token);
        setCurrentUser(res.data.user);
        toast.success(res.data?.user?.user_name);
      
      } catch (error: any) {
        console.log(error)
        toast.info("can not find pioneer info");
      }

    } else {
      console.log("PI SDK failed to initialize.");
      
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
    <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
