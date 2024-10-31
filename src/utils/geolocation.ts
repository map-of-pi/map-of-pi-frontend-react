import { DeviceLocationType, IUserSettings } from '@/constants/types';
import logger from '../../logger.config.mjs';

// Get device location, first trying GPS, and then falling back to IP-based geolocation
const getDeviceLocation = async (): Promise<[number, number] | null> => {
  if (navigator.geolocation) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      );
      return [position.coords.latitude, position.coords.longitude];
    } catch (error) {
      logger.warn('GPS location error:', (error as GeolocationPositionError).message);
      return null
    }
  }
  logger.warn('Unable to get device location by GPS');
  return null;
};

// Function to check user search center and return appropriate location
export const userLocation = async (userSettings: IUserSettings): Promise<[number, number] | null> => {
  if (!userSettings) {
    logger.warn('User settings not found');
    return null;
  }

  // Handle Automatic location finding preference
  if (userSettings.findme === DeviceLocationType.Automatic) {
    try {
      let location = await getDeviceLocation();
      if (location) {
        logger.info(`[Auto FindMe] GPS location: ${location[0]}, ${location[1]}`);
        return location;
      }

      // Fallback to search center if GPS fails
      if (userSettings.search_map_center?.coordinates) {
        const searchCenter = userSettings.search_map_center.coordinates;
        location = [searchCenter[1], searchCenter[0]];
        logger.info(`[Auto FindMe] Using search center location: ${location[0]}, ${location[1]}`);
        return location;
      }

      return null;
    } catch (error) {
      logger.error('Failed to retrieve automatic device location:', error);
      return null;
    }
  }

  // Handle GPS-only preference
  if (userSettings.findme === DeviceLocationType.GPS) {
    try {
      const location = await getDeviceLocation();
      if (location) {
        logger.info(`[GPS] User location: ${location[0]}, ${location[1]}`);
        return location;
      }
      return null;
    } catch (error) {
      logger.error('Failed to retrieve GPS device location:', error);
      return null;
    }
  }

  // Handle Search Center-only preference
  if (
    userSettings.findme === DeviceLocationType.SearchCenter &&
    Array.isArray(userSettings.search_map_center?.coordinates) &&
    userSettings.search_map_center.coordinates.length === 2
  ) {
    const searchCenter = userSettings.search_map_center.coordinates;
    const location: [number, number] = [searchCenter[1], searchCenter[0]]; // Ensures it's a tuple of exactly two numbers
    logger.info(`[Search Center] User location: ${location[0]}, ${location[1]}`);
    return location;
  } else {
    logger.warn('Invalid search center coordinates.');
    return null;
  }
};