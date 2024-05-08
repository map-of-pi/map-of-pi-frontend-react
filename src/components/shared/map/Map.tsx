import L from 'leaflet';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MapPopupCard from './MapPopupCard';
import { dummyCoordinates } from '../../../constants/coordinates';

function Map() {

  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [25, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={{ lat: -1.6279, lng: 29.7451 }}
      zoom={13}
      // scrollWheelZoom={false}
      className="w-full flex-1 fixed top-[55px] h-[calc(100vh-55px)] left-0 right-0 bottom-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dummyCoordinates.map((coord, i) => (
        <Marker position={coord} key={i} icon={customIcon}>
          <Popup>
            <MapPopupCard />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
