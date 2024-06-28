import { LatLngExpression } from "leaflet";

export const toLatLngLiteral = (origin: LatLngExpression): { lat: number; lng: number } => {
  if (Array.isArray(origin)) {
    // origin is a LatLngTuple (e.g., [lat, lng])
    return { lat: origin[0], lng: origin[1] };
  } else if ('lat' in origin && 'lng' in origin) {
    // origin is a LatLngLiteral (e.g., { lat: number, lng: number })
    return origin as { lat: number; lng: number };
  } else {
    // origin is a Leaflet LatLng object
    const latLng = origin as L.LatLng;
    return { lat: latLng.lat, lng: latLng.lng };
  }
};
