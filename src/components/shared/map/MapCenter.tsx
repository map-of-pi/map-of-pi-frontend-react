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
import { ConfirmDialogX } from '../confirm';
import RecenterAutomatically from './RecenterAutomatically';
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
  const t = useTranslations(); // Hook for internationalization
  const [showPopup, setShowPopup] = useState(false); // State for controlling the visibility of the confirmation popup
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 50.064192, lng: 19.944544 }); // State for storing the map center coordinates
  const { currentUser } = useContext(AppContext); // Get the current user from context

  // Effect to handle user authentication state
  useEffect(() => {
    if (!currentUser) {
      console.log("User is not logged in, redirecting or triggering login...");
      // Implement login or redirect logic here if needed
    } else {
      console.log("User is logged in:", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadMapCenter = async () => {
      if (currentUser) {
        const mapCenter = await fetchMapCenter();
        logger.info("Fetched map center:", mapCenter);
        if (mapCenter && mapCenter.latitude !== undefined && mapCenter.longitude !== undefined) {
          setCenter({ lat: mapCenter.latitude, lng: mapCenter.longitude });
          logger.info(`Map center set to latitude: ${mapCenter.latitude}, longitude: ${mapCenter.longitude}`);
        } else {
          logger.warn("Map center is undefined, falling back to default coordinates");
          setCenter({ lat: 50.064192, lng: 19.944544 }); // Default coordinates
        }
      }
    };
  
    loadMapCenter();
  }, [currentUser]);
  
  // Component to handle map events and update the center state
  const CenterMarker = () => {
    const map = useMapEvents({
      moveend() {
        setCenter(map.getCenter()); // Update center state when the map stops moving
      },
      load() {
        setCenter(map.getCenter()); // Set initial center when the map loads
      },
    });

    return center ? (
      <Marker position={center} icon={crosshairIcon}></Marker>
    ) : null;
  };

  // Function to save the map center directly to the backend
  const handleSetCenter = async () => {
    if (center !== null && currentUser?.pi_uid) {
      console.log(center); // Log the center coordinates for debugging

      try {
        const response = await saveMapCenter(center.lat, center.lng); // Save the map center to the backend
        console.log('Map center saved successfully', response); // Log success response
        setShowPopup(true); // Show the confirmation popup
      } catch (error) {
        console.error('Error saving map center:', error); // Log any errors during the save process
      }
    } else {
      console.log('User not authenticated or center coordinates are null'); // Handle the case where the user is not authenticated or coordinates are null
    }
  };

  // Function to handle the closing of the confirmation popup
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
        <CenterMarker /> {/* Renders the crosshair marker at the map's center */}
        <RecenterAutomatically position={center} /> {/* Component to handle automatic recentering */}
      </MapContainer>
      <div className="absolute bottom-8 z-10 flex justify-center px-6 right-0 left-0 m-auto">
        <Button
          label="Set Map Center"
          onClick={handleSetCenter} // Handles saving the map center when the button is clicked
          styles={{
            borderRadius: '10px',
            color: '#ffc153',
            paddingLeft: '50px',
            paddingRight: '50px',
          }}
        />
      </div>
      {showPopup && (
        <ConfirmDialogX
          message={t('SHARED.MAP_CENTER.VALIDATION.SEARCH_CENTER_SUCCESS_MESSAGE')}
          toggle={() => setShowPopup(false)}
          handleClicked={handleClickDialog} // Handles closing the confirmation popup
        />
      )}
    </div>
  );
};

export default MapCenter;