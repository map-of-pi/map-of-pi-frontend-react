import './global.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import '../../sentry.client.config.mjs';

export const dynamic = 'force-dynamic';

type Props = {
  children: ReactNode;
  params?: { locale?: string };
};

export default async function RootLayout({ children, params = { locale: 'en' } }: Props) {
  const locale = params.locale || 'en';

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../messages/en.json`)).default;
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
