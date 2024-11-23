import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { localePrefix } from './navigation';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection: false // Remove the NEXT_LOCALE "Set-Cookie" header for CDN caching purposes
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)',
  ],
};