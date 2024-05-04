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
      <h1 className=' text-black dark:text-black'>{t('APP_NAME')}</h1>
    </>
  );
}
