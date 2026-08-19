import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n/i18n';
import { localePrefix } from './navigation';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)'],
};
