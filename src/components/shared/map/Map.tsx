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
const fetchSellerCoordinates = async (origin: { lat: number; lng: number }, radius: number): Promise<any[]> => {
  console.log('Fetching initial coordinates with origin:', origin, 'and radius:', radius);
  try {
    const response = await axios.get('https://map-of-pi-backend-react.vercel.app/api/v1/sellers', {
      params: { origin, radius },
    });
    console.log('Initial coordinates fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching initial coordinates:', error);
    throw error;
  }
};

// Function to fetch additional data based on the map bounds from the backend
const fetchAdditionalSellerData = async (center: { lat: number; lng: number }, radius: number): Promise<any[]> => {
  console.log('Fetching additional seller data with center:', center, 'and radius:', radius);
  try {
    const response = await axios.get('https://map-of-pi-backend-react.vercel.app/api/v1/sellers', {
      params: { origin: center, radius },
    });
    console.log('Additional seller data fetched:', response.data);
    return response.data;
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
  const [sellers, setSellers] = useState<SellerType[]>([]);
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
      const sellersData = await fetchSellerCoordinates(origin, radius);
      setSellers(sellersData);
      console.log('Seller data:', sellersData);
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
      const additionalSellers = await fetchAdditionalSellerData({ lat: newCenter.lat, lng: newCenter.lng }, newRadius);
      if (additionalSellers.length > 0) {
        setSellers((prevSellers) => [...prevSellers, ...additionalSellers]);
      } else {
        console.warn('No additional seller data found for the new bounds.');
      }
    } catch (err) {
      console.error('Failed to fetch additional data:', err);
      setError('Failed to fetch additional data');
    } finally {
      setLoading(false);
    }
  };

  const calculateRadius = (bounds: L.LatLngBounds) => {
    const center = bounds.getCenter();
    const northEast = bounds.getNorthEast();
    const distance = center.distanceTo(northEast);
    return distance / 1000; // Convert to kilometers
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
        className="w-full flex-1 fixed top-[90px] h-[calc(100vh-55px)] left-0 right-0 bottom-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {sellers.map((seller) => (
          <Marker position={seller.coordinates as LatLngExpression} key={seller._id} icon={customIcon}>
            <Popup closeButton={false}>
              <MapMarkerPopup seller={seller} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Map;
