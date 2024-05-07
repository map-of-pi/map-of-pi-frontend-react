'use client';

import { useTranslations } from 'next-intl';
import L from 'leaflet';
import { dummyCoordinates } from '../../../constants/coardinates';
import MapPopupCard from '@/components/popup/MapPopupCard';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((module) => module.MapContainer),
  {
    ssr: false,
  },
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((module) => module.TileLayer),
  {
    ssr: false,
  },
);
const Marker = dynamic(
  () => import('react-leaflet').then((module) => module.Marker),
  {
    ssr: false,
  },
);
const Popup = dynamic(
  () => import('react-leaflet').then((module) => module.Popup),
  {
    ssr: false,
  },
);

const customIcon = L.icon({
  iconUrl: '/favicon-32x32.png',
  iconSize: [25, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Index(
  {
    // params: { locale },
  }: {
    params: { locale: string };
  },
) {
  //@ts-ignore
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  // const t = useTranslations('CORE');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
      );
    }
  }, [position]);

  return (
    <div className="w-screen flex h-screen flex-col relative mt-[57px]">
      <MapContainer
        center={{ lat: -1.6279, lng: 29.7451 }}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full flex-1 fixed top-[57px] left-0 right-0 bottom-0">
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
    </div>
  );
}
