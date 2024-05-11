'use client';

import dynamic from 'next/dynamic';
import SearchBar from '@/components/shared/SearchBar/SearchBar';

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
      <SearchBar />
    </>
  );
}
