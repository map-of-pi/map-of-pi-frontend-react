"use client"

import './global.css';
import { ReactNode } from 'react';
import '../../sentry.client.config.mjs';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
