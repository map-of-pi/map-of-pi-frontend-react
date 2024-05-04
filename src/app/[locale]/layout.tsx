import { NextIntlClientProvider, useMessages } from 'next-intl';
import Navbar from '@/components/navbar/Navbar';
import '../global.css';
import { Providers } from '../providers';
import { Roboto } from 'next/font/google';


const roboto = Roboto({weight: '400', subsets: ['latin']})

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Receive messages provided in `i18n.ts`
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={`bg-white dark:bgwhite text-black dark:text-black ${roboto.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
