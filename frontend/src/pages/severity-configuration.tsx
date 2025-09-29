//src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import './severity-configuration.scss';
import { MapContext } from '../components/MapContext';
import StacSearchPanel from '../components/StacSearchPanel'
import { Fire } from '../components/FireSelector'

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { toLonLat, fromLonLat } from 'ol/proj';
import Layer from 'ol/layer/Layer';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import FireSelector from '../components/FireSelector';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import {all} from 'ol/loadingstrategy'
import VectorSource from 'ol/source/Vector';


const ConfigurationApp: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const [bounds, setBounds] = useState<any>(null); // OpenLayers doesn't use LngLatBounds
  const previewLayerRef = useRef<WebGLTileLayer | null>(null);
  const perimeterLayerRef = useRef<VectorLayer | null>(null);
  const [previewLayerUrl, setPreviewLayerUrl] = useState<string | null>(null);
  const [perimeterLayerUrl, setPerimeterLayerUrl] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number]>([-123.3656, 48.4284]);
  const [zoom, setZoom] = useState<number>(10);
  const [selectedFire, setSelectedFire] = useState<Fire | null>(null);
  
  const handleUpdateMapView = (newCenter: [number,number], newZoom: number) => {
    setCenter(newCenter)
    setZoom(newZoom);
  };

  const addPreviewLayer = (url: string) => {
    setPreviewLayerUrl(url);
  };

  const addFireBoundary = (fireNumber: string) => {
    const perimeterUrl = `https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP&outputFormat=application/json&srsName=EPSG:3857&CQL_FILTER=FIRE_NUMBER='${fireNumber}'`;
    setPerimeterLayerUrl(perimeterUrl);
    console.log('addFireBoundary:',fireNumber);
    
  };
  //useEffect for init of map
  useEffect(() => {
  if (!mapContainer.current) return; // Wait until ref is set
  if (mapInstance) return; // Prevent re-initialization
  
  const map = new Map({
    target: mapContainer.current as HTMLElement,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat(center),
      zoom: zoom,
    }),
  });

  setMapInstance(map);

  map.on('moveend', () => {
    const view = map.getView();
    const extent = view.calculateExtent();
    setBounds(extent);
    const newCenter = toLonLat(view.getCenter() || [0, 0]);
    setCenter(newCenter as [number, number]);
    setZoom(view.getZoom() || 0);
  });

  return () => {
    map.setTarget(undefined); // Clean up properly
  };
  }, [mapContainer]);

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
        source: new GeoTIFF({
          sources: [{ url: previewLayerUrl }],
        }),
      });

      mapInstance.addLayer(geoTiffLayer);
      previewLayerRef.current = geoTiffLayer;
    }

  }, [previewLayerUrl, mapInstance]); 
  // useEffect to manage the perimeter vectorLayer
  useEffect(() => {
    if (!mapInstance) return;
    

    if (perimeterLayerRef.current){
      mapInstance.removeLayer(perimeterLayerRef.current);
      perimeterLayerRef.current = null;
    }
    if (perimeterLayerUrl){
      console.log('Add vector Layer url:',perimeterLayerUrl);
      const perimterVectorSource = new VectorSource({
        format: new GeoJSON(),
        url: perimeterLayerUrl,
        strategy: all,
      });
      const perimeterLayer = new VectorLayer({
        source: perimterVectorSource,
        style: {
          'stroke-width': 2.5,
          'stroke-color': 'red',
        },
      });
      perimeterLayer.setZIndex(1000);
      mapInstance.addLayer(perimeterLayer);
      perimeterLayerRef.current = perimeterLayer;
    }
  }, [perimeterLayerUrl, mapInstance])
  // useEffect to update map when center or zoom change
  useEffect(() => {
    if (mapInstance) {
      const view = mapInstance.getView();
      view.setCenter(fromLonLat(center));
      view.setZoom(zoom);
    }
  }, [center, zoom, mapInstance]);
  return (
    <MapContext.Provider value={{ map: mapInstance, bounds, 
        addFireBoundary,addPreviewLayer,
        updateMapView: handleUpdateMapView, 
        selectedFire, setSelectedFire }}>
      <div className="app-container">
        <div className="sidebar">
          <FireSelector />
          <hr />
          <StacSearchPanel />
        </div>
        <div className="map-container" ref={mapContainer}></div>
      </div>
    </MapContext.Provider>
  );
};

export default ConfigurationApp;
