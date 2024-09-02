
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
} from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../Forms/Buttons/Buttons';
import { ConfirmDialogX } from '../confirm';
import RecenterAutomatically from './RecenterAutomatically';
import { saveMapCenter, fetchMapCenter } from '@/services/mapCenterApi';
import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';
import SearchBar from '../SearchBar/SearchBar'; 
import 'leaflet-control-geocoder';


// Define the crosshair icon for the center of the map
const crosshairIcon = new L.Icon({
  iconUrl: '/images/icons/crosshair.png',
  iconSize: [80, 80],
  iconAnchor: [40, 40],
});

const MapCenter = () => {
  const t = useTranslations();

  const [showPopup, setShowPopup] = useState(false); // State for controlling the visibility of the confirmation popup
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 50.064192, lng: 19.944544 });
  const { currentUser, autoLoginUser } = useContext(AppContext);
  const mapRef = useRef<L.Map | null>(null); // Reference to the map instance

  useEffect(() => {
    if (!currentUser) {
      logger.info("User not logged in; attempting auto-login..");
      autoLoginUser();
    }

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

  // Handle search query to update map center and zoom level
  const handleSearch = async (query: string) => {
    try {
      const geocoder = new (L.Control as any).Geocoder.nominatim();  // Initialize the Geocoder
      geocoder.geocode(query, (results: any) => {
        if (results.length > 0) {
          const { center: resultCenter } = results[0];
          setCenter({ lat: resultCenter.lat, lng: resultCenter.lng });  // Update map center
          if (mapRef.current) {
            mapRef.current.setView([resultCenter.lat, resultCenter.lng], 13);  // Set the view and zoom level
            logger.info(`Map center updated and zoomed to: ${resultCenter.lat}, ${resultCenter.lng}`);
          } else {
            logger.warn('Map reference is not set.');
          }
        } else {
          logger.warn(`No result found for the query: ${query}`);
        }
      });
    } catch (error) {
      logger.error('Error during geocoding:', error);
    }
  };

  // Component to handle map events and update the center state
  const CenterMarker = () => {
    const map = useMapEvents({
      moveend() {
        setCenter(map.getCenter()); // Update center state when the map stops moving
      },
      load() {
        setCenter(map.getCenter()); // Set initial center when the map loads
        mapRef.current = map; // Assign the map instance to the ref
      },
    });

    return center ? (
      <Marker position={center} icon={crosshairIcon}></Marker>
    ) : null;
  };

  // Function to save the map center directly to the backend
  const setMapCenter = async () => {
    if (center !== null && currentUser?.pi_uid) {
      logger.info('Setting map center to:', { center });
      try {
        const response = await saveMapCenter(center.lat, center.lng);
        logger.info('Map center saved successfully:', { response });
        setShowPopup(true);
      } catch (error) {
        logger.error('Error saving map center:', { error });
      }
    } else {
      logger.warn('User not authenticated or center coordinates are null'); // Handle the case where the user is not authenticated or coordinates are null
    }
  };

  // Function to handle the closing of the confirmation popup
  const handleClickDialog = () => {
    setShowPopup(false);
  };

  // define map boundaries
  const bounds = L.latLngBounds(
    L.latLng(-90, -180), // SW corner
    L.latLng(90, 180)  // NE corner
  );

  return (
    <div className="search-container">
    <p className="search-text">{t('SHARED.MAP_CENTER.SEARCH_BAR_PLACEHOLDER')}</p>
    <SearchBar 
      onSearch={handleSearch}
      placeholder={t('SHARED.MAP_CENTER.SEARCH_BAR_PLACEHOLDER')} 
    />
          <MapContainer
          center={center}
          zoom={2}
          zoomControl={false}
          minZoom={2}
          maxZoom={18}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          className="w-full flex-1 fixed top-[76.19px] h-[calc(100vh-76.19px)] left-0 right-0 bottom-0"
          whenCreated={(mapInstance: L.Map) => {
            mapRef.current = mapInstance;  // Correctly set the map reference when the map is created
          }}
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
          onClick={setMapCenter}
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
          toggle={() => setShowPopup(false)}
          handleClicked={handleClickDialog} // Handles closing the confirmation popup
          message={t('SHARED.MAP_CENTER.VALIDATION.SEARCH_CENTER_SUCCESS_MESSAGE')}
        />
      )}
    </div>
  );
};

export default MapCenter;
