// src/utils/mapUtils.ts
import L from 'leaflet';

/**
 * Initializes a new Leaflet map on the given HTMLDivElement.
 * @param container The HTMLDivElement where the map will be initialized.
 * @returns The initialized Leaflet map instance.
 */
export function initializeMap(container: HTMLDivElement): L.Map {
  // It's good practice to ensure the container is valid,
  // though TypeScript helps.
  if (!container) {
    throw new Error("Map container element not found.");
  }

  // The L.map() constructor expects either an ID string or a DOM element.
  // Passing the DOM element directly is often cleaner when managed by React refs.
  const map = L.map(container, {
    center: [51.505, -0.09], // Default center
    zoom: 13,                // Default zoom
    zoomControl: false       // Example option
  });

  return map;
}