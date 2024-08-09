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

// Define the crosshair icon for the center of the map
const crosshairIcon = new L.Icon({
  iconUrl: '/images/icons/crosshair.png',
  iconSize: [80, 80],
  iconAnchor: [40, 40],
});

// Define the pin icon for the saved location
const pinIcon = new L.Icon({
  iconUrl: '/images/icons/map_of_pi_logo.jpeg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
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
          }
        } catch (error) {
          console.error('Error fetching map center:', error);
        }
      }
    };
    getMapCenter();
  }, [currentUser]);

  const CenterMarker = () => {
    const map = useMapEvents({
      moveend() {
        setCenter(map.getCenter());
      },
      load() {
        setCenter(map.getCenter());
      },
    });

    return center ? (
      <Marker position={center} icon={crosshairIcon}></Marker>
    ) : null;
  };

  const handleSetCenter = async () => {
    if (center !== null && currentUser?.pi_uid) {
      console.log(center);
      localStorage.setItem('mapCenter', JSON.stringify([center.lat, center.lng]));

      try {
        const response = await saveMapCenter(center.lat, center.lng);
        console.log('Map center saved successfully', response);
        setShowPopup(true);
      } catch (error) {
        console.error('Error saving map center:', error);
      }
    } else {
      console.log('Center or currentUser.pi_uid is null');
    }
  };

  const handleClickDialog = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <MapContainer
        zoomControl={false}
        center={center}
        zoom={13}
        className="w-full flex-1 fixed top-[76.19px] h-[calc(100vh-76.19px)] left-0 right-0 bottom-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data © OpenStreetMap contributors"
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
