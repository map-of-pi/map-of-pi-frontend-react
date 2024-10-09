import { useTranslations } from 'next-intl';

import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds, LatLngTuple } from 'leaflet';
import _ from 'lodash';

import { ISeller, ISellerWithSettings } from '@/constants/types';
import { fetchSellers } from '@/services/sellerApi';
import { toLatLngLiteral } from '@/utils/map';

import MapMarkerPopup from './MapMarkerPopup'

import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

// Utility function to ensure coordinates are within valid ranges
const sanitizeCoordinates = (lat: number, lng: number) => {
  const sanitizedLat = Math.min(Math.max(lat, -90), 90);
  const sanitizedLng = ((lng + 180) % 360 + 360) % 360 - 180; // Ensures -180 < lng <= 180
  return { lat: sanitizedLat, lng: sanitizedLng };
};

// Function to fetch seller coordinates based on origin, radius, and optional search query
const fetchSellerCoordinates = async (origin: LatLngTuple, radius: number, searchQuery?: string): Promise<ISellerWithSettings[]> => {
  const { lat, lng } = sanitizeCoordinates(origin[0], origin[1]);
  const formattedOrigin = toLatLngLiteral([lat, lng]);

  try {
    const sellersData = await fetchSellers(formattedOrigin, radius, searchQuery);
    const sellersWithCoordinates = sellersData?.map((seller: any) => {
      const [lng, lat] = seller.sell_map_center.coordinates;
      return {
        ...seller,
        coordinates: [lat, lng] as LatLngTuple
      };
    });

    logger.info('Fetched sellers data:', { sellersWithCoordinates });
    
    return sellersWithCoordinates;
  } catch (error) {
    logger.error('Error fetching seller coordinates:', { error });
    throw error;
  }
};

/* TODO: Analyze to see if we need this function to remove duplicates if sellers are already
restricted to one shop at the time of registration. */
const removeDuplicates = (sellers: ISellerWithSettings[]): ISellerWithSettings[] => {
  const uniqueSellers: { [key: string]: ISellerWithSettings } = {};
  sellers.forEach(seller => {
    uniqueSellers[seller.seller_id] = seller;
  });
  return Object.values(uniqueSellers);
};

