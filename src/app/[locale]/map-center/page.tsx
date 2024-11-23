import dynamic from 'next/dynamic';
import { Suspense } from 'react';

interface MapCenterPageProps {
  searchParams: { entryType?: string };
  params: { locale: string };
}

type EntryType = 'search' | 'sell';

interface MapCenterProps {
  entryType: EntryType;
  locale: string;
}

const MapCenter = (props: MapCenterProps) => {
  const { entryType, locale } = props

  const DynamicMapCenter = dynamic(() => import('@/components/shared/map/MapCenter'), {
    ssr: false,
  });

  return (
    <DynamicMapCenter entryType={entryType} locale={locale} /> /* Pass entryType as a prop with locale */
  );
};

// Must wrap in a Suspense boundary to avoid 500 error on page load
const MapCenterPage = ({ searchParams, params}: MapCenterPageProps) => {
  const { entryType = 'search' } = searchParams;
  const { locale } = params;

  return (
    <Suspense>
      <MapCenter entryType={entryType as EntryType} locale={locale} /> {/* Pass entryType as a prop with locale */}
    </Suspense>
  );
};

export default MapCenterPage;