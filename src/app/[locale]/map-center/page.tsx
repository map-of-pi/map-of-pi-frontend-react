import dynamic from 'next/dynamic';

import MapCenter from '@/components/shared/map/MapCenter';

const MapCenterPage = () => {

  const MapCenter = dynamic(() => import('@/components/shared/map/MapCenter'), {
    ssr: false,
  })

  return (
    <>
      <MapCenter />
    </>
  );
};

export default MapCenterPage;
