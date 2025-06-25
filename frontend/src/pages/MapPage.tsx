
// src/pages/MapPage.tsx
import React, { useRef } from "react";
import { Link } from 'react-router-dom';
import L from "leaflet";
import LeafletMap from "../components/map"; // Your map component
import "./MapPage.scss";

const MapPage: React.FC = () => { // Renamed from App to MapPage for clarity
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="map-page-container">
      <Link to="/">Home</Link>

      {/* The LeafletMap component will now render its own div internally */}
      {/* Remove the redundant div with id="map-container" here */}
      <LeafletMap mapRef={mapRef} /> 
    </div>
  );
};

export default MapPage;