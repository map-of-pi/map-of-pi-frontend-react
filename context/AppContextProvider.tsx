'use client';

import 'react-toastify/dist/ReactToastify.css';
import { useTranslations } from 'next-intl';
import { createContext, useState, ReactNode, useEffect, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { Pi } from '@pinetwork-js/sdk';
import axiosClient, { setAuthToken } from '@/config/client';
import { autoSigninUser, onIncompletePaymentFound, PiAuthentication } from '@/util/auth';
import { IUser } from '@/constants/types';

interface IAppContextProps {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<SetStateAction<IUser | null>>;
  registerUser: () => void;
  autoLoginUser: () => void;
}

const initialState: IAppContextProps = {
  currentUser: null,
  setCurrentUser: () => {},
  registerUser: () => {},
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
    try {
      console.log("Starting Pi SDK initialization...");

      const isSandbox = process.env.NODE_ENV === 'development' || process.env.PI_SANDBOX === 'true';

      await Pi.init({ 
        version: '2.0', 
        sandbox: isSandbox 
      });

      console.log('Environment:', process.env.NODE_ENV);
      console.log('Pi SDK initialized in sandbox mode:', isSandbox);

      // Adding a delay to ensure SDK is fully initialized and ready to communicate
      setTimeout(async () => {
        if (Pi.initialized) {
          console.log("SDK is initialized and ready to authenticate.");

          const pioneerAuth = await Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
          console.log("Authentication successful:", pioneerAuth);

          if (pioneerAuth && pioneerAuth.user && pioneerAuth.user.uid) {

            console.log("Sending user data to backend for authentication");
            const res = await axiosClient.post("/users/authenticate_",);
            console.log('Backend authentication response: ', res);

            if (res.status === 200 && res.data?.token) {
              const token = res.data?.token;
              console.log("Token received:", token);
              localStorage.setItem('authToken', token); // Store token in localStorage
              setAuthToken(token); // Set token for Axios requests
              console.log("Token set in Axios:", axiosClient.defaults.headers.common['Authorization']);
              setCurrentUser({ ...res.data.user, token: res.data.token }); // Ensure token is included
              toast.success(`${t('HOME.AUTHENTICATION.SUCCESSFUL_LOGIN_MESSAGE')}: ${res.data?.user?.user_name}`);
            } else {
              setCurrentUser(null);
              console.warn("No token received from backend or response not 200.");
              toast.error(`${t('HOME.AUTHENTICATION.UNSUCCESSFUL_LOGIN_MESSAGE')}`);
            }
          } else {
            console.error("Pi SDK authentication did not return valid user data.");
            toast.error("Failed to authenticate with Pi SDK.");
          }
        } else {
          console.error("Pi SDK is not fully initialized, retrying...");
          setTimeout(registerUser, 1000); // Retry after a short delay if not initialized
        }
      }, 1000); // 1-second delay before attempting to authenticate
    } catch (error: any) {
      console.error('Error during Pi SDK initialization:', error);
      toast.info(t('HOME.AUTHENTICATION.PI_INFORMATION_NOT_FOUND_MESSAGE'));
    }
  };

  const autoLoginUser = async () => {
    console.log("Attempting to auto-login user");
    try {
      const data = await autoSigninUser();
      console.log('Login response: ', data);
      setCurrentUser(data);
    } catch (error: any) {
      console.error("Auto-login failed, attempting registration:", error);
      await registerUser();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (token) {
      console.log("Token found in localStorage, setting Authorization header.");
      setAuthToken(token); // Set token for Axios requests
      autoLoginUser(); // Attempt auto-login using the token
    } else {
      console.log("No token found, triggering user registration.");
      registerUser(); // No token found, trigger registration
    }
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, registerUser, autoLoginUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
