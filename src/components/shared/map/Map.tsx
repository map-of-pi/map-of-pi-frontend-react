import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import MapPopupCard from './MapPopupCard';
import { dummyCoordinates } from '../../../constants/coordinates';
import { Button, YellowBtn } from '../Forms/Buttons/Buttons';
import { IoMdAdd } from 'react-icons/io';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { LatLng } from 'leaflet';
import Image from 'next/image';

function Map() {
  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<LatLng | null>(null);
  function LocationMarker() {
    const map = useMapEvents({
      // layeradd() {
      //   map.locate();
      // },
      // click() {
      //   map.locate();
      // },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return (
      <>
        
        {position === null ? null : (
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </>
    );
  }

  return (
    <>
      <MapContainer
        center={{ lat: -1.6279, lng: 29.7451 }}
        zoom={13}
        zoomControl={false}
        // scrollWheelZoom={false}
        className="w-full flex-1 fixed top-[55px] h-[calc(100vh-55px)] left-0 right-0 bottom-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {dummyCoordinates.map((coord, i) => (
          <Marker position={coord} key={i} icon={customIcon}>
            <Popup>
              <MapPopupCard />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default Map;
