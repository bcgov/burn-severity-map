import React, { useEffect } from "react";
import L from 'leaflet';
import { initializeMap } from "../utils/mapUtils";

// Props interface: expects a React ref object to hold a Leaflet map instance
interface MapProps {
  mapRef: React.RefObject<L.Map | null>;
}

/**
 * LeafletMap is a React functional component responsible for initializing
 * and cleaning up a Leaflet map instance using a passed-in ref.
 */
const LeafletMap: React.FC<MapProps> = ({ mapRef }) => {
  useEffect(() => {
    // Local variable to hold the map instance for cleanup
    let mapInstance: L.Map | null = null;

    // Async function to initialize the Leaflet map using a utility method
    const initialize = async () => {
      // Initialize the map in the div with id "map-container"
      const { map } = await initializeMap(
        document.getElementById("map-container") as HTMLDivElement,
      );

      // If the map was successfully created, store it both locally and in the ref
      if (map) {
        mapInstance = map;
        mapRef.current = mapInstance;
      }
    };

    // Call the initialization function on mount
    initialize();

    // Cleanup function to run on component unmount
    return () => {
      if (mapInstance) {
        // Remove the Leaflet map instance to avoid memory leaks
        mapInstance.remove();
        // Clear the ref to indicate that the map no longer exists
        mapRef.current = null;
      }
    };
  }, [mapRef]); // Dependency: ensures effect runs when `mapRef` changes

  // This component does not render any visible JSX itself
  return null;
};

export default LeafletMap;
