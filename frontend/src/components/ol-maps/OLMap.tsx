import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, OSM } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
// Assuming other imports like BurnSeverityLegend are correct
import BurnSeverityLegend from './BurnSeverityLegend'; 
import BurnSeveritySummary from './BurnSeveritySummary';

// ... other interfaces and constants ...

interface OLMapProps {
  center?: [number, number];
  zoom?: number;
  basemap?: string;
  selectedDbFire?: string | null;
}

const OLMap: React.FC<OLMapProps> = ({
  center = [-123.3656, 48.4284],
  zoom = 6,
  basemap = 'osm',
  selectedDbFire,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  
  // *** FIX: Use useRef for the layer to prevent re-render loops ***
  const burnSeverityLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  
  // State for the GeoJSON data (to pass to summary) and legend visibility
  const [selectedFireFeatureCollection, setSelectedFireFeatureCollection] = useState<any | null>(null);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(true);

  const fitMapToExtent = useCallback((extent: number[], options?: { maxZoom?: number, duration?: number }) => {
    if (!mapInstanceRef.current || !extent || extent[0] === Infinity) return;
    mapInstanceRef.current.getView().fit(extent, { 
      maxZoom: options?.maxZoom || 14, 
      duration: options?.duration || 1000 
    });
  }, []);

  // This function now uses the ref, and no longer depends on the layer state
  const fetchAndDisplayBurnGeometry = useCallback(async (fireNumber: string) => {
    if (!mapInstanceRef.current) return;
    try {
      setShowLegend(true);
      setShowSummary(true);

      const response = await fetch(`/pg-bs/burn-severity/${fireNumber}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch geometry: ${response.status} ${response.statusText}`);
      }
      const featureCollection = await response.json();
      
      setSelectedFireFeatureCollection(featureCollection);

      // *** FIX: Remove the old layer using the ref ***
      if (burnSeverityLayerRef.current) {
        mapInstanceRef.current.removeLayer(burnSeverityLayerRef.current);
      }

      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(featureCollection, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326'
        })
      });

      const newLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const burnSeverity = feature.get('BURN_SEVERITY_RATING') || feature.get('severity_class') || 'Unknown';
          let fillColor = 'rgba(0,0,0,0.1)';
          if (burnSeverity === 'High') fillColor = 'rgba(204,0,0,0.6)';
          else if (burnSeverity === 'Medium' || burnSeverity === 'Moderate') fillColor = 'rgba(255,153,51,0.6)';
          else if (burnSeverity === 'Low') fillColor = 'rgba(255,255,0,0.6)';
          return new Style({ fill: new Fill({ color: fillColor }), stroke: new Stroke({ color: '#333', width: 1 }) });
        }
      });
      
      mapInstanceRef.current.addLayer(newLayer);
      // *** FIX: Store the new layer in the ref instead of state ***
      burnSeverityLayerRef.current = newLayer;

      if (vectorSource.getFeatures().length > 0) {
        const extent = vectorSource.getExtent();
        fitMapToExtent(extent);
      }
    } catch (error) {
      console.error('Failed to fetch or display burn geometry:', error);
    }
  }, [fitMapToExtent]); // *** FIX: Removed burnSeverityLayer from dependency array ***

  // Effect to initialize the map (unchanged)
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const initialMap = new Map({
      target: mapRef.current,
      layers: [ new TileLayer({ source: new OSM() }) ],
      view: new View({ center: fromLonLat(center), zoom: zoom })
    });
    initialMap.addControl(new ScaleLine());
    mapInstanceRef.current = initialMap;
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // This is the key effect for displaying data. It is now stable.
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedDbFire) {
      fetchAndDisplayBurnGeometry(selectedDbFire);
    } else {
      // If no fire is selected, clear the layer using the ref
      if (burnSeverityLayerRef.current) {
        mapInstanceRef.current.removeLayer(burnSeverityLayerRef.current);
        burnSeverityLayerRef.current = null;
        setSelectedFireFeatureCollection(null);
        setShowLegend(false);
        setShowSummary(false);
      }
    }
  }, [selectedDbFire, fetchAndDisplayBurnGeometry]);

  // ... rest of the component (other effects, return with JSX) remains the same ...

  return (
    <div className="map-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      <BurnSeverityLegend 
        isVisible={showLegend}
        onClose={() => setShowLegend(false)}
      />

      {selectedDbFire && selectedFireFeatureCollection && showSummary && (
        <BurnSeveritySummary 
          featureCollection={selectedFireFeatureCollection}
          selectedFire={selectedDbFire}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
};

export default OLMap;