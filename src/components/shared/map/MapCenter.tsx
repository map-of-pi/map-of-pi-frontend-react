'use client';

import 'leaflet/dist/leaflet.css';
import './MapCenter.css';

import { useTranslations } from 'next-intl';

import { useState, useEffect, useContext } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../Forms/Buttons/Buttons';
import RecenterAutomatically from './RecenterAutomatically';
import { ConfirmDialogX } from '../confirm';
import { fetchMapCenter, saveMapCenter } from '@/services/mapCenterApi';

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
  const { currentUser } = useContext(AppContext); // Get currentUser from context

  useEffect(() => {
    const getMapCenter = async () => {
      if (currentUser?.pi_uid) {
        try {
          const mapCenter = await fetchMapCenter();
          if (mapCenter) {
            setCenter({ lat: mapCenter.latitude, lng: mapCenter.longitude });
            logger.info(`Map center set to latitude: ${mapCenter.latitude}, longitude: ${mapCenter.longitude}`);
          }
        } catch (error) {
          logger.error('Error fetching map center:', { error });
        }
      }
    };
    getMapCenter();
  }, [currentUser]);

  const CenterMarker = () => {
    const map = useMapEvents({
      moveend() {
        setCenter(map.getCenter());
        logger.info(`Map center updated to: ${map.getCenter().toString()}`);
      },
      load() {
        setCenter(map.getCenter());
        logger.info(`Map loaded with center: ${map.getCenter().toString()}`);
      },
    });

    return center ? (
      <Marker position={center} icon={crosshairIcon}></Marker>
    ) : null;
  };

  const handleSetCenter = async () => {
    if (center !== null && currentUser?.pi_uid) {
      logger.info('Setting map center to:', { center });
      localStorage.setItem('mapCenter', JSON.stringify([center.lat, center.lng]));

      try {
        const response = await saveMapCenter(center.lat, center.lng);
        logger.info('Map center saved successfully:', { response });
        setShowPopup(true);
      } catch (error) {
        logger.error('Error saving map center:', { error });
      }
    } else {
      logger.warn('Center or PI_UID is null.');
    }
  };

  const handleClickDialog = () => {
    setShowPopup(false);
  };

  // define map boundaries
  const bounds = L.latLngBounds(
    L.latLng(-90, -180), // SW corner
    L.latLng(90, 180)  // NE corner
  );

  return (
    <div>
      <MapContainer
        center={center}
        zoom={2}
        zoomControl={false}
        minZoom={2}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        className="w-full flex-1 fixed top-[76.19px] h-[calc(100vh-76.19px)] left-0 right-0 bottom-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data © OpenStreetMap contributors"
          noWrap={true}
        />
        <CenterMarker />
        <RecenterAutomatically position={center} />
      </MapContainer>
      <div className="absolute bottom-8 z-10 flex justify-center px-6 right-0 left-0 m-auto">
        <Button
          label="Set Map Center"
          onClick={handleSetCenter}
          styles={{
            borderRadius: '10px',
            color: '#ffc153',
            paddingLeft: '50px',
            paddingRight: '50px',
          }}
        />
      </div>
      {showPopup && (
        <ConfirmDialogX message={t('SHARED.MAP_CENTER.VALIDATION.SEARCH_CENTER_SUCCESS_MESSAGE')} toggle={() => setShowPopup(false)} handleClicked={handleClickDialog} />
      )}
    </div>
  );
};

export default MapCenter;
