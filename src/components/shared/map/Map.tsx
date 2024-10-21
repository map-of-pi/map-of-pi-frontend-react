import { useTranslations } from 'next-intl';
import React, { useEffect, useState, useCallback, useContext, useRef, MutableRefObject } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, LatLngBounds, LatLngTuple } from 'leaflet';
import _ from 'lodash';

import { ISeller, ISellerWithSettings } from '@/constants/types';
import { fetchSellers } from '@/services/sellerApi';

import MapMarkerPopup from './MapMarkerPopup';

import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

// Function to fetch seller coordinates based on bounds and optional search query
const fetchSellerCoordinates = async (
  bounds: L.LatLngBounds,
  searchQuery?: string
): Promise<ISellerWithSettings[]> => {
  try {
    const sellersData = await fetchSellers(bounds, searchQuery);

    // Map the seller data to include coordinates in the desired format
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

/* TODO: Analyze to see if we need this function to remove duplicates if sellers are already
restricted to one shop at the time of registration. */
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
  mapRef,
  searchQuery,
  isSearchClicked,
  searchResults,
}: {
  center: LatLngExpression;
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;   searchQuery: string;
  isSearchClicked: boolean;
  searchResults: ISeller[];
}) => {
  const t = useTranslations();
  const { isSigningInUser } = useContext(AppContext);

  const customIcon = L.icon({
    iconUrl: 'images/icons/map-of-pi-icon.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [sellers, setSellers] = useState<ISellerWithSettings[]>([]);
  const [origin, setOrigin] = useState(center);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  // Fetch initial seller coordinates when component mounts
  useEffect(() => {
    logger.info('Component mounted, fetching initial coordinates..');
    fetchInitialCoordinates();
  }, [searchQuery]);

  // Update origin when center prop changes
  useEffect(() => {
    if (center) {
      setOrigin(center);
    }
  }, [center]);

  useEffect(() => {
    if (searchResults.length > 0) {
      const sellersWithCoordinates = searchResults.map((seller: any) => {
        const [lng, lat] = seller.sell_map_center.coordinates;
        return {
          ...seller,
          coordinates: [lat, lng] as LatLngTuple,
        };
      });

      // Remove duplicates and limit to 36 sellers
      const uniqueSellers = removeDuplicates(sellersWithCoordinates).slice(0, 36);

      setSellers(uniqueSellers);
    } else if (!searchQuery) {
      // If no search results and no search query, fetch initial sellers
      fetchInitialCoordinates();
    } else {
      setSellers([]); // Clear sellers when search yields no results
    }
  }, [searchResults]);

  // Effect to zoom to fit all sellers when the search button is clicked
  useEffect(() => {
    if (isSearchClicked && searchResults.length > 0) {
      // Ensure that only valid coordinates are used to create bounds
      const validCoordinates = searchResults
        .map((seller) => seller.coordinates)
        .filter((coordinates) => coordinates && coordinates.length === 2);
  
      if (validCoordinates.length > 0) {
        const bounds = L.latLngBounds(validCoordinates);
        mapRef.current?.fitBounds(bounds, { padding: [50, 50] }); // zoom to fit all sellers
      } else {
        logger.warn("No valid coordinates found to fit bounds.");
      }
    }
  }, [isSearchClicked, searchResults]);

  // Log sellers array for debugging
  useEffect(() => {
    logger.debug('Sellers Array:', { sellers });
  }, [sellers]);

  // Function to fetch initial coordinates
  const fetchInitialCoordinates = async () => {
    if (searchQuery) return;

    setLoading(true);
    setError(null);
    try {
      // Fetch the current map bounds
      const bounds = mapRef.current?.getBounds();

      if (bounds) {
        let sellersData = await fetchSellerCoordinates(bounds, '');
        sellersData = removeDuplicates(sellersData);
        setSellers(sellersData);
      }
    } catch (error) {
      logger.error('Failed to fetch initial coordinates:', { error });
      setError('Failed to fetch initial coordinates');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle map interactions (only when there's no search query)
  const handleMapInteraction = async (newBounds: L.LatLngBounds, mapInstance: L.Map) => {
    const newCenter = newBounds.getCenter();
    if (searchQuery) return;

    logger.info('Handling map interaction with new center:', { newCenter });
    setLoading(true);
    setError(null);

    try {
      let additionalSellers = await fetchSellerCoordinates(newBounds, searchQuery);
      additionalSellers = removeDuplicates(additionalSellers);

      logger.info('Fetched additional sellers:', { additionalSellers });

      // Filter sellers within the new bounds, checking if coordinates are defined
      const filteredSellers = additionalSellers.filter(
        (seller) =>
          seller.coordinates &&
          newBounds.contains([seller.coordinates[0], seller.coordinates[1]])
      );
      logger.info('Filtered sellers within bounds', { filteredSellers });

      // Filter out sellers that are not within the new bounds from the existing sellers
      const remainingSellers = sellers.filter(
        (seller) =>
          seller.coordinates &&
          newBounds.contains([seller.coordinates[0], seller.coordinates[1]])
      );
      logger.info('Remaining sellers within bounds:', { remainingSellers });

      // Combine remaining and filtered sellers, remove duplicates, and cap at 36 sellers
      const updatedSellers = removeDuplicates([...remainingSellers, ...filteredSellers]);

      // Log the combined sellers before slicing
      logger.info('Combined sellers (before capping at 36):', { updatedSellers });

      setSellers(updatedSellers.slice(0, 36)); // Cap the total sellers to 36

      logger.info('Sellers after capping at 36:', {
        updatedSellers: updatedSellers.slice(0, 36),
      });

      setSellers(updatedSellers);
    } catch (error) {
      logger.error('Failed to fetch additional data:', { error });
      setError('Failed to fetch additional data');
    } finally {
      setLoading(false);
    }
  };

  // Debounced function to handle map interactions
  const debouncedHandleMapInteraction = useCallback(
    _.debounce((bounds: LatLngBounds, mapInstance: L.Map) => {
      handleMapInteraction(bounds, mapInstance);
    }, 500),
    [sellers] // Dependency array ensures the debounced function is updated with the latest sellers
  );

  // Component to handle location and map events
  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        logger.info(`Location found: ${e.latlng.toString()}`);
        setPosition(e.latlng);
        setLocationError(false);
        if (!initialLocationSet) {
          map.setView(e.latlng, zoom, { animate: false });
          setInitialLocationSet(true);
          setIsLocationAvailable(true);
        }
      },
      locationerror() {
        logger.warn('Location not found');
        setLocationError(true);
        setTimeout(() => setLocationError(false), 3000);
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
    }, [map]);

    // Initially set the view to user location without animation
    useEffect(() => {
      if (position && !initialLocationSet) {
        map.setView(position, zoom, { animate: false });
        setInitialLocationSet(true); // Prevent further automatic view resets
        setIsLocationAvailable(true);
      }
    }, [position, map, initialLocationSet]);

    return position === null ? null : <Marker position={position} />;
  }

  // Define map boundaries
  const bounds = L.latLngBounds(
    L.latLng(-90, -180), // SW corner
    L.latLng(90, 180) // NE corner
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
          whenReady={(mapInstance: L.LeafletEvent) => {
            mapRef.current = mapInstance.target as L.Map;
          }}
          zoomControl={false}
          minZoom={2}
          maxZoom={18}
          // maxBounds={bounds}
          // maxBoundsViscosity={1.0}
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
            >
              <Popup closeButton={false} minWidth={300}>
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
