
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {
  createContext,
  useState,
  SetStateAction,
  ReactNode,
} from 'react';
import { Pi } from '@pinetwork-js/sdk';
import axios from "axios"
import { autoSigninUser, onIncompletePaymentFound } from '@/libs/auth';
import axiosClient from '@/config/client';

interface IUser {
  username: string;
  _id: string;
}

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
        const authResult = await Pi.authenticate(["payments", "username", "wallet_address"], onIncompletePaymentFound)

        const res = await axiosClient.post("/api/v1/users/authenticate", {authResult})  
        toast.success(res.data?.user?.username)

        setCurrentUser(res.data?.user)
        localStorage.setItem("token", res.data?.token)
      } else {
        console.log("u are trying to authenticater user while pi sdk is not fully initialized")
      }
      
    } catch (error: any) {
      console.log("error in call ---> : " + error)
      
    }
  };

  const autoLoginUser = async () => {
    try {
      const res = await autoSigninUser()
        setCurrentUser(res.data?.currentUser)

      // console.log("user--> : ",res.data?.currentUser)
      // un comment thsi to see if backend is retriving user
    } catch (error: any) {
      
      console.log(error)
      
    }
  }

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, loginUser ,autoLoginUser}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
