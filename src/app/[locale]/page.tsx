import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Index({
    params: {locale}
  }: {
    params: {locale: string};
  }) {


  const t = useTranslations('CORE');
  return (
    <>
      <h1>{t('APP_NAME')}</h1>
    </>
  );
}
