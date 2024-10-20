import { useTranslations } from 'next-intl';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds, LatLngTuple } from 'leaflet';
import axios from 'axios';

import { ISeller, ISellerWithSettings } from '@/constants/types';
import { fetchSellers } from '@/services/sellerApi';
import { toLatLngLiteral } from '@/utils/map';

import MapMarkerPopup from './MapMarkerPopup';
import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

// Utility function to ensure coordinates are within valid ranges
const sanitizeCoordinates = (lat: number, lng: number) => {
  const sanitizedLat = Math.min(Math.max(lat, -90), 90);
  const sanitizedLng = ((lng + 180) % 360 + 360) % 360 - 180; // Ensures -180 < lng <= 180
  return { lat: sanitizedLat, lng: sanitizedLng };
};

// Function to fetch seller coordinates based on origin, radius, and optional search query
const fetchSellerCoordinates = async (
  origin: LatLngTuple,
  radius: number,
  searchQuery?: string
): Promise<ISellerWithSettings[]> => {
  const { lat, lng } = sanitizeCoordinates(origin[0], origin[1]);
  const formattedOrigin = toLatLngLiteral([lat, lng]);

  try {
    const sellersData = await fetchSellers(formattedOrigin, radius, searchQuery);
    const sellersWithCoordinates = sellersData?.map((seller: any) => {
      const [lng, lat] = seller.sell_map_center.coordinates;
      return {
        ...seller,
        coordinates: [lat, lng] as LatLngTuple,
      };
    });

    logger.info('Fetched sellers data:', { sellersWithCoordinates });
    return sellersWithCoordinates;
  } catch (error) {
    logger.error('Error fetching seller coordinates:', { error });
    throw error;
  }
};

// Function to remove duplicate sellers
const removeDuplicates = (sellers: ISellerWithSettings[]): ISellerWithSettings[] => {
  const uniqueSellers: { [key: string]: ISellerWithSettings } = {};
  sellers.forEach((seller) => {
    uniqueSellers[seller.seller_id] = seller;
  });
  return Object.values(uniqueSellers);
};

