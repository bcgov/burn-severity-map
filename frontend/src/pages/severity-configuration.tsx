//src/pages/severity-configuration.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './severity-configuration.scss';
import '../style.scss';
import './burn-severity.scss';
import { MapContext } from '../components/MapContext';
import StacSearchPanel from '../components/StacSearchPanel'

import { useAuth } from '../auth/AuthContext';

import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import MapOL from 'ol/Map';

import FireSelector_db from '../components/ol-maps/FireSelector_db';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import { FireDataProvider, useFireData, FireOption} from '../components/FireDataContext';

import OLMap from '../components/ol-maps/OLMap';


const ConfigurationApp: React.FC = () => {
  const { selectedYear, setSelectedYear, firePointsGeoJSON } = useFireData();
  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<MapOL | null>(null);
  const [bounds, setBounds] = useState<any>(null); // OpenLayers doesn't use LngLatBounds
  const previewLayerRef = useRef<any>(null);
  const [previewLayerUrl, setPreviewLayerUrl] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number]>([-126.5, 54.5]);
  const [zoom, setZoom] = useState(5);
  const [basemap, setBasemap] = useState('satellite');
  const [selectedFire, setSelectedFire] = useState<FireOption | null>(null);
  const [analysisFire, setAnalysisFire] = useState<string | null>(null);
  const currentYear = String(new Date().getFullYear());
  const [visibleFireNumbers, setVisibleFireNumbers] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);


  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1984; y--) {
      years.push(y.toString());
    }
    return years;
  }, []);

  const fireOptions: FireOption[] = useMemo(() => {
    if (!firePointsGeoJSON || ! firePointsGeoJSON.features) return [];

    const optionsMap = new Map<string, FireOption>();

    firePointsGeoJSON.features.forEach((feature: any) => {
      const props = feature.properties || {};
      const fireNum = props.FIRE_NUMBER || props.fire_number;
      const coords = feature.geometry.coordinates;

      if (fireNum) {
        const cleanNum = String(fireNum).trim();
        optionsMap.set(cleanNum, {
          id: props.FIRE_ID.toString(),
          fireNumber: cleanNum,
          isProcessed: !!props.is_processed,
          incidentName: props.INCIDENT_NAME && props.INCIDENT_NAME !== cleanNum ? props.INCIDENT_NAME : props.GEOGRAPHIC_DESCRIPTION,
          geogDescription: props.GEOGRAPHIC_DESCRIPTION,
          ignitionDate: props.IGNITION_DATE,
          lonLat: [coords[0], coords[1]],
          year: props.FIRE_YEAR
        });
      }
    });
    return Array.from(optionsMap.values()).sort((a,b) => a.fireNumber.localeCompare(b.fireNumber));
  }, [firePointsGeoJSON]);


  const displayedFires = useMemo(() => {
      if (!visibleFireNumbers) return fireOptions;
      return fireOptions.filter(fire => visibleFireNumbers.includes(fire.fireNumber));
  }, [fireOptions, visibleFireNumbers]);

  const handleDbYearSelect = (year: string | null) => {
    if (year) {
      setSelectedYear(year);
    }
    setSelectedDbFire(null);
    setAnalysisFire(null);
  };

  const handleDbFireSelect = (fireNumber: string | null) => {
    setSelectedDbFire(fireNumber);
    if (!fireNumber) {
      setAnalysisFire(null);
      setSelectedFire(null)
      // setPerimeterLayerUrl(null);
      removePreviewLayer();
      return;
    }
    const selectedOption = fireOptions.find(f => f.fireNumber === fireNumber) || null;
    setSelectedFire(selectedOption);

    if (fireNumber) {
      // addFireBoundary(fireNumber);
      setAnalysisFire(fireNumber);
    }
  };

  const handleUpdateMapView = (newCenter: [number,number], newZoom: number) => {
    setCenter(newCenter)
    setZoom(newZoom);
  };
  const fitMapToExtent = useCallback((extent: number[], options?: { maxZoom?: number, duration?: number }) => {
    if (!mapInstance || !extent || extent[0] === Infinity) return;
    mapInstance.getView().fit(extent, { 
      maxZoom: options?.maxZoom || 14, 
      duration: options?.duration || 1000 ,
      padding: [50, 50, 50, 50]
    });
  }, [mapInstance]);

  const addPreviewLayer = (url: string) => {
    console.log(url);
    setPreviewLayerUrl(url);
  };

  const removePreviewLayer = () => {
    setPreviewLayerUrl(null);
  };

  const addAnalysisLayer = useCallback(() => {
    console.log('Analysis complete. triggering map results')
    setRefreshTrigger(prev => prev + 1);
  }, []);

  //useEffect for init of map
  useEffect(() => {
    if (!mapInstance) return; // Wait until ref is set
    
    const onMoveEnd = () => {
      const view = mapInstance.getView();
      const extent = view.calculateExtent();
      setBounds(extent);
    };

    mapInstance.on('moveend', onMoveEnd);
    // Trigger initial bounds calculation
    onMoveEnd();

  }, [mapInstance]);

 // useEffect to manage the preview layer
  useEffect(() => {
    if (!mapInstance) return;

    // Cleanup existing layer
    if (previewLayerRef.current) {
      mapInstance.removeLayer(previewLayerRef.current);
      previewLayerRef.current = null;
    }

    // Add new layer if a URL is provided
    if (previewLayerUrl) {
      const isXYZ = previewLayerUrl.includes('{z}/{x}/{y}');
      let layerToAdd;
      if (isXYZ) {
        layerToAdd = new TileLayer({
          zIndex: 0,
          source: new XYZ({
            url: previewLayerUrl,
            crossOrigin: 'anonymous'
          })
        });
      } else {
        layerToAdd = new WebGLTileLayer({
          zIndex: 0,
          source: new GeoTIFF({
            sources: [{ url: previewLayerUrl }],
          })
        })
      }

      mapInstance.addLayer(layerToAdd);
      previewLayerRef.current = layerToAdd;
    }

  }, [previewLayerUrl, mapInstance]); 

  
  // useEffect to update map when center or zoom change
  useEffect(() => {
    if (mapInstance) {
      // const view = mapInstance.getView();
      // view.setCenter(fromLonLat(center));
      // view.setZoom(zoom);
    }
  }, [center, zoom, mapInstance]);

  return (
      <MapContext.Provider value={{ 
        map: mapInstance, 
        bounds, 
        // addFireBoundary,
        addPreviewLayer,
        removePreviewLayer,
        addAnalysisLayer,
        analysisFire,
        setAnalysisFire,
        updateMapView: handleUpdateMapView, 
        selectedFire, setSelectedFire }}>
        <div className="app-container">
          <div className="sidebar">
            <h2>Configure Burn Severity Analysis</h2>
            <div>
              <h3>Select Fire</h3>
              <div style={{width: '100%'}}>
                <FireSelector_db
                  fires={displayedFires}
                  availableYears={availableYears}
                  onFireSelect={handleDbFireSelect}
                  onYearSelect={handleDbYearSelect}
                  selectedFire={selectedDbFire}
                  selectedYear={selectedYear}
                />
              </div>
              {/* This container will reserve space for all status messages */}
              <div className="fire-selector-status">
                {error && <p className="text-sm text-red-500">Error: {error}</p>}
                {selectedFire !== null && (
              <p><span>Ignition Date:</span> {new Date(selectedFire.ignitionDate).toLocaleDateString('en-CA')}</p>
                )}
              </div>
            </div>
            {selectedFire != null && <StacSearchPanel />}
          </div>
          <div className='center-panel'>
            <div className="map-container">
              <OLMap
                center={center}
                zoom={zoom}
                basemap={basemap}
                onMapInit={setMapInstance}
                onVisibleFiresChange={setVisibleFireNumbers}
                selectedDbFire={selectedDbFire}
                selectedDbYear={selectedYear}
                refreshTrigger={refreshTrigger}
              />
            </div>
            <div className="bcgov-basemap-selector">
              <BasemapSelector selectedBasemap={basemap} onBasemapChange={(newBasemap) => setBasemap(newBasemap)} />
            </div>
          </div>
        </div>
      </MapContext.Provider>
  );
};

const SeverityConfigurationPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className='App'>
      {isAuthenticated ? (
        <FireDataProvider>
          <ConfigurationApp />
        </FireDataProvider>
      ) : (
        <div>
          <p> Please log in to access the application.</p>
        </div>
      )}
    </div>
  );
};

export default SeverityConfigurationPage;