import React, { useEffect, useRef } from "react";
import L from 'leaflet';
// Assuming initializeMap in mapUtils now just returns a new map instance
// or takes the container element directly
import { initializeMap } from "../../utils/mapUtils"; 

// Props interface: expects a React ref object to hold a Leaflet map instance
interface MapProps {
  mapRef: React.RefObject<L.Map | null>;
}

/**
 * LeafletMap is a React functional component responsible for initializing
 * and cleaning up a Leaflet map instance using a passed-in ref.
 */
const LeafletMap: React.FC<MapProps> = ({ mapRef }) => {
  // Use a local ref to get a reference to the actual DOM element
  // that this component renders. This is crucial for Leaflet.
  const mapContainerDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We only want to initialize the map if:
    // 1. The container div reference is available.
    // 2. The map instance has NOT already been stored in our mapRef (prevents re-initialization).
    if (mapContainerDivRef.current && !mapRef.current) {
      // It's safer to pass the actual DOM element reference to initializeMap
      // instead of relying on its ID within mapUtils.
      // Adjust your initializeMap function if it currently expects an ID string.
      const map = initializeMap(mapContainerDivRef.current); 
      
      // Store the map instance in the prop ref for parent access
      mapRef.current = map;

      // Add a default tile layer (example)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // IMPORTANT: Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.remove(); // This destroys the Leaflet map instance
          mapRef.current = null;   // Clear the ref
        }
      };
    }
    // If mapRef.current already exists, it means the map was already initialized
    // (e.g., during StrictMode's second pass, or if component was re-rendered
    // without being unmounted, though less common for a full page like MapPage).
    // In this case, do nothing on subsequent renders.

    // Dependency array: Only re-run if mapRef changes (unlikely for a prop ref)
    // or if mapContainerDivRef.current changes (also unlikely after initial mount)
  }, [mapRef]); 

  // The component *must* render the div that Leaflet will attach to.
  // We use the local ref `mapContainerDivRef` to get a handle on this div.
  return (
    <div 
      ref={mapContainerDivRef} 
      style={{ height: '100%', width: '100%', minHeight: '300px' /* Example: ensure it has height */ }} 
      className="map-component-container" // Optional: for styling
    />
  );
};

export default LeafletMap;