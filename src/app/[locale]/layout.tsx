import { NextIntlClientProvider, useMessages } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Lato } from 'next/font/google';

import { locales } from '@/i18n';

import { Providers } from '../providers';

import Navbar from '@/components/shared/navbar/Navbar';
import logger from '../../../logger.config.mjs';

export const dynamic = 'force-dynamic';

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'swap' });

export async function generateStaticParams() {
  return locales.map((locale) => { locale })
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);

  // Receive messages provided in `i18n.ts`
  const messages = useMessages();

  // log the locale and messages loading
  logger.info(`Rendering LocaleLayout for locale: ${locale}`);
  if (messages) {
    logger.info('Messages loaded successfully.');
  } else {
    logger.warn('No messages found for the given locale.');
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <title>Map of Pi</title>
        <base href="/" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          property="og:title"
          content="Map of Pi, Searchable places accepting Pi on a map"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mapofpi.concretecode.ch" />
        <meta
          property="og:image"
          content="https://mapofpi.concretecode.ch/assets/images/logo.svg"
        />
        <meta
          name="description"
          content="Map of Pi is a mobile application developed to help Pi community members easily locate local businesses that accept Pi as payment"
        />
        <meta name="keywords" content="map, pi, business, app" />
        <meta name="author" content="Map of Pi Team" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="font-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/https://fonts.gstatic.com/;"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SVNC88Q13K"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SVNC88Q13K');
          `,
        }} />
      </head>
      <body
        className={`bg-background text-black ${lato.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Navbar />
            <div className='pt-[80px]'>{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
