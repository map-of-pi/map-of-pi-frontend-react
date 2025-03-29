'use client';

import L from 'leaflet';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState, useRef, ChangeEvent } from 'react';

import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import SearchBar from '@/components/mui/input/SearchBar';
import ConfirmDialog from '@/components/shared/confirm';
import { fetchSellers } from '@/services/sellerApi';
import { fetchUserSettings } from '@/services/userSettingsApi';
import { DeviceLocationType, IUserSettings } from '@/constants/types';
import { checkAndAutoLoginUser } from '@/utils/auth';
import { userLocation } from '@/utils/geolocation';

import { AppContext } from '../../../context/AppContextProvider';
import logger from '../../../logger.config.mjs';
import FullScreenLoading from '@/components/mui/loading/FullScreenLoading';

export default function Page({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const { locale } = params;
  const DynamicMap = dynamic(() => import('@/components/shared/map/Map'), {
    ssr: false,
  });
  const mapRef = useRef<L.Map | null>(null);

  // State management with proper typing
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [findme, setFindme] = useState<DeviceLocationType>(DeviceLocationType.SearchCenter);
  const [dbUserSettings, setDbUserSettings] = useState<IUserSettings | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchClicked, setSearchClicked] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { isSigningInUser, currentUser, autoLoginUser, reload, setReload } = useContext(AppContext);

  useEffect(() => {
    // clear previous map state when findme option is changed
    if (reload) {
      sessionStorage.removeItem('prevMapCenter');
      sessionStorage.removeItem('prevMapZoom');
    }
    setReload(false);
    setShowPopup(false);
    checkAndAutoLoginUser(currentUser, autoLoginUser);

    const getUserSettingsData = async () => {
      try {
        const data = await fetchUserSettings();
        if (data) {
          logger.info('Fetched user settings data successfully:', { data });
          setDbUserSettings(data);
          if (data.search_map_center?.coordinates) {
            const coordinates = {
              lat: data.search_map_center.coordinates[1],
              lng: data.search_map_center.coordinates[0],
            };
            setSearchCenter(coordinates);
            if (coordinates.lat === 0 && coordinates.lng === 0) {
              setShowPopup(true);
            }
          }
        } else {
          logger.warn('User Settings not found.');
          setDbUserSettings(null);
          setSearchCenter(null);
        }
      } catch (error) {
        logger.error('Error fetching user settings data:', error);
      }
    };

    getUserSettingsData();
  }, [currentUser, reload]);

  useEffect(() => {
    const resolveLocation = async () => {
      if (dbUserSettings && dbUserSettings.findme !== DeviceLocationType.SearchCenter) {
        const loc = await userLocation(dbUserSettings);
        if (loc) {
          setSearchCenter({ lat: loc[0], lng: loc[1] });
        } else {
          setSearchCenter(null);
        }
      }
    };
    resolveLocation();
  }, [dbUserSettings]);

  const handleLocationButtonClick = async () => {
    // clear previous map state when findme option is changed
    sessionStorage.removeItem('prevMapCenter');
    sessionStorage.removeItem('prevMapZoom');
    if (dbUserSettings) {
      const loc = await userLocation(dbUserSettings);
      if (loc) {
        setSearchCenter({ lat: loc[0], lng: loc[1] });
        logger.info('User location obtained successfully on button click:', { location });
      } else{
        setSearchCenter(null);
      }
    }
  };

  // Handle search query update from SearchBar and associated results
  const handleSearch = async (query: string) => {
    if (query) {
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
        logger.error('Failed to fetch sellers for search query.', error);
      }
    }
  };

  return (
    <>
      {isSigningInUser && <FullScreenLoading />}
      <DynamicMap
        center={searchCenter}
        zoom={zoomLevel}
        mapRef={mapRef}
        searchQuery={searchQuery}
        isSearchClicked={isSearchClicked}
        searchResults={searchResults || []}
      />
      <SearchBar
        page={'default'}
        onSearch={handleSearch}
        setSearchResults={setSearchResults}
        setSearchQuery={setSearchQuery}
        setSearchClicked={setSearchClicked}
        isSearchClicked={isSearchClicked}
        handleLocationButtonClick={handleLocationButtonClick}
      />
    </>
  );
}
