"use client"

import { ReactNode, useEffect } from 'react';
import './global.css';
import { Pi } from '@pinetwork-js/sdk';


type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {

  useEffect(() => {
    Pi.init({
      version: "2.0",
      sandbox: true
    })
  })

  return children;
}

