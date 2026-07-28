//src/pages/severity-configuration.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import './severity-configuration.scss';
import '../style.scss';
import './burn-severity.scss';
import { MapContext } from '../components/MapContext';
import StacSearchPanel from '../components/StacSearchPanel'

import { useAuth } from '../auth/AuthContext';
// import { Fire } from '../components/FireSelector'

import { Style, Fill, Stroke } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {all} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import MapOL from 'ol/Map';

// import FireSelector from '../components/FireSelector';
import FireSelector_db from '../components/ol-maps/FireSelector_db';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import { getFireData, getFireNumbers } from '../utils/apiService';
import { FireDataProvider, useFireData, FireOption} from '../components/FireDataContext';

import OLMap from '../components/ol-maps/OLMap';


const ConfigurationApp: React.FC = () => {
  const { selectedYear, setSelectedYear, firePointsGeoJSON } = useFireData();
  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<MapOL | null>(null);
  const [bounds, setBounds] = useState<any>(null); // OpenLayers doesn't use LngLatBounds
  const previewLayerRef = useRef<WebGLTileLayer | null>(null);
  // const perimeterLayerRef = useRef<VectorLayer | null>(null);
  const [previewLayerUrl, setPreviewLayerUrl] = useState<string | null>(null);
  // const [perimeterLayerUrl, setPerimeterLayerUrl] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number]>([-126.5, 54.5]);
  const [zoom, setZoom] = useState(5);
  const [basemap, setBasemap] = useState('osm');
  const [selectedFire, setSelectedFire] = useState<FireOption | null>(null);
  // const [fires, setFires] = useState<Fire[]>([]);
  const [analysisFire, setAnalysisFire] = useState<string | null>(null);
  const resultsLayerRef = useRef<VectorLayer | null>(null);
  const [resultsFeatureCollection, setResultsFeatureCollection] = useState<any | null>(null);
  const currentYear = String(new Date().getFullYear());
  const [visibleFireNumbers, setVisibleFireNumbers] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);


  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2000; y--) {
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
          incidentName: props.INCIDENT_NAME,
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
    setPreviewLayerUrl(url);
  };

  const removePreviewLayer = () => {
    setPreviewLayerUrl(null);
  };



  // const addFireBoundary = (fireNumber: string) => {
  //   const perimeterUrl = `https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP&outputFormat=application/json&srsName=EPSG:3857&CQL_FILTER=FIRE_NUMBER='${fireNumber}'`;
  //   // setPerimeterLayerUrl(perimeterUrl);
  //   console.log('addFireBoundary:',fireNumber);
    
  // };


  const fetchAndDisplayBurnGeometry = useCallback(async (fireNumber: string) => {
    if (!mapInstance) return;
    try {
      const featureCollection = await getFireData(selectedYear, fireNumber);
      
      setResultsFeatureCollection(featureCollection);

      if (resultsLayerRef.current) {
        mapInstance.removeLayer(resultsLayerRef.current);
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
      newLayer.setOpacity(0.6);
      mapInstance.addLayer(newLayer);
      resultsLayerRef.current = newLayer;

      if (vectorSource.getFeatures().length > 0) {
        const extent = vectorSource.getExtent();
        //fitMapToExtent(extent);
      }
    } catch (error) {
      console.error('Failed to fetch or display burn geometry:', error);
      if (resultsLayerRef.current) {
        mapInstance.removeLayer(resultsLayerRef.current);
        resultsLayerRef.current = null;
      }
    }
  }, [mapInstance, selectedYear]);

  const addAnalysisLayer = useCallback(() => {
    if (!mapInstance) return;

    if (selectedFire && selectedFire.fireNumber) {
      fetchAndDisplayBurnGeometry(selectedFire.fireNumber);
    }
  }, [mapInstance, selectedFire, fetchAndDisplayBurnGeometry]);

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
      const geoTiffLayer = new WebGLTileLayer({
        zIndex: 0,
        source: new GeoTIFF({
          sources: [{ url: previewLayerUrl }],
        })
      });

      mapInstance.addLayer(geoTiffLayer);
      previewLayerRef.current = geoTiffLayer;
    }

  }, [previewLayerUrl, mapInstance]); 

  // // useEffect to manage the perimeter vectorLayer
  // useEffect(() => {
  //   if (!mapInstance) return;

  //   if (perimeterLayerRef.current){
  //     mapInstance.removeLayer(perimeterLayerRef.current);
  //     perimeterLayerRef.current = null;
  //   }
  //   if (perimeterLayerUrl){
  //     console.log('Add vector Layer url:',perimeterLayerUrl);
  //     const perimterVectorSource = new VectorSource({
  //       format: new GeoJSON(),
  //       url: perimeterLayerUrl,
  //       strategy: all,
  //     });
  //     const perimeterLayer = new VectorLayer({
  //       source: perimterVectorSource,
  //       style: {
  //         'stroke-width': 2.5,
  //         'stroke-color': 'red',
  //       },
  //     });
  //     perimeterLayer.setZIndex(1000);
  //     mapInstance.addLayer(perimeterLayer);
  //     perimeterLayerRef.current = perimeterLayer;
  //     perimterVectorSource.on('featuresloadend', () => {
  //       const extent = perimterVectorSource.getExtent();
  //       fitMapToExtent(extent);
  //     });
  //   }
  // }, [perimeterLayerUrl, mapInstance,fitMapToExtent])


  // useEffect to update map when center or zoom change
  useEffect(() => {
    if (mapInstance) {
      // const view = mapInstance.getView();
      // view.setCenter(fromLonLat(center));
      // view.setZoom(zoom);
    }
  }, [center, zoom, mapInstance]);

  // useEffect to update map with analysis results
  useEffect(() => {
    if (!mapInstance) return;

    // This effect runs when a new fire is selected, or when an analysis is triggered.
    console.log('selectedFire', selectedFire)
    if (selectedFire && selectedFire.fireNumber) {
      fetchAndDisplayBurnGeometry(selectedFire.fireNumber);
    } else {
      // If no fire is selected, clear the results layer.
      if (resultsLayerRef.current) {
        mapInstance.removeLayer(resultsLayerRef.current);
        resultsLayerRef.current = null;
      }
    }
  }, [selectedFire,analysisFire, fetchAndDisplayBurnGeometry, mapInstance]);
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