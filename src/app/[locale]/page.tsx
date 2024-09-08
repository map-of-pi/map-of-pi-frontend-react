'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import SearchBar from '@/components/shared/SearchBar/SearchBar';

import logger from '../../../logger.config.mjs';

const getDeviceLocation = async (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export default function Index() {
  const t = useTranslations();
  const DynamicMap = dynamic(() => import('@/components/shared/map/Map'), { ssr: false });

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Default map center (example: New York City)
  const defaultMapCenter = { lat: 20, lng: -74.0060 };

  useEffect(() => {
    const fetchLocationOnLoad = async () => {
      try {
        const location = await getDeviceLocation();
        setMapCenter(location);
        setZoomLevel(13);
        logger.info('User location obtained successfully on initial load:', { location });
      } catch (error) {
        logger.error('Error getting location on initial load.', { error });
        setMapCenter(defaultMapCenter);
        setZoomLevel(2);
      }
    };

    fetchLocationOnLoad();
  }, []);

  const handleLocationButtonClick = async () => {
    try {
      const location = await getDeviceLocation();
      setMapCenter(location);
      setZoomLevel(15);
      setLocationError(null);
      logger.info('User location obtained successfully on button click:', { location });
    } catch (error) {
      logger.error('Error getting location on button click.', { error });
      setLocationError(t('HOME.LOCATION_SERVICES.ENABLE_LOCATION_SERVICES_MESSAGE'));
    }
  };

  return (
    <>
      <DynamicMap center={[mapCenter.lat, mapCenter.lng]} zoom={zoomLevel} />
      <SearchBar page={'default'} />
      <div className="absolute bottom-8 z-10 flex justify-between gap-[22px] px-6 right-0 left-0 m-auto">
        <Link href="/seller/registration">
          <Button
            label={"+ " + t('HOME.ADD_SELLER')}
            styles={{ borderRadius: '10px', color: '#ffc153', paddingLeft: '50px', paddingRight: '50px' }}
          />
        </Link>
        <Button
          icon={<Image src='/images/shared/my_location.png' width={30} height={30} alt='my location' />}
          styles={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0px' }}
          onClick={handleLocationButtonClick}
        />
      </div>
    </>
  );
}
