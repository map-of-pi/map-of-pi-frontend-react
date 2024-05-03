import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = [
  'en',
  'es',
  'ko',
  'ng_hau',
  'ng_ibo',
  'ng_yor',
] as const;
export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
