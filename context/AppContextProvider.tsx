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

interface IUser {
  username: string;
  id: string;
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
        console.log("PI SDK failed to initialize.")
      }
    } catch (error: any) {
      console.log(error)
    }
  };

  const autoLoginUser = async () => {
    try {
      const res = await autoSigninUser()
        setCurrentUser(res.data?.currentUser)
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
