'use client';

import 'leaflet/dist/leaflet.css';
import './MapCenter.css';

import Image from 'next/image';

import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../Forms/Buttons/Buttons';
import RecenterAutomatically from './RecenterAutomatically';
import { ConfirmDialogX } from '../confirm';

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
  const [showPopup, setShowPopup] = useState(false);
  const [center, setCenter] = useState({ lat: 50.064192, lng: 19.944544 });

  useEffect(() => {
    const getLocal = localStorage.getItem('mapCenter');
    if (getLocal) {
      const parseLocal = JSON.parse(getLocal);
      console.log(parseLocal);
      setCenter({ lat: parseLocal[0], lng: parseLocal[1] });
    }
  }, []);

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

  const handleSetCenter = () => {
    if (center !== null) {
      console.log(center);
      localStorage.setItem(
        'mapCenter',
        JSON.stringify([center.lat, center.lng]),
      );
      setShowPopup(true);
    }
  };

  const handleClickDialog =() => {
    setShowPopup(false);
  }

  return (
    <div>
      <MapContainer
        zoomControl={false}
        center={center}
        zoom={13}
        className="w-full flex-1 fixed top-[90px] h-[calc(100vh-90px)] left-0 right-0 bottom-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data © OpenStreetMap contributors"
        />
        <CenterMarker />
        {/* this is use to get the set center on page load */}
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
      {
        showPopup && (
          <ConfirmDialogX message="Your search center has been saved successfully" toggle={() => setShowPopup(false)} handleClicked={handleClickDialog} />
        )
      }
    </div>
  );
};

export default MapCenter;
