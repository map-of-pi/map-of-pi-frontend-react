"use client"

import './global.css';

import { ReactNode, useEffect } from 'react';

import { Pi } from '@pinetwork-js/sdk';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  useEffect(() => {
    Pi.init({
      version: "2.0",
      sandbox: true
    });
  });
  return children;
}
