'use client;'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet';

interface RecenterAutomaticallyProps {
  position: {
    lat: number;
    lng: number;
  },
}

function RecenterAutomatically({ position}: RecenterAutomaticallyProps) {
  const map = useMap();

  useEffect(() => {
      map.setView(position);
    }, []);
    return null;
}

export default RecenterAutomatically
