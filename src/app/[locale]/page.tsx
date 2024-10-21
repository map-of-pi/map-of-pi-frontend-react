'use client';

import L from 'leaflet';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState, useRef } from 'react';

import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import SearchBar from '@/components/shared/SearchBar/SearchBar';
import { fetchSellers } from '@/services/sellerApi';
import { fetchUserLocation } from '@/services/userSettingsApi';

import { AppContext } from '../../../context/AppContextProvider';
import logger from '../../../logger.config.mjs';

export default function Index() {
  const t = useTranslations();
  const DynamicMap = dynamic(() => import('@/components/shared/map/Map'), {
    ssr: false,
  });
  const mapRef = useRef<L.Map | null>(null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(2);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchClicked, setSearchClicked] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { isSigningInUser } = useContext(AppContext);

  // Default map center (example: New York City)
  const defaultMapCenter = { lat: 20, lng: -74.006 };

  useEffect(() => {
    const fetchLocationOnLoad = async () => {
      try {
        const location = await fetchUserLocation();
        setMapCenter(location.origin);
        setZoomLevel(location.radius);
        logger.info('User location obtained successfully on initial load:', {
          location,
        });
      } catch (error) {
        logger.error('Error getting location on initial load.', { error });
        setMapCenter(defaultMapCenter);
        setZoomLevel(2);
      }
    };

    fetchLocationOnLoad();
  }, [isSigningInUser]);

  const handleLocationButtonClick = async () => {
    try {
      const location = await fetchUserLocation();
      setMapCenter(location.origin);
      setZoomLevel(location.radius);
      setLocationError(null);
      logger.info('User location obtained successfully on button click:', {
        location,
      });
    } catch (error) {
      logger.error('Error getting location on button click.', { error });
      setLocationError(
        t('HOME.LOCATION_SERVICES.ENABLE_LOCATION_SERVICES_MESSAGE'),
      );
    }
  };

  // handle search query update from SearchBar and associated results
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearchClicked(true);

    // Fetch sellers based on current map bounds and search query
    try {
      const mapInstance = mapRef.current;
      if (mapInstance) {
        const bounds = mapInstance.getBounds();
        const results = await fetchSellers(bounds, query); // Use API to fetch sellers
        setSearchResults(results || []); // Update searchResults
      }
    } catch (error) {
      logger.error('Failed to fetch sellers for search query.', { error });
    }
  };

  return (
    <>
      <DynamicMap
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoomLevel}
        mapRef={mapRef}
        searchQuery={searchQuery}
        isSearchClicked={isSearchClicked}
        searchResults={searchResults || []}
      />
      <SearchBar page={'default'} onSearch={handleSearch} />
      <div className="absolute bottom-8 z-10   right-0 left-0 m-auto pointer-events-none">
        <div className="w-[90%] lg:w-full lg:px-6 mx-auto flex items-center justify-between">
          {/* Add Seller Button */}
          <div className="pointer-events-auto">
            <Link href="/seller/registration">
              <Button
                label={'+ ' + t('HOME.ADD_SELLER')}
                styles={{
                  height: '55px',
                  fontSize: '20px',
                  borderRadius: '10px',
                  color: '#ffc153',
                  paddingLeft: '45px',
                  paddingRight: '45px',
                }}
                disabled={isSigningInUser}
              />
            </Link>
          </div>
          {/* Location Button */}
          <div className="pointer-events-auto">
            <Button
              icon={
                <Image
                  src="/images/shared/my_location.png"
                  width={40}
                  height={40}
                  alt="my location"
                />
              }
              styles={{
                borderRadius: '50%',
                width: '55px',
                height: '55px',
                padding: '0px',
              }}
              onClick={handleLocationButtonClick}
              disabled={isSigningInUser}
            />
          </div>
        </div>
      </div>
    </>
  );
}
