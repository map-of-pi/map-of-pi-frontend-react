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
import { dummyCoordinates } from '../../../constants/coordinates';

// Mock function to simulate fetching initial coordinates
const fetchSellerCoordinates = async (origin: { lat: number; lng: number }, radius: number): Promise<LatLngExpression[]> => {
  console.log('Fetching initial coordinates with origin:', origin, 'and radius:', radius);
  
  // Replace this mock function with the actual API call
  // const response = await axios.get('/api/sellers', {
  //   params: { origin, radius }
  // });
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Initial coordinates fetched:', dummyCoordinates);
      resolve(dummyCoordinates);
    }, 500);
  });
};

// Mock function to simulate fetching additional data based on the map bounds
const fetchAdditionalSellerData = async (center: { lat: number; lng: number }, radius: number): Promise<LatLngExpression[]> => {
  console.log('Fetching additional seller data with center:', center, 'and radius:', radius);
  
  // Replace this mock function with the actual API call
  // const response = await axios.get('/api/sellers/additional', {
  //   params: { center, radius }
  // });
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const additionalData = dummyCoordinates.slice(0, 10); // Simulate fetching a subset of data
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
  const [sellerCoordinates, setSellerCoordinates] = useState<LatLngExpression[]>([]);
  const [origin, setOrigin] = useState({ lat: -1.6279, lng: 29.7451 });
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
      const coordinates = await fetchSellerCoordinates(origin, radius);
      setSellerCoordinates(coordinates);
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
      const additionalData = await fetchAdditionalSellerData({ lat: newCenter.lat, lng: newCenter.lng }, newRadius);
      if (additionalData.length > 0) {
        setSellerCoordinates((prevCoordinates) => {
          const newCoordinates = [...prevCoordinates, ...additionalData];
          return newCoordinates;
        });
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
        className="w-full flex-1 fixed top-[90px] h-[calc(100vh-55px)] left-0 right-0 bottom-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {sellerCoordinates.map((coord, i) => (
          <Marker position={coord} key={i} icon={customIcon}>
            <Popup closeButton={false}>
              <MapMarkerPopup />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )};  

export default Map;
