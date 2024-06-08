'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CenterMap.css';

// Define the crosshair icon for the center of the map
const crosshairIcon = new L.Icon({
  iconUrl: '/images/icons/crosshair.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Define the pin icon for the saved location
const pinIcon = new L.Icon({
  iconUrl: '/images/icons/map_of_pi_logo.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const CenterMarker = ({ position }) => {
  return <Marker position={position} icon={pinIcon} />;
};

const CenterMap = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.064192, 19.944544]);
  const [showPopup, setShowPopup] = useState(true);
  const [typedMessage, setTypedMessage] = useState('');
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      typeText('Welcome to the Map Center!', 40);
    }
  }, []);

  const saveCenterToLocalStorage = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      localStorage.setItem('mapCenter', JSON.stringify([center.lat, center.lng]));
      console.log('Center saved: ' + JSON.stringify([center.lat, center.lng]));
      setIsButtonDisabled(true); // Grey out the Save button
      setMarkerPosition([center.lat, center.lng]); // Drop pin at the center
    }
  };

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng]);
      setIsButtonDisabled(false); // Enable the Save button on move
      setMarkerPosition(null); // Remove the dropped pin
    });
  };

  const typeText = (text: string, speed: number) => {
    let i = 0;
    setTypedMessage('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypedMessage((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenReady={(event) => handleMapReady(event.target)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='Map data © OpenStreetMap contributors'
        />
        {markerPosition && <CenterMarker position={markerPosition} />}
      </MapContainer>
      <div className="map-controls__item">
        <button
          className="map-controls__button"
          onClick={saveCenterToLocalStorage}
          role="button"
          tabIndex={0}
          disabled={isButtonDisabled}
        >
          Save Center
        </button>
      </div>
      {showPopup && (
        <section
          className="popup-message"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="popupMessageTitle"
          tabIndex={0}
        >
          <figure className="popup-message__logo">
            <figcaption className="visually-hidden">App Name</figcaption>
          </figure>
          <div id="popupMessageTitle">
            <h2 className="popup-message__title">Welcome Message</h2>
            <p className="popup-message__typed-message">{typedMessage}</p>
          </div>
          <button
            onClick={closePopup}
            className="popup-message__button--confirm"
            aria-label="Close popup"
          >
            Got it
          </button>
        </section>
      )}
      <div
        className="crosshair-icon"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 2000,
        }}
      >
        <img src='/images/icons/crosshair.png' alt='Center Marker' style={{ width: '32px', height: '32px' }} />
      </div>
    </div>
  );
};

export default CenterMap;
