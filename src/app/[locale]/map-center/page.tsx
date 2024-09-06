'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const MapCenterPage = () => {
  const searchParams = useSearchParams();
  const entryType = searchParams.get('entryType'); // Get 'entryType' from URL query params

  // Dynamically import the MapCenter component
  const MapCenter = dynamic(() => import('@/components/shared/map/MapCenter'), {
    ssr: false,
  });

  return (
    <>
      <MapCenter entryType={entryType as 'search' | 'sell'} /> {/* Pass entryType as a prop */}
    </>
  );
};

export default MapCenterPage;