const Map = ({
  center,
  zoom,
  searchQuery,
  isSearchClicked,
  searchResults,
  initialFindMePreference = 'Auto', // Start with Auto
}: {
  center: LatLngExpression;
  zoom: number;
  searchQuery: string;
  isSearchClicked: boolean;
  searchResults: ISeller[];
  initialFindMePreference?: 'Auto' | 'GPS' | 'SearchCentre';
}) => {
  const t = useTranslations();
  const mapRef = useRef<L.Map | null>(null);
  const { isSigningInUser } = useContext(AppContext);

  const customIcon = L.icon({
    iconUrl: 'images/icons/map-of-pi-icon.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [findMePreference, setFindMePreference] = useState<'Auto' | 'GPS' | 'SearchCentre'>(initialFindMePreference);
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<ISellerWithSettings[]>([]);
  const [origin, setOrigin] = useState(center);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  const getIPBasedCoordinates = async (): Promise<LatLngTuple> => {
    try {
      const response = await axios.get('https://ipwhois.app/json/');
      const { latitude, longitude } = response.data;
  
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new Error('Invalid coordinates received from IP geolocation service');
      }
  
      logger.info('IP-based geolocation successful', { latitude, longitude });
      return [latitude, longitude];
    } catch (error) {
      logger.error('Error fetching IP-based geolocation:', error);
      throw new Error('Failed to fetch IP-based geolocation');
    }
  };
  
  const fetchInitialCoordinates = async () => {
    setLoading(true);
    setError(null);
  
    try {
      let userCoordinates: LatLngTuple | null = null;
  
      // Default to search center coordinates
      const searchCenterCoordinates: LatLngTuple = [51.505, -0.09]; // Replace with actual search centre coordinates
  
      // If the preference is 'SearchCentre', use search center as the default
      if (findMePreference === 'SearchCentre') {
        logger.info('Using search center as default location');
        userCoordinates = searchCenterCoordinates;
        setIsLocationAvailable(true);
      }
  
      // Function to get GPS coordinates
      const getGPSCoordinates = (): Promise<LatLngTuple> => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve([latitude, longitude]);
            },
            (error) => {
              reject(error);
            }
          );
        });
      };
  
      // If findMePreference is 'Auto', prioritize IP geolocation
      if (findMePreference === 'Auto' || !userCoordinates) {
        try {
          logger.info('Trying IP-based geolocation');
          userCoordinates = await getIPBasedCoordinates();
          setIsLocationAvailable(true);
        } catch (error) {
          logger.warn('IP geolocation failed, falling back to GPS', { error });
          try {
            userCoordinates = await getGPSCoordinates();
            setIsLocationAvailable(true);
          } catch (gpsError) {
            logger.error('GPS geolocation failed', { gpsError });
            userCoordinates = searchCenterCoordinates; // Fallback to search center if all else fails
            showWorldView(); 
          }
        }
      } else if (findMePreference === 'GPS') {
        // Use GPS directly if the preference is set to GPS
        try {
          userCoordinates = await getGPSCoordinates();
          setIsLocationAvailable(true);
        } catch (gpsError) {
          logger.error('GPS geolocation failed', { gpsError });
          showWorldView();
          return;
        }
      }
  
      // If userCoordinates is found, set the map view and fetch sellers
      if (userCoordinates) {
        setOrigin(userCoordinates);
        setPosition(L.latLng(userCoordinates));
  
        if (mapRef.current) {
          mapRef.current.setView(userCoordinates, 13, { animate: true });
        }
  
        logger.info(`User's location found: ${userCoordinates[0]}, ${userCoordinates[1]}`);
  
        // Fetch sellers based on coordinates
        const originLiteral = toLatLngLiteral(userCoordinates);
        const originLatLngTuple: LatLngTuple = [originLiteral.lat, originLiteral.lng];
        let sellersData = await fetchSellerCoordinates(originLatLngTuple, radius, searchQuery);
        sellersData = removeDuplicates(sellersData);
        setSellers(sellersData);
      } else {
        setIsLocationAvailable(false);
        showWorldView();
      }
    } catch (error) {
      logger.error('Failed to fetch initial coordinates', { error });
      setError('Failed to fetch initial coordinates');
    } finally {
      setLoading(false);
    }
  };
  

  const fallbackToSearchCenter = () => {
    const searchCenterCoordinates: LatLngTuple = [51.505, -0.09]; // Replace with actual search centre coordinates
    setPosition(L.latLng(searchCenterCoordinates));
    setIsLocationAvailable(true);
    mapRef.current?.setView(searchCenterCoordinates, 13, { animate: true });
  };

  const showWorldView = () => {
    setIsLocationAvailable(false);
    mapRef.current?.setView([0, 0], 2, { animate: true });
  };

  // Function to handle marker click
  const handleMarkerClick = (sellerCoordinates: LatLngTuple) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentZoom = map.getZoom();

    map.setView(sellerCoordinates, currentZoom, { animate: true });
    const markerPoint = map.latLngToContainerPoint(sellerCoordinates);
    const mapSize = map.getSize();
    const mapWidth = mapSize.x;
    const mapHeight = mapSize.y;
    const panOffset = L.point(mapWidth / 2 - markerPoint.x, mapHeight / 2 - markerPoint.y);

    map.panBy(panOffset, { animate: false });
  };

  useEffect(() => {
    logger.info('Component mounted, fetching initial coordinates..');
    fetchInitialCoordinates();
  }, [findMePreference]); // Refetch on preference change

  useEffect(() => {
    if (center) {
      setOrigin(center);
    }
  }, [center]);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);

      const sellersWithCoordinates = searchResults.map((seller: any) => {
        const [lng, lat] = seller.sell_map_center.coordinates;
        return {
          ...seller,
          coordinates: [lat, lng] as LatLngTuple,
        };
      });

      const uniqueSellers = removeDuplicates(sellersWithCoordinates);
      setSellers(uniqueSellers);
      setLoading(false);
    }
  }, [searchQuery, searchResults]);

  useEffect(() => {
    if (isSearchClicked && searchResults.length > 0) {
      const bounds = L.latLngBounds(searchResults.map((seller) => seller.coordinates));
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [isSearchClicked, searchResults]);

  useEffect(() => {
    logger.debug('Sellers Array:', { sellers });
  }, [sellers]);

  // Function to handle map interactions (zoom and move)
  const handleMapInteraction = async (newBounds: LatLngBounds, mapInstance: L.Map) => {
    const newCenter = newBounds.getCenter();
    const newRadius = calculateRadius(newBounds, mapInstance);

    logger.info('Handling map interaction with new center and radius:', { newCenter, newRadius });
    setLoading(true);
    setError(null);

    try {
      const additionalSellers = await fetchSellerCoordinates(
        [newCenter.lat, newCenter.lng],
        newRadius,
        searchQuery
      );
      const uniqueSellers = removeDuplicates([...sellers, ...additionalSellers]);
      setSellers(uniqueSellers);
    } catch (error) {
      logger.error('Failed to fetch additional data:', { error });
      setError('Failed to fetch additional data');
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate radius from bounds
  const calculateRadius = (bounds: LatLngBounds, mapInstance: L.Map) => {
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const distance = mapInstance.distance(northEast, southWest) / 2;
    return distance / 1000; // Convert to kilometers
  };

  // Component to handle location and map events
  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        if (findMePreference !== 'SearchCentre') {
          logger.info(`Location found: ${e.latlng.toString()}`);
          setPosition(e.latlng);
          setLocationError(false);
          if (!initialLocationSet) {
            // Set zoom level when user location is found
            map.setView(e.latlng, 13, { animate: true });
            setInitialLocationSet(true);
            setIsLocationAvailable(true);
          }
        }
      },
      locationerror() {
        if (findMePreference === 'GPS') {
          logger.warn('Location not found');
          setLocationError(true);
          setTimeout(() => setLocationError(false), 3000);
        }
      },
      moveend() {
        const bounds = map.getBounds();
        handleMapInteraction(bounds, map);
      },
      zoomend() {
        const bounds = map.getBounds();
        handleMapInteraction(bounds, map);
      },
    });

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    return position === null || findMePreference === 'SearchCentre' ? null : (
      <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' })}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

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
      {isSigningInUser ? (
        <div className="w-full flex-1 fixed bottom-0 h-[calc(100vh-76.19px)] left-0 right-0 bg-[#f5f1e6] ">
          <div className="flex justify-center items-center w-full h-full">
            <img src="/default.png" width={120} height={140} alt="splashscreen" />
          </div>
        </div>
      ) : (
        <MapContainer
          center={isLocationAvailable ? origin : [0, 0]}
          zoom={isLocationAvailable ? zoom : 2}
          zoomControl={false}
          minZoom={2}
          maxZoom={18}
          className="w-full flex-1 fixed bottom-0 h-[calc(100vh-76.19px)] left-0 right-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
          />
          <LocationMarker />
          {sellers.map((seller) => (
            <Marker
              position={seller.coordinates as LatLngExpression}
              key={seller.seller_id}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(seller.coordinates as LatLngTuple),
              }}
            >
              <Popup
                closeButton={true}
                minWidth={200}
                maxWidth={250}
                className="custom-popup"
                offset={L.point(0, -3)}
              >
                <MapMarkerPopup seller={seller} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default Map;
