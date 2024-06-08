'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CenterMap.css';

const centerIcon = new L.Icon({
  iconUrl: '/images/icons/crosshair.png', // Update this path to your icon's path
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const CenterMarker = () => {
  const map = useMapEvents({
    move: () => {
      // No operation needed here for the marker to move
    },
  });

  return null; // We don't need to render anything here as we are using the icon method
};

const CenterMap = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.064192, 19.944544]);
  const [showPopup, setShowPopup] = useState(true);
  const [typedMessage, setTypedMessage] = useState('');
  const [popupDismissed, setPopupDismissed] = useState(false);
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
      alert('Center saved: ' + JSON.stringify([center.lat, center.lng]));
    }
  };

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    map.on('move', () => {
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng]);
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
        <Marker position={mapCenter} icon={centerIcon} />
        <CenterMarker /> {/* CenterMarker must be inside MapContainer */}
      </MapContainer>
      <div className="map-controls__item">
        <button className="map-controls__button" onClick={saveCenterToLocalStorage} role="button" tabIndex={0}>
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
          zIndex: 2000, // Ensure it's on top of the map
        }}
      >
        <img src='/images/icons/crosshair.png' alt='Center Marker' style={{ width: '32px', height: '32px' }} />
      </div>
    </div>
  );
};

export default CenterMap;
