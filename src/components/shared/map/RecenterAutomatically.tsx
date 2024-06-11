'use client;'
import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';

function RecenterAutomatically(props: any) {
    const map = useMap();
    useEffect(() => {
      map.setView(props.position);
    }, []);
    return null;
}

export default RecenterAutomatically
