import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, OSM } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle, RegularShape } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
// Assuming other imports like BurnSeverityLegend are correct
import BurnSeverityLegend from './BurnSeverityLegend'; 
import BurnSeveritySummary from './BurnSeveritySummary';
import { useAuth } from '../../auth/AuthContext';
import { getFireData } from '../../utils/apiService'
import { useFireData } from '../FireDataContext';
import { Circle } from 'ol/geom';


// ... other interfaces and constants ...

interface OLMapProps {
  center?: [number, number];
  zoom?: number;
  basemap?: string;
  selectedDbFire?: string | null;
  selectedDbYear?: string | null;
  onVisibleFiresChange?: (fireNumbers: string[]) => void;
  onMapInit?: (map: Map) => void;
}

const OLMap: React.FC<OLMapProps> = ({
  center = [-123.3656, 48.4284],
  zoom = 6,
  basemap = 'osm',
  selectedDbFire,
  selectedDbYear,
  onVisibleFiresChange,
  onMapInit
}) => {
  const { isAuthenticated } = useAuth();
  const { firePointsGeoJSON, firePolysGeoJSON } = useFireData();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  
  // *** FIX: Use useRef for the layer to prevent re-render loops ***
  const burnSeverityLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const firePointsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const firePolysLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  
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
  const fetchAndDisplayBurnGeometry = useCallback(async (selectedYear: string, fireNumber: string) => {
    if (!mapInstanceRef.current) return;
    try {
      setShowLegend(true);
      setShowSummary(true);
      console.log ("FetchAndDisplayBurnGeometry",selectedYear,fireNumber)
      const featureCollection = await getFireData(selectedYear,fireNumber);
      
      setSelectedFireFeatureCollection(featureCollection);

      // *** FIX: Remove the old layer using the ref ***
      if (burnSeverityLayerRef.current) {
        mapInstanceRef.current.removeLayer(burnSeverityLayerRef.current);
        burnSeverityLayerRef.current = null;
      }

      if (featureCollection && featureCollection.features && featureCollection.features.length > 0) {
        setSelectedFireFeatureCollection(featureCollection);
        setShowLegend(true);
        setShowSummary(true);
      

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
      } else {
        setSelectedFireFeatureCollection(null);
        setShowLegend(false);
        setShowSummary(false);
      }
    } catch (error) {
      console.error('Failed to fetch or display burn geometry:', error);
      setSelectedFireFeatureCollection(null);
      setShowLegend(false);
      setShowSummary(false);
    }
  }, [fitMapToExtent]); // *** FIX: Removed burnSeverityLayer from dependency array ***


  const emitVisibleFires = useCallback(() => {
    if (!mapInstanceRef.current || !firePointsLayerRef.current || !onVisibleFiresChange) return;

    const source = firePointsLayerRef.current.getSource();
    if (!source) return;

    const extent = mapInstanceRef.current.getView().calculateExtent(mapInstanceRef.current.getSize());

    const featuresInView = source.getFeaturesInExtent(extent);
    const visibleNumbers = Array.from(new Set(featuresInView.map(f => f.get('FIRE_NUMBER')).filter(Boolean))) as string[];
    
    onVisibleFiresChange(visibleNumbers);

  }, [onVisibleFiresChange]);

  // Effect to initialize the map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const initialMap = new Map({
      target: mapRef.current,
      layers: [ new TileLayer({ source: new OSM() }) ],
      view: new View({ center: fromLonLat(center), zoom: zoom })
    });
    initialMap.addControl(new ScaleLine());
    mapInstanceRef.current = initialMap;
    onMapInit?.(initialMap)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;

      }
    };
  }, []);


  useEffect(() =>  {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    map.on('moveend', emitVisibleFires);

    return () => {
      map.un('moveend', emitVisibleFires);
    };
  }, [emitVisibleFires]);

  // Effect to add fire perimeters to the map
  useEffect(() => {
    if (!mapInstanceRef.current || !firePolysGeoJSON) return;
    if (firePolysLayerRef.current) mapInstanceRef.current.removeLayer(firePolysLayerRef.current);

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(firePolysGeoJSON)
    });

    const firePolysLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        // fill: new Fill({ color: 'rgba(230, 81, 0, 0.15)'}),
        stroke: new Stroke({ color: 'rgba(255, 0, 0, 0.85)', width: 1.5 })
      }),
      minZoom: 9
    });

    mapInstanceRef.current.addLayer(firePolysLayer);
    firePolysLayerRef.current = firePolysLayer;

    return () => {
      if (mapInstanceRef.current && firePolysLayerRef.current) {
        mapInstanceRef.current.removeLayer(firePolysLayerRef.current);
        firePolysLayerRef.current = null;
      }
    };
  }, [firePolysGeoJSON]);

  // Effect to add the fire points to the map
  useEffect(() => {
    if (!mapInstanceRef.current || !firePointsGeoJSON) return;
    if (firePointsLayerRef.current) mapInstanceRef.current.removeLayer(firePointsLayerRef.current);

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(firePointsGeoJSON)
    });

    const firePointsLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const status = feature.get('FIRE_STATUS') || '';
        const isProcessed = feature.get('is_processed') === true;

        let fillColour = 'rgba(128, 128, 128, 1)';
        const statusUpper = status.toUpperCase();

        if (statusUpper.includes('OUT OF CONTROL') || statusUpper.includes('FIRE OF NOTE')) {
          fillColour = 'rgba(255, 0, 0, 1)';
        } else if (statusUpper.includes('BEING HELD')){
          fillColour = 'rgba(255, 255, 0, 1)';
        } else if (statusUpper.includes('UNDER CONTROL')){
          fillColour = 'rgba(152, 230, 105, 1)';
        }

        return new Style({
          image: !isProcessed ? (new CircleStyle({
            radius: 4,
            stroke: new Stroke({
              color: '#ffffff',
              width: 1
            }),
            fill: new Fill({color: fillColour})
          })) : (new RegularShape({
            radius: 8,
            stroke: new Stroke({
              color: '#ffffff',
              width: 1
            }),
            points: 4,
            angle: Math.PI / 4,
            fill: new Fill({color: fillColour})
          })),
          zIndex: isProcessed ? 10 : 1
        });
      }
    });

    mapInstanceRef.current.addLayer(firePointsLayer);
    firePointsLayerRef.current = firePointsLayer;

    emitVisibleFires();

    return () => {
      if (mapInstanceRef.current && firePointsLayerRef.current) {
        mapInstanceRef.current.removeLayer(firePointsLayerRef.current);
        firePointsLayerRef.current = null;
      }
    };
  }, [firePointsGeoJSON, emitVisibleFires]);


  // Effect to swap the basemaps
  useEffect(() => {
  if (!mapInstanceRef.current) return;

  // Get the current base layer (assumes it's the first layer in the map)
  const baseLayer = mapInstanceRef.current.getLayers().item(0) as TileLayer<any>;
  if (!baseLayer) return;

  // Swap the basemap source based on the prop
  if (basemap === 'osm') {
    baseLayer.setSource(new OSM());
  } else if (basemap === 'satellite') {
    baseLayer.setSource(
      new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles © Esri'
      })
    );
  }
  }, [basemap]);

  // This is the key effect for displaying data. It is now stable.
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedDbFire) {
      fetchAndDisplayBurnGeometry(selectedDbYear, selectedDbFire);
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