const Map = ({ center, zoom, searchQuery, isSearchClicked, searchResults }: { 
  center: LatLngExpression, 
  zoom: number, 
  searchQuery: string, 
  isSearchClicked: boolean, 
  searchResults: ISeller[] 
}) => {
  const t = useTranslations();
  const mapRef = useRef<L.Map | null>(null); // reference to hold the map instance
  const {isSigningInUser} = useContext(AppContext);

  const customIcon = L.icon({
    iconUrl: 'images/icons/map-of-pi-icon.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<ISellerWithSettings[]>([]);
  const [origin, setOrigin] = useState(center);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [hasMapZoomed, setHasMapZoomed] = useState(false);
  
  // Fetch initial seller coordinates when map has zoomed to user's location
  useEffect(() => {
    if (hasMapZoomed) {
      logger.info('Map has zoomed to user location, fetching initial coordinates...');
      fetchInitialCoordinates();
    }
  }, [hasMapZoomed]);

  // Update origin when center prop changes
  useEffect(() => {
    if (center) {
      setOrigin(center);
    }
  }, [center]);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
  
      const sellersWithCoordinates = searchResults
        .map((seller: any) => {
          const [lng, lat] = seller.sell_map_center.coordinates;
          return {
            ...seller,
            coordinates: [lat, lng] as LatLngTuple
          };
        });
            
      // Remove duplicates
      const uniqueSellers = removeDuplicates(sellersWithCoordinates);
  
      // Update the sellers state
      setSellers(uniqueSellers);
      setLoading(false);
    }
  }, [searchQuery, searchResults]);

  // Effect to zoom to fit all sellers when the search button is clicked
  useEffect(() => {
    if (isSearchClicked && searchResults.length > 0) {
      const bounds = L.latLngBounds(searchResults.map(seller => seller.coordinates));
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] }); // zoom to fit all sellers
    }
  }, [isSearchClicked, searchResults]);

  // Log sellers array for debugging
  useEffect(() => {
    logger.debug('Sellers Array:', { sellers });
  }, [sellers]);

  // Function to fetch initial coordinates
  const fetchInitialCoordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      const originLiteral = toLatLngLiteral(origin);
      const originLatLngTuple: LatLngTuple = [originLiteral.lat, originLiteral.lng];
      let sellersData = await fetchSellerCoordinates(originLatLngTuple, radius, searchQuery);
      sellersData = removeDuplicates(sellersData);
      setSellers(sellersData);
    } catch (error) {
      logger.error('Failed to fetch initial coordinates:', { error });
      setError('Failed to fetch initial coordinates');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle map interactions (zoom and move); lazy-loading implementation
  const handleMapInteraction = async (newBounds: L.LatLngBounds, mapInstance: L.Map) => {
    const newCenter = newBounds.getCenter();
    const newRadius = calculateRadius(newBounds, mapInstance);
    const largerRadius = newRadius * 2; // Increase radius by 100% for fetching

    logger.info('Handling map interaction with new center and radius:', { newCenter, newRadius });
    setLoading(true);
    setError(null);

    try {
      let additionalSellers = await fetchSellerCoordinates([newCenter.lat, newCenter.lng], largerRadius, searchQuery);
      additionalSellers = removeDuplicates(additionalSellers);

      logger.info('Fetched additional sellers:', { additionalSellers });

      // Filter sellers within the new bounds, checking if coordinates are defined
      const filteredSellers = additionalSellers.filter(
        seller => seller.coordinates && newBounds.contains([seller.coordinates[0], seller.coordinates[1]])
      );
      logger.info('Filtered sellers within bounds', { filteredSellers });

      // Filter out sellers that are not within the new bounds from the existing sellers, checking if coordinates are defined
      const remainingSellers = sellers.filter(
        seller => seller.coordinates && newBounds.contains([seller.coordinates[0], seller.coordinates[1]])
      );
      logger.info('Remaining sellers within bounds:', { remainingSellers });

      const updatedSellers = removeDuplicates([...remainingSellers, ...filteredSellers]);
      logger.info('Updated sellers array:', { updatedSellers });

      setSellers(updatedSellers);
    } catch (error) {
      logger.error('Failed to fetch additional data:', { error });
      setError('Failed to fetch additional data');
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate radius from bounds
  const calculateRadius = (bounds: L.LatLngBounds, mapInstance: L.Map) => {
    logger.info(`Calculating radius for bounds: ${bounds.toBBoxString()}`);
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
    [sellers, hasMapZoomed] // Dependency array ensures the debounced function is updated with the latest sellers
  );

  // Component to handle location and map events
  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        logger.info(`Location found: ${e.latlng.toString()}`);
        
        if (!position || !position.equals(e.latlng)) {
          setPosition(e.latlng);
        }
        
        if (!initialLocationSet) {
          map.setView(e.latlng, zoom, { animate: false });
          setInitialLocationSet(true);
          setIsLocationAvailable(true);
          setHasMapZoomed(true); // Set hasMapZoomed to true after zoom
  
          if (Array.isArray(e.latlng)) {
            const [lat, lng] = e.latlng;
            setPosition(L.latLng(lat, lng)); // Create a LatLng instance
          } else {
            setPosition(e.latlng); // If it's already LatLng, just set it directly
          }          
        }
      },
      
      locationerror() {
        logger.warn('Location not found');
        setLocationError(true);
        setTimeout(() => setLocationError(false), 3000);
        // Set a default position
        const defaultLatLng = L.latLng(0, 0);
        setPosition(defaultLatLng);
        setHasMapZoomed(true); // Ensure hasMapZoomed is true even with fallback position
        setOrigin(defaultLatLng);
      },
      moveend() {
        const bounds = map.getBounds();
        debouncedHandleMapInteraction(bounds, map);
      },
      zoomend() {
        const bounds = map.getBounds();
        debouncedHandleMapInteraction(bounds, map);
      },
    });
  
    useEffect(() => {
      mapRef.current = map;
    }, []);
  
    // Use a ref to ensure map.locate() is called only once
    const locateCalledRef = useRef(false);
  
    useEffect(() => {
      if (!locateCalledRef.current) {
        map.locate();
        locateCalledRef.current = true;
      }
    }, []); // Empty dependency array to ensure this runs only once
  
    return position === null ? null : <Marker position={position} />;
  }
  

  // define map boundaries
  const bounds = L.latLngBounds(
    L.latLng(-90, -180), // SW corner
    L.latLng(90, 180)  // NE corner
  );

  return (
    <>
      {loading && <div className="loading">{t('SHARED.LOADING_SCREEN_MESSAGE')}</div>}
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
          {t('HOME.LOCATION_SERVICES.DISABLED_LOCATION_SERVICES_MESSAGE')}
        </div>
      )}
      {isSigningInUser ?
        <div className='w-full flex-1 fixed bottom-0 h-[calc(100vh-76.19px)] left-0 right-0 bg-[#f5f1e6] '>
          <div className="flex justify-center items-center w-full h-full">
           <img src="/default.png" width={120} height={140} alt="splashscreen"/>
          </div>
        </div> :
        <MapContainer
          center={isLocationAvailable ? origin : [0, 0]}
          zoom={isLocationAvailable ? zoom : 2}
          zoomControl={false}
          minZoom={2}
          maxZoom={18}
          // maxBounds={bounds}
          // maxBoundsViscosity={1.0}
          className="w-full flex-1 fixed bottom-0 h-[calc(100vh-76.19px)] left-0 right-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
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
      }
    </>
  );
};

export default Map;
