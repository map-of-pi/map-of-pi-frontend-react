import MapCenter from '@/components/shared/map/MapCenter';
import dynamic from 'next/dynamic';

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
