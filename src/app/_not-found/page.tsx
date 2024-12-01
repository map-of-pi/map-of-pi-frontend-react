'use client';

import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div>
      <h1>404 | {t('ERROR.PAGE_NOT_FOUND_HEADER')}</h1>
      <p>{t('ERROR.PAGE_NOT_FOUND_MESSAGE')}</p>
    </div>
  );
}