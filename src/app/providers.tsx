'use client';

import { ThemeProvider } from 'next-themes';

import { Pi } from '@pinetwork-js/sdk';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import AppContextProvider from '../../context/AppContextProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {

    const PiInitiation = async() =>  {
     await Pi.init({
        version: '2.0',
        sandbox: true,
      })
    }

    PiInitiation()

  }, []);
  
  return (
    <ThemeProvider attribute="class" enableColorScheme={false}>
      <AppContextProvider>
        {children}
        <ToastContainer />
      </AppContextProvider>
    </ThemeProvider>
  );
}
