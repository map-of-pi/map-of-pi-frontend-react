import { NextIntlClientProvider, useMessages } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Lato } from 'next/font/google';
import { locales } from '../../../i18n/i18n';
import { Providers } from '../providers';
import Navbar from '@/components/shared/navbar/Navbar';
import logger from '../../../logger.config.mjs';

export const dynamic = 'force-dynamic';

const lato = Lato({ weight: '400', subsets: ['latin'], display: 'swap' });

export async function generateStaticParams() {
  return locales.map((loc:any) => ({ locale: loc }));
}

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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <Navbar />
        <div className={`pt-[80px] bg-background text-black ${lato.className}`}>
          {children}
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}