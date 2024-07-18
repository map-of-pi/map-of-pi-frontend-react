import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds, LatLngLiteral } from 'leaflet';
import _ from 'lodash';

import { fetchSellers } from '@/services/api';
import { SellerType } from '@/constants/types';
import { toLatLngLiteral } from '@/util/map';

import MapMarkerPopup from './MapMarkerPopup';

// Type guard to check if a LatLngExpression is LatLngLiteral
const isLatLngLiteral = (latLng: LatLngExpression): latLng is LatLngLiteral => {
  return (latLng as LatLngLiteral).lat !== undefined && (latLng as LatLngLiteral).lng !== undefined;
};

const fetchSellerCoordinates = async (origin: LatLngLiteral, radius: number): Promise<SellerType[]> => {
  const formattedOrigin = toLatLngLiteral(origin);

  console.log('Fetching initial seller coordinates with origin:', formattedOrigin, 'and radius:', radius);

  try {
    const sellersData = await fetchSellers(formattedOrigin, radius);

    const sellersWithCoordinates = sellersData.map((seller: any) => {
      const [lng, lat] = seller.coordinates.coordinates;
      return {
        ...seller,
        coordinates: [lat, lng] as LatLngExpression,
      };
    });

    return sellersWithCoordinates;
  } catch (error) {
    console.error('Error fetching initial seller coordinates:', error);
    throw error;
  }
};

const fetchAdditionalSellerData = async (center: LatLngLiteral, radius: number): Promise<SellerType[]> => {
  const formattedCenter = toLatLngLiteral(center);

  console.log('Fetching additional seller data with center:', formattedCenter, 'and radius:', radius);

  return new Promise((resolve) => {
    setTimeout(async () => {
      const sellersData = await fetchSellers(formattedCenter, radius);

      const additionalData = sellersData.map((seller: any) => {
        const [lng, lat] = seller.coordinates.coordinates;
        return {
          ...seller,
          coordinates: [lat, lng] as LatLngExpression,
        };
      });
      resolve(additionalData);
    }, 500);
  });
};

interface MapProps {
  center: LatLngExpression;
}

const Map: React.FC<MapProps> = ({ center }) => {
  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<SellerType[]>([]);
  const [origin, setOrigin] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
  const [radius, setRadius] = useState(5); // Initial radius in km
  const [error, setError] = useState<string | null>(null);
  const [showLocationError, setShowLocationError] = useState(false);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  useEffect(() => {
    console.log('Component mounted, fetching initial coordinates...');
    fetchInitialCoordinates();
    requestLocation();
  }, []);

  useEffect(() => {
    if (isLatLngLiteral(center) && center.lat !== 0 && center.lng !== 0) {
      setOrigin(center);
    }
  }, [center]);

  const calculateRadius = useCallback((bounds: L.LatLngBounds): number => {
    console.log('Calculating radius for bounds:', bounds);
    // Implement logic to calculate radius based on map bounds
    return 10; // Example radius value
  }, []);

  const fetchInitialCoordinates = async () => {
    setError(null);
    try {
      const sellersData = await fetchSellerCoordinates(origin, radius);
      setSellers(sellersData);
    } catch (err) {
      console.error('Failed to fetch initial coordinates:', err);
      setError('Failed to fetch initial coordinates');
    }
  };

  const handleMapInteraction = useCallback(async (newBounds: L.LatLngBounds) => {
    const newCenter = newBounds.getCenter();
    const newRadius = calculateRadius(newBounds);
    setError(null);
    try {
      const additionalSellers = await fetchAdditionalSellerData({ lat: newCenter.lat, lng: newCenter.lng }, newRadius);
      if (additionalSellers.length > 0) {
        console.log('Appending additional data to existing seller coordinates');
        setSellers((prevCoordinates) => [...prevCoordinates, ...additionalSellers]);
      } else {
        console.warn('No additional seller data found for the new bounds.');
      }
    } catch (err) {
      console.error('Failed to fetch additional data:', err);
      setError('Failed to fetch additional data');
    }
  }, [calculateRadius]);

  const debouncedHandleMapInteraction = useCallback(
    _.debounce((bounds: LatLngBounds) => {
      handleMapInteraction(bounds);
    }, 500),
    [handleMapInteraction]
  );

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLatLng = L.latLng(latitude, longitude);
          console.log('Location found:', newLatLng);
          setPosition(newLatLng);
          setOrigin(newLatLng);
          setIsLocationAvailable(true);
        },
        (error) => {
          console.log('Location not found:', error);
          setShowLocationError(true);
          setTimeout(() => setShowLocationError(false), 3000);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setShowLocationError(true);
      setTimeout(() => setShowLocationError(false), 3000);
    }
  };

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (position && !initialLocationSet) {
        map.setView(position, 18, { animate: false }); // Directly set view to position without animation
        setInitialLocationSet(true);
      }
    }, [position, map, initialLocationSet]);

    useMapEvents({
      locationfound(e) {
        console.log('Location found:', e.latlng);
        setPosition(e.latlng);
        if (!initialLocationSet) {
          map.setView(e.latlng, 18, { animate: false }); // Directly set view to location without animation
          setInitialLocationSet(true);
        }
      },
      locationerror() {
        console.log('Location not found');
        setShowLocationError(true);
        setTimeout(() => setShowLocationError(false), 3000);
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
  };

  return (
    <>
      {showLocationError && (
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 165, 0, 0.9)',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            zIndex: 1000,
            textAlign: 'center',
            maxWidth: '90%',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          Location services are off. Please switch on your device's location setting.
        </div>
      )}
      <MapContainer
        center={isLocationAvailable ? origin : [0, 0]}
        zoom={isLocationAvailable ? 13 : 2}
        zoomControl={false} // Disable the default zoom control
        className="w-full flex-1 fixed top-[90px] h-[calc(100vh-55px)] left-0 right-0 bottom-0"
      >
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



