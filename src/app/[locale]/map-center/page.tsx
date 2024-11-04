import dynamic from 'next/dynamic';

interface MapCenterPageProps {
  searchParams: { entryType?: string };
  params: { locale: string };
}

const MapCenterPage = ({ searchParams, params}: MapCenterPageProps) => {
  const { entryType = 'search' } = searchParams;
  const { locale } = params;
  // Dynamically import the MapCenter component
  const MapCenter = dynamic(() => import('@/components/shared/map/MapCenter'), {
    ssr: false,
  });

  return (
    <MapCenter entryType={entryType as 'search' | 'sell'} locale={locale} /> /* Pass entryType as a prop with locale */
  );
};

export default MapCenterPage;
