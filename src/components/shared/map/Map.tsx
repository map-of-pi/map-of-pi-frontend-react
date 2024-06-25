import L from 'leaflet';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { LatLngExpression, LatLngBounds } from 'leaflet';
import _ from 'lodash';

import MapMarkerPopup from './MapMarkerPopup';

// Function to fetch initial coordinates from the backend
const fetchSellerCoordinates = async (origin: { lat: number; lng: number }, radius: number): Promise<LatLngExpression[]> => {
  console.log('Fetching initial coordinates with origin:', origin, 'and radius:', radius);
  try {
    const response = await axios.get('https://map-of-pi-backend-react.vercel.app/api/v1/sellers', {
      params: { origin, radius },
    });
    console.log('Initial coordinates fetched:', response.data);
    return response.data.map((seller: any) => ({ lat: seller.coordinates.lat, lng: seller.coordinates.lng }));
  } catch (error) {
    console.error('Error fetching initial coordinates:', error);
    throw error;
  }
};

// Function to fetch additional data based on the map bounds from the backend
const fetchAdditionalSellerData = async (center: { lat: number; lng: number }, radius: number): Promise<LatLngExpression[]> => {
  console.log('Fetching additional seller data with center:', center, 'and radius:', radius);
  try {
    const response = await axios.get('https://map-of-pi-backend-react.vercel.app/api/v1/sellers', {
      params: { origin: center, radius },
    });
    console.log('Additional seller data fetched:', response.data);
    return response.data.map((seller: any) => ({ lat: seller.coordinates.lat, lng: seller.coordinates.lng }));
  } catch (error) {
    console.error('Error fetching additional seller data:', error);
    throw error;
  }
};

const Map = () => {
  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellerCoordinates, setSellerCoordinates] = useState<LatLngExpression[]>([]);
  const [origin, setOrigin] = useState({ lat: -1.6279, lng: 29.7451 });
  const [radius, setRadius] = useState(5); // Initial radius in km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Component mounted, fetching initial coordinates...');
    fetchInitialCoordinates();
  }, []);

  const fetchInitialCoordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      const coordinates = await fetchSellerCoordinates(origin, radius);
      setSellerCoordinates(coordinates);
    } catch (err) {
      console.error('Failed to fetch initial coordinates:', err);
      setError('Failed to fetch initial coordinates');
    } finally {
      setLoading(false);
    }
  };

  const handleMapInteraction = async (newBounds: L.LatLngBounds) => {
    console.log('Map interaction detected, new bounds:', newBounds);
    const newCenter = newBounds.getCenter();
    const newRadius = calculateRadius(newBounds);
    setLoading(true);
    setError(null);
    try {
      const additionalData = await fetchAdditionalSellerData({ lat: newCenter.lat, lng: newCenter.lng }, newRadius);
      if (additionalData.length === 0) {
        console.warn('No additional seller data found for the new bounds.');
      } else {
        console.log('Appending additional data to existing seller coordinates');
        setSellerCoordinates((prevCoordinates) => {
          const newCoordinates = [...prevCoordinates, ...additionalData];
          console.log('Updated seller coordinates:', newCoordinates);
          return newCoordinates;
        });
      }
    } catch (err) {
      console.error('Failed to fetch additional data:', err);
      setError('Failed to fetch additional data');
    } finally {
      setLoading(false);
    }
  };

  const calculateRadius = (bounds: L.LatLngBounds) => {
    console.log('Calculating radius for bounds:', bounds);
    // Implement logic to calculate radius based on map bounds
    return 10; // Example radius value
  };

  const debouncedHandleMapInteraction = useCallback(
    _.debounce((bounds: LatLngBounds) => {
      handleMapInteraction(bounds);
    }, 500),
    []
  );

  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        console.log('Location found:', e.latlng);
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
      moveend() {
        const bounds = map.getBounds();
        console.log('Map move ended, new bounds:', bounds);
        debouncedHandleMapInteraction(bounds);
      },
      zoomend() {
        const bounds = map.getBounds();
        console.log('Map zoom ended, new bounds:', bounds);
        debouncedHandleMapInteraction(bounds);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <MapContainer
        center={origin}
        zoom={13}
        zoomControl={false}
        className="w-full flex-1 fixed top-[76.19px] h-[calc(100vh-76.19px)] left-0 right-0 bottom-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {sellerCoordinates.map((coord, i) => (
          coord && coord.lat && coord.lng && ( // Ensure the coordinates are valid before rendering
            <Marker position={coord} key={i} icon={customIcon}>
              <Popup closeButton={false}>
                <MapMarkerPopup />
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </>
  );
};

export default Map;
