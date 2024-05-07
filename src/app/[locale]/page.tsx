'use client';

import { useTranslations } from 'next-intl';
import L from 'leaflet';
import { dummyCoordinates } from '../../constants/coordinates';
import MapPopupCard from '@/components/popup/MapPopupCard';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// import Map from '@/components/mappopup/Map';

// const MapContainer = dynamic(
//   () => import('react-leaflet').then((module) => module.MapContainer),
//   {
//     ssr: false,
//   },
// );
// const TileLayer = dynamic(
//   () => import('react-leaflet').then((module) => module.TileLayer),
//   {
//     ssr: false,
//   },
// );
// const Marker = dynamic(
//   () => import('react-leaflet').then((module) => module.Marker),
//   {
//     ssr: false,
//   },
// );
// const Popup = dynamic(
//   () => import('react-leaflet').then((module) => module.Popup),
//   {
//     ssr: false,
//   },
// );

// const customIcon = L.icon({
//   iconUrl: '/favicon-32x32.png',
//   iconSize: [25, 30],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

export default function Index(
  {
    // params: { locale },
  }: {
    params: { locale: string };
  },
) {
  const DynamicMap = dynamic(() => import('../../components/mappopup/Map'), {
    ssr: false,
  });

  return (
    <>
      <DynamicMap />
    </>
  );
}
