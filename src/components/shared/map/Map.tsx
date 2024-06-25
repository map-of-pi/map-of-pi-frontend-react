import { useEffect, useState, useCallback } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { LatLngExpression, LatLngBounds } from 'leaflet';
import _ from 'lodash';

import MapMarkerPopup from './MapMarkerPopup';
import { fetchSellers } from '@/services/api';

// Define the Seller type to include the necessary information
type Seller = {
  coordinates: [number, number];
  _id: string;
  seller_id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  sale_items: string;
  average_rating: {
    $numberDecimal: string;
  };
  trust_meter_rating: number;
  order_online_enabled_pref: boolean;
  __v: number;
};

// Function to fetch seller coordinates from the API
const fetchSellerCoordinates = async (origin: { lat: number; lng: number }, radius: number): Promise<Seller[]> => {
  console.log('Fetching initial coordinates with origin:', origin, 'and radius:', radius);

  try {
    const sellersData = await fetchSellers();

    const sellersWithCoordinates = sellersData.map((seller: any) => {
      const [lng, lat] = seller.coordinates.coordinates;
      return {
        ...seller,
        coordinates: [lat, lng] as LatLngExpression
      };
    });

    return sellersWithCoordinates;
  } catch (error) {
    console.error('Error fetching seller coordinates:', error);
    throw error;
  }
};

// Function to simulate fetching additional data based on the map bounds
const fetchAdditionalSellerData = async (center: { lat: number; lng: number }, radius: number): Promise<Seller[]> => {
  console.log('Fetching additional seller data with center:', center, 'and radius:', radius);

  return new Promise((resolve) => {
    setTimeout(async () => {
      const sellersData = await fetchSellers();

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

const Map = () => {
  const customIcon = L.icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [origin] = useState({ lat: -1.6279, lng: 29.7451 });
  const [radius, setRadius] = useState(5); // Initial radius in km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setSellers((prevSellers) => [...prevSellers, ...additionalSellers]);
      } else {
        console.warn('No additional seller data found for the new bounds.');
      }
    } catch (err) {
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
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
      moveend() {
        const bounds = map.getBounds();
        debouncedHandleMapInteraction(bounds);
      },
      zoomend() {
        const bounds = map.getBounds();
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
