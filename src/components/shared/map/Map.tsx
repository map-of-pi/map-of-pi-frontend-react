import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds, LatLngTuple } from 'leaflet';
import _ from 'lodash';

import { fetchSellers } from '@/services/api';
import { SellerType } from '@/constants/types';
import { toLatLngLiteral } from '@/util/map';

import MapMarkerPopup from './MapMarkerPopup';

// Utility function to ensure coordinates are within valid ranges
const sanitizeCoordinates = (lat: number, lng: number) => {
  const sanitizedLat = Math.min(Math.max(lat, -90), 90);
  const sanitizedLng = ((lng + 180) % 360 + 360) % 360 - 180; // Ensures -180 < lng <= 180
  return { lat: sanitizedLat, lng: sanitizedLng };
};

// Function to fetch seller coordinates based on origin and radius
const fetchSellerCoordinates = async (origin: LatLngTuple, radius: number): Promise<SellerType[]> => {
  const { lat, lng } = sanitizeCoordinates(origin[0], origin[1]);
  const formattedOrigin = toLatLngLiteral([lat, lng]);

  console.log('Fetching seller coordinates with origin:', JSON.stringify(formattedOrigin), 'and radius:', radius);

  try {
    const sellersData = await fetchSellers(formattedOrigin, radius);

    const sellersWithCoordinates = sellersData.map((seller: any) => {
      const [lng, lat] = seller.coordinates.coordinates;
      return {
        ...seller,
        coordinates: [lat, lng] as LatLngTuple
      };
    });

    console.log('Fetched sellers data:', sellersWithCoordinates);

    return sellersWithCoordinates;
  } catch (error) {
    console.error('Error fetching seller coordinates:', error);
    throw error;
  }
};

// Function to remove duplicate sellers based on seller_id
const removeDuplicates = (sellers: SellerType[]): SellerType[] => {
  const uniqueSellers: { [key: string]: SellerType } = {};
  sellers.forEach(seller => {
    uniqueSellers[seller.seller_id] = seller;
  });
  return Object.values(uniqueSellers);
};

const Map = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<SellerType[]>([]);
  const [origin, setOrigin] = useState(center);
  const [radius, setRadius] = useState(10); // Initial radius in km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false); // State to handle location services error
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false); // New flag to track initial location set

  // Fetch initial seller coordinates when component mounts
  useEffect(() => {
    console.log('Component mounted, fetching initial coordinates...');
    fetchInitialCoordinates();
    requestLocation();
  }, []);

  // Update origin when center prop changes
  useEffect(() => {
    if (center) {
      setOrigin(center);
    }
  }, [center]);

  // Log sellers array for debugging
  useEffect(() => {
    console.log('Sellers Array:', sellers);
  }, [sellers]);

  // Function to fetch initial coordinates
  const fetchInitialCoordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      const originLiteral = toLatLngLiteral(origin);
      const originLatLngTuple: LatLngTuple = [originLiteral.lat, originLiteral.lng];
      let sellersData = await fetchSellerCoordinates(originLatLngTuple, radius);
      sellersData = removeDuplicates(sellersData);
      setSellers(sellersData);
    } catch (err) {
      console.error('Failed to fetch initial coordinates:', err);
      setError('Failed to fetch initial coordinates');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle map interactions (zoom and move)
  const handleMapInteraction = async (newBounds: L.LatLngBounds, mapInstance: L.Map) => {
    const newCenter = newBounds.getCenter();
    const newRadius = calculateRadius(newBounds, mapInstance);
    const largerRadius = newRadius * 2; // Increase radius by 100% for fetching

    console.log('Handling map interaction with new center:', newCenter, 'and radius:', newRadius);
    setLoading(true);
    setError(null);

    try {
      let additionalSellers = await fetchSellerCoordinates([newCenter.lat, newCenter.lng], largerRadius);
      additionalSellers = removeDuplicates(additionalSellers);

      console.log('Fetched additional sellers:', additionalSellers);

      // Filter sellers within the new bounds
      const filteredSellers = additionalSellers.filter(seller => newBounds.contains([seller.coordinates[0], seller.coordinates[1]]));
      console.log('Filtered sellers within bounds:', filteredSellers);

      // Filter out sellers that are not within the new bounds from the existing sellers
      const remainingSellers = sellers.filter(seller => newBounds.contains([seller.coordinates[0], seller.coordinates[1]]));
      console.log('Remaining sellers within bounds:', remainingSellers);

      const updatedSellers = removeDuplicates([...remainingSellers, ...filteredSellers]);
      console.log('Updated sellers array:', updatedSellers);

      setSellers(updatedSellers);
    } catch (err) {
      console.error('Failed to fetch additional data:', err);
      setError('Failed to fetch additional data');
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate radius from bounds
  const calculateRadius = (bounds: L.LatLngBounds, mapInstance: L.Map) => {
    console.log('Calculating radius for bounds:', bounds);
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const distance = mapInstance.distance(northEast, southWest) / 2;
    return distance / 1000; // Convert to kilometers
  };

  // Debounced function to handle map interactions
  const debouncedHandleMapInteraction = useCallback(
    _.debounce((bounds: LatLngBounds, mapInstance: L.Map) => {
      handleMapInteraction(bounds, mapInstance);
    }, 500),
    [sellers] // Dependency array ensures the debounced function is updated with the latest sellers
  );

  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLatLng = L.latLng(latitude, longitude);
          console.log('Real-time location updated:', newLatLng);
          setPosition(newLatLng);
          setOrigin(newLatLng);
          setIsLocationAvailable(true);
        },
        (error) => {
          console.log('Location not found:', error);
          setLocationError(true);
          setTimeout(() => setLocationError(false), 3000);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLocationError(true);
      setTimeout(() => setLocationError(false), 3000);
    }
  };

  // Component to handle location and map events
  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        console.log('Location found:', e.latlng);
        setPosition(e.latlng);
        setLocationError(false);
        if (!initialLocationSet) {
          map.setView(e.latlng, zoom, { animate: false });
          setInitialLocationSet(true);
        }
      },
      locationerror() {
        console.log('Location not found');
        setLocationError(true);
        setTimeout(() => setLocationError(false), 3000);
      },
      moveend() {
        const bounds = map.getBounds();
        console.log('Map move ended, new bounds:', bounds);
        debouncedHandleMapInteraction(bounds, map);
      },
      zoomend() {
        const bounds = map.getBounds();
        console.log('Map zoom ended, new bounds:', bounds);
        debouncedHandleMapInteraction(bounds, map);
      },
    });

    // Initially set the view to user location without animation
    useEffect(() => {
      if (position && !initialLocationSet) {
        map.setView(position, zoom, { animate: false });
        setInitialLocationSet(true); // Prevent further automatic view resets
      }
    }, [position, map, initialLocationSet]);

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
      {locationError && (
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            zIndex: 1000,
            textAlign: 'center',
            maxWidth: '90%',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          Location services are off. Please enable your device's location settings.
        </div>
      )}
      <MapContainer
        center={isLocationAvailable ? origin : [0, 0]}
        zoom={isLocationAvailable ? zoom : 2}
        zoomControl={false}
        className="w-full flex-1 fixed bottom-0 h-[calc(100vh-76.19px)] left-0 right-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {sellers.map((seller) => (
          <Marker position={seller.coordinates as LatLngExpression} key={seller.seller_id} icon={customIcon}>
            <Popup closeButton={false} minWidth={300}>
              <MapMarkerPopup seller={seller} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Map;
