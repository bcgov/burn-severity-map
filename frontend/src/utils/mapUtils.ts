import L from 'leaflet';

// Define the southwest corner of the map bounds (latitude, longitude)
export const southWest: L.LatLng = L.latLng(40, -150);

// Define the northeast corner of the map bounds (latitude, longitude)
export const northEast: L.LatLng = L.latLng(65, -100);

// Create a bounding box using the southwest and northeast coordinates
export const bounds: L.LatLngBounds = L.latLngBounds(southWest, northEast);

// Define the maximum zoom level allowed on the map
export const maxZoomNum: number = 15;

// Define the minimum zoom level allowed on the map
export const minZoomNum: number = 5;

/**
 * Initializes a Leaflet map inside the provided HTML container.
 * mapContainerRef - A reference to the HTML div element that will contain the map.
 * returns - A Promise resolving to an object with the initialized Leaflet map or null if initialization failed.
 */
export const initializeMap = async (
  mapContainerRef: HTMLDivElement | null,
): Promise<{ map: L.Map | null }> => {
  // Return early if the container is null
  if (!mapContainerRef) return { map: null };

  // Create the map instance with specified bounds and zoom limits, and center it at [54, -125] with zoom level 5
  const mapInstance = L.map(mapContainerRef, {
    maxBounds: bounds,
    maxZoom: maxZoomNum,
    minZoom: minZoomNum,
  }).setView([54, -125], 5);

  // Add a CARTO Voyager basemap layer with appropriate attribution
  const baseMap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
    }
  );

  // Add the basemap to the map instance
  baseMap.addTo(mapInstance);

  // Return the initialized map
  return { map: mapInstance };
};
