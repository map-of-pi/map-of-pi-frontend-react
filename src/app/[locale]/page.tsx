'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import SearchBar from '@/components/shared/SearchBar/SearchBar';
import { AppContext } from '../../../context/AppContextProvider';

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
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export default function Index() {
  const t = useTranslations();
  const DynamicMap = dynamic(() => import('@/components/shared/map/Map'), {
    ssr: false,
  });

  const { loginUser, autoLoginUser } = useContext(AppContext);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -1.6279, lng: 29.7451 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      loginUser();
    } else {
      autoLoginUser();
    }
  }, [autoLoginUser, loginUser]);

  const handleLocationButtonClick = async () => {
    try {
      const location = await getDeviceLocation();
      setMapCenter(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
    <>
      <DynamicMap center={[mapCenter.lat, mapCenter.lng]} />
      <SearchBar />
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
