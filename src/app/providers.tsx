'use client';

import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';

import AppContextProvider from '../../context/AppContextProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableColorScheme={false}>
      <AppContextProvider>
        {children}
        <ToastContainer />
      </AppContextProvider>
    </ThemeProvider>
  );
}
