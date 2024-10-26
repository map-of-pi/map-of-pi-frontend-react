import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = [
  'en',
  'en-GB',
  'es',
  'ar',
  'ko',
  'hau-NG',
  'ewe-BJ'
] as const;
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
