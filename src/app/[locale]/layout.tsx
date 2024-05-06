import Navbar from '@/components/navbar/Navbar';
import SearchBar from '@/components/SearchBar/SearchBar';
import '../global.css';
import { Providers } from '../providers';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className='bg-white dark:bgwhite'>
        {/* <AppWrapper> */}
        <Providers>
          <Navbar />
          {children}
        </Providers>
        {/* </AppWrapper> */}
        <SearchBar />
        
      </body>
    </html>
  );
}
