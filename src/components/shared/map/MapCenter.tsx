'use client';

import 'leaflet/dist/leaflet.css';
import './MapCenter.css';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useContext, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';

import { ConfirmDialogX } from '../confirm';
import { Button } from '../Forms/Buttons/Buttons';
import RecenterAutomatically from './RecenterAutomatically';
import SearchBar from '../SearchBar/SearchBar'; 
import { saveMapCenter, fetchMapCenter } from '@/services/mapCenterApi';

import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

// Define the crosshair icon for the center of the map
const crosshairIcon = new L.Icon({
  iconUrl: '/images/icons/crosshair.png',
  iconSize: [80, 80],
  iconAnchor: [40, 40],
});

const MapCenter = () => {
  const t = useTranslations();
  const [showPopup, setShowPopup] = useState(false);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 50.064192, lng: 19.944544 });
  const { currentUser, autoLoginUser } = useContext(AppContext);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!currentUser) {
      logger.info("User not logged in; attempting auto-login..");
      autoLoginUser();
    }

    // Fetch the map center from the backend if the user is authenticated
    const getMapCenter = async () => {
      if (currentUser?.pi_uid) {
        try {
          const mapCenter = await fetchMapCenter();
          if (mapCenter?.latitude !== undefined && mapCenter.longitude !== undefined) {
            setCenter({ lat: mapCenter.latitude, lng: mapCenter.longitude });
            logger.info(`Map center set to latitude: ${mapCenter.latitude}, longitude: ${mapCenter.longitude}`);
          } else {
            logger.warn("Map center is undefined, falling back to default coordinates");
            setCenter({ lat: 50.064192, lng: 19.944544 });
          }
        } catch (error) {
          logger.error('Error fetching map center:', { error });
        }
      }
    };

    getMapCenter();
  }, [currentUser]);

  // Geocode the query and update the map center
  const handleSearch = async (query: string) => {
    try {
      const geocoder = new (L.Control as any).Geocoder.nominatim();
      geocoder.geocode(query, (results: any) => {
        if (results.length > 0) {
          const { center: resultCenter } = results[0];
          // Check if the new center is different from the current center before setting it
          if (resultCenter.lat !== center.lat || resultCenter.lng !== center.lng) {
            setCenter({ lat: resultCenter.lat, lng: resultCenter.lng });
            if (mapRef.current) {
              mapRef.current.setView([resultCenter.lat, resultCenter.lng], 13);
            }
          }
        } else {
          logger.warn(`No result found for the query: ${query}`);
        }
      });
    } catch (error) {
      logger.error('Error during geocoding:', error);
    }
  };

  // Access the map instance and set initial center without causing an infinite loop
  const MapHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (mapRef.current !== map) {
        mapRef.current = map; // Set map reference only once
        setCenter(map.getCenter()); // Set the center once when the map is ready
        logger.debug('Map instance and reference set on load.');
      }
    }, [map]);

    return null;
  };

  // Component to handle map events without triggering infinite loops
  const CenterMarker = () => {
    useMapEvents({
      moveend() {
        const newCenter = mapRef.current?.getCenter();
        if (newCenter && (newCenter.lat !== center.lat || newCenter.lng !== center.lng)) {
          setCenter(newCenter); // Update center state when the map stops moving
          logger.debug(`Map center updated to: ${newCenter.lat}, ${newCenter.lng}`);
        }
      },
    });

    return center ? <Marker position={center} icon={crosshairIcon}></Marker> : null;
  };

  const setMapCenter = async () => {
    if (center !== null && currentUser?.pi_uid) {
      try {
        await saveMapCenter(center.lat, center.lng);
        setShowPopup(true);
        logger.info('Map center successfully saved.');
      } catch (error) {
        logger.error('Error saving map center:', error);
      }
    }
  };

  const handleClickDialog = () => {
    setShowPopup(false);
  };

  const bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

  return (
    <div className="search-container">
      <p className="search-text">{t('SHARED.MAP_CENTER.SEARCH_BAR_PLACEHOLDER')}</p>
      <SearchBar onSearch={handleSearch} page={'map_center'} />
      <MapContainer
        center={center}
        zoom={2}
        zoomControl={false}
        minZoom={2}
        maxZoom={18}
        // maxBounds={bounds}
        // maxBoundsViscosity={1.0}
        className="w-full flex-1 fixed top-[76.19px] h-[calc(100vh-76.19px)] left-0 right-0 bottom-0"
        whenReady={() => {
          const mapInstance: any = mapRef.current;
          if (mapInstance) {
            logger.info('Map instance set during map container ready state.');
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data © OpenStreetMap contributors"
          noWrap={true}
        />
        <CenterMarker />
        <MapHandler />
        <RecenterAutomatically position={center} />
      </MapContainer>
      <div className="absolute bottom-8 z-10 flex justify-center px-6 right-0 left-0 m-auto">
        <Button
          label="Set Map Center"
          onClick={setMapCenter}
          styles={{ borderRadius: '10px', color: '#ffc153', paddingLeft: '50px', paddingRight: '50px' }}
        />
      </div>
      {showPopup && (
        <ConfirmDialogX
          toggle={() => setShowPopup(false)}
          handleClicked={handleClickDialog}
          message={t('SHARED.MAP_CENTER.VALIDATION.SEARCH_CENTER_SUCCESS_MESSAGE')}
        />
      )}
    </div>
  );
};

export default MapCenter;
