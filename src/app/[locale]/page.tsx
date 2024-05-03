import { useTranslations } from 'next-intl';

export default function Index(
  {
    // params: { locale },
  }: {
    params: { locale: string };
  },
) {
  const t = useTranslations('CORE');
  return (
    <>
      <h1>{t('APP_NAME')}</h1>
    </>
  );
}
