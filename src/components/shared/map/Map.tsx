import React, { useEffect, useState, useCallback } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds } from 'leaflet';
import _ from 'lodash';

import { fetchSellers } from '@/services/api';
import { SellerType } from '@/constants/types';
import { toLatLngLiteral } from '@/util/map';

import MapMarkerPopup from './MapMarkerPopup';

// Function to fetch seller coordinates from the API
const fetchSellerCoordinates = async (origin: LatLngExpression, radius: number): Promise<SellerType[]> => {
  const formattedOrigin = toLatLngLiteral(origin);
  
  console.log('Fetching initial seller coordinates with origin:', formattedOrigin, 'and radius:', radius);

  try {
    const sellersData = await fetchSellers(formattedOrigin, radius);
    
    const sellersWithCoordinates = sellersData.map((seller: any) => {
      const [lng, lat] = seller.coordinates.coordinates;
      return {
        ...seller,
        coordinates: [lat, lng] as LatLngExpression
      };
    });

    return sellersWithCoordinates;
  } catch (error) {
    console.error('Error fetching initial seller coordinates:', error);
    throw error;
  }
};

// Function to simulate fetching additional data based on the map bounds
const fetchAdditionalSellerData = async (center: LatLngExpression, radius: number): Promise<SellerType[]> => {
  const formattedCenter = toLatLngLiteral(center);

  console.log('Fetching additional seller data with center:', formattedCenter, 'and radius:', radius);
  
  return new Promise((resolve) => {
    setTimeout(async () => {
      const sellersData = await fetchSellers(formattedCenter, radius);

      const additionalData = sellersData.map((seller: any) => {
        const [lng, lat] = seller.coordinates.coordinates;
        return {
          ...seller,
          coordinates: [lat, lng] as LatLngExpression
        };
      });
      resolve(additionalData);
    }, 500);
  });
};

const Map = ({ center }: { center: LatLngExpression }) => {
  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<SellerType[]>([]);
  const [origin, setOrigin] = useState(center);
  const [radius, setRadius] = useState(5); // Initial radius in km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Component mounted, fetching initial coordinates...');
    fetchInitialCoordinates();
  }, []);

  useEffect(() => {
    if (center) {
      setOrigin(center);
    }
  }, [center]);

  const fetchInitialCoordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      // const formattedOrigin = toLatLngLiteral(origin);
      const sellersData = await fetchSellerCoordinates(origin, radius);
      setSellers(sellersData);
    } catch (err) {
      console.error('Failed to fetch initial coordinates:', err);
      setError('Failed to fetch initial coordinates');
    } finally {
      setLoading(false);
    }
  };

  const handleMapInteraction = async (newBounds: L.LatLngBounds) => {
    const newCenter = newBounds.getCenter();
    const newRadius = calculateRadius(newBounds);
    setLoading(true);
    setError(null);
    try {
      const additionalSellers = await fetchAdditionalSellerData({ lat: newCenter.lat, lng: newCenter.lng }, newRadius);
      if (additionalSellers.length > 0) {
        console.log('Appending additional data to existing seller coordinates');
        setSellers((prevCoordinates) => {
          const newCoordinates = [...prevCoordinates, ...additionalSellers];
          console.log('Updated seller coordinates:', newCoordinates);
          return newCoordinates;
        });
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
        className="w-full flex-1 fixed top-[90px] h-[calc(100vh-55px)] left-0 right-0 bottom-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {sellers.map((seller) => (
          <Marker position={seller.coordinates as LatLngExpression} key={seller.seller_id} icon={customIcon}>
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
