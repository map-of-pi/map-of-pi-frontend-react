'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const centerIcon = new L.Icon({
  iconUrl: '/images/icons/crosshair.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const CenterMap = () => {
  const [mapCenter, setMapCenter] = useState([50.064192, 19.944544]);
  const [mapInstance, setMapInstance] = useState(null); // State to hold the map instance

  const saveCenterToLocalStorage = () => {
    localStorage.setItem('mapCenter', JSON.stringify(mapCenter));
    alert('Center saved: ' + JSON.stringify(mapCenter));
  };

  const handleMapCreated = (map) => {
    setMapInstance(map); // Save the map instance in state if needed elsewhere
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      whenCreated={handleMapCreated} // Updated to use handleMapCreated
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data © OpenStreetMap contributors'
      />
      <Marker position={mapCenter} icon={centerIcon} />
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button onClick={saveCenterToLocalStorage}>Save Center</button>
      </div>
    </MapContainer>
  );
};

export default CenterMap;
