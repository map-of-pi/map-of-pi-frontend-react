'use client';

import dynamic from 'next/dynamic';

export default function Index(
  {
  }: {
    params: { locale: string };
  },
) {
  const DynamicMap = dynamic(() => import('../../components/shared/map/Map'), {
    ssr: false,
  });

  return (
    <>
      <DynamicMap />
    </>
  );
}
