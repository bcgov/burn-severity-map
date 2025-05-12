import React, { useRef } from "react";
import { Link } from 'react-router-dom'; // React Router component for navigation
import L from "leaflet"; // Leaflet for map functionality
import LeafletMap from "../components/map"; // Custom component to initialize the Leaflet map
import "./MapPage.scss"; // SCSS styles specific to this page/component

// Main React functional component for the map page
const App: React.FC = () => {
  // useRef to hold a reference to the Leaflet map instance.
  // This allows the map object to be accessed or controlled externally (e.g., for adding layers later).
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="map-page-container">
      {/* Navigation link back to home page */}
      <Link to="/">Home</Link>

      {/* Container where Leaflet will mount the map.
          LeafletMap component targets this div by its ID */}
      <div id="map-container">
        <LeafletMap mapRef={mapRef} />
      </div>
    </div>
  );
};

export default App;
