import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Vector as VectorLayer } from 'ol/layer';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { fromLonLat, transform, transformExtent, get as getProjection } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import ScaleLine from 'ol/control/ScaleLine';
import ImageLayer from 'ol/layer/Image';
import TileWMS from 'ol/source/TileWMS';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import Point from 'ol/geom/Point';
import XYZSource from 'ol/source/XYZ';
import { unByKey } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import StacMetadataDisplay from './StacMetadataDisplay';
import { NBRCalculator } from './NBRCalculator';

// Define constants for projections
const WEB_MERCATOR = 'EPSG:3857';
const WGS84 = 'EPSG:4326';
const BC_ALBERS = 'EPSG:3005';

// BC Albers projection definition
proj4.defs(BC_ALBERS, '+proj=aea +lat_0=45 +lon_0=-126 +lat_1=50 +lat_2=58.5 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs');
register(proj4);

// Helper function to detect and convert coordinates from BC Albers to Web Mercator
const convertBCCoordinates = (coords: number[]): number[] => {
  if (coords && coords.length === 2) {
    // Check if these look like BC Albers coordinates (they're typically large numbers in the millions)
    // BC Albers coordinates are typically around this range: [1000000, 1000000]
    if (coords[0] > 100000 && coords[0] < 2000000 && coords[1] > 100000 && coords[1] < 2000000) {
      console.log('Detected BC Albers coordinates, converting to Web Mercator');
      // Convert from BC Albers to Web Mercator
      return transform(coords, BC_ALBERS, WEB_MERCATOR);
    } 
    // Otherwise, assume WGS84 (lon/lat) and convert those to Web Mercator
    else if (coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90) {
      console.log('Detected WGS84 coordinates, converting to Web Mercator');
      return fromLonLat(coords);
    }
    // If neither format is detected, log a warning and return as is
    else {
      console.warn('Unrecognized coordinate format:', coords);
      return coords;
    }
  }
  return coords;
};

// Interface for STAC item
interface StacItem {
  assets: {
    [key: string]: {
      href: string;
      type: string;
      title?: string;
      roles?: string[];
    }
  };
  properties: {
    datetime: string;
    'eo:cloud_cover': number;
    'gsd'?: number;
    'eo:bands'?: Array<{name: string, common_name?: string}>;
    'proj:epsg'?: number;
    [key: string]: any;
  };
  links: any[];
  geometry: any;
  id: string;
  bbox: number[];
  collection: string;
  stac_version: string;
  stac_extensions?: string[];
}

interface ImageMetadata {
  date: string | null;
  cloudCover: number | null;
  collection: string | null;
  source: string | null;
  resolution: string | null;
  bandInfo: string | null;
  assetType: string | null;
}

interface Fire {
  id: string;
  fireNumber: string;
  geometry: any;
  extent: number[];
  olGeometry?: Geometry;
  properties?: any;
}

interface OLMapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  basemap?: string;
  onFiresLoaded?: (fires: Fire[]) => void;
  onDbFiresLoaded?: (dbFires: any[]) => void; // Add callback for database fires
  selectedFire?: string | null;
  showSatelliteImagery?: boolean;
  showNBR?: boolean;
  visualCogUrl?: string | null;
  stacItemUrl?: string | null;
  onNbrLoadingChange?: (loading: boolean) => void;
  onFireSelect?: (fireProperties: any | null) => void; // Add new callback prop
  showPreBurnImagery?: boolean;
  showPostBurnImagery?: boolean;
  ignitionDate?: string | null;
  fireOutDate?: string | null;
  // New props for pre-burn date selection
  onPreBurnDates?: (dates: string[]) => void;
  selectedPreBurnDate?: string | null;
  // Add post-burn props
  onPostBurnDates?: (dates: string[]) => void;
  selectedPostBurnDate?: string | null;
  // --- Add these for pre-burn COGs ---
  preBurnVisualUrl?: string | null;
  preBurnNirUrl?: string | null;
  preBurnSwirUrl?: string | null;
  preBurnMetadata?: any | null; // <-- Add this line
}

const OLMap: React.FC<OLMapProps> = ({
  center = [-123.3656, 48.4284], // Default to Victoria, BC
  zoom = 6,
  basemap = 'osm',
  onFiresLoaded,
  onDbFiresLoaded, // Add callback for database fires
  selectedFire,
  showSatelliteImagery = false,
  showNBR = false,
  visualCogUrl = null,
  stacItemUrl = null,
  onNbrLoadingChange,
  onFireSelect, // Destructure the new prop
  showPreBurnImagery = false,
  showPostBurnImagery = false,
  ignitionDate = null,
  fireOutDate = null,
  onPreBurnDates,
  selectedPreBurnDate,
  // Add post-burn props
  onPostBurnDates,
  selectedPostBurnDate,
  // --- Add these for pre-burn COGs ---
  preBurnVisualUrl = null,
  preBurnNirUrl = null,
  preBurnSwirUrl = null,
  preBurnMetadata = null // <-- Add this line
}) => {
  // Create refs and state
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [fires, setFires] = useState<Fire[]>([]);
  
  // State for database fires (used for FireSelector_db)
  const [dbFires, setDbFires] = useState<any[]>([]);
  const firesLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const firePerimetersLayerRef = useRef<TileLayer<TileWMS> | null>(null);
  const satelliteLayerRef = useRef<WebGLTileLayer | null>(null);
  const [sentinelUrl, setSentinelUrl] = useState<string | null>(null);
  const [isLoadingImagery, setIsLoadingImagery] = useState<boolean>(false);
  
  // Add state for NIR and SWIR URLs
  const [nirUrl, setNirUrl] = useState<string | null>(null);
  const [swirUrl, setSwirUrl] = useState<string | null>(null);
  
  // Enhanced metadata state
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({
    date: null,
    cloudCover: null,
    collection: null,
    source: null,
    resolution: null,
    bandInfo: null,
    assetType: null
  });
  
  // Store two separate extents: one for the current view and one for calculation
  const moveEndListenerRef = useRef<EventsKey | null>(null);
  const [currentMapExtent, setCurrentMapExtent] = useState<number[] | null>(null);
  // New ref and state to store the NBR calculation extent separately
  const initialNbrExtentRef = useRef<number[] | null>(null);
  const [nbrCalculationExtent, setNbrCalculationExtent] = useState<number[] | null>(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

  // Use a ref to store the image cache
  const imageCache = useRef<Record<string, WebGLTileLayer>>({});

  // Use a ref to store the last valid view state
  const lastValidViewRef = useRef<{ center: number[]; zoom: number }>({
    center: fromLonLat(center),
    zoom: zoom
  });

  // New state for available pre-burn and post-burn dates
  const [preBurnDates, setPreBurnDates] = useState<string[]>([]);
  const [postBurnDates, setPostBurnDates] = useState<string[]>([]);

  // Helper function to extract band information from STAC item
  const extractBandInfo = (stacItem: StacItem): string | null => {
    if (stacItem.properties['eo:bands']) {
      return stacItem.properties['eo:bands']
        .map(band => band.common_name || band.name)
        .join(', ');
    }
    // Default band info for Sentinel-2 visual
    if (stacItem.collection.includes('sentinel-2')) {
      return 'RGB (true color)';
    }
    return null;
  };

  // Function to add COG imagery to the map - enhanced version
  const addCogImageryToMap = useCallback((url: string, metadata?: ImageMetadata) => {
    if (!mapInstanceRef.current) return;

    // Remove existing satellite layer if it exists
    if (satelliteLayerRef.current) {
      mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
      satelliteLayerRef.current = null;
    }

    // Always clear the cache for this url to force reload on dropdown change
    if (imageCache.current[url]) {
      delete imageCache.current[url];
    }

    try {
      // Choose the appropriate tiler service based on URL pattern or COG type
      let tileUrl: string;
      
      if (url.includes('sentinel-s2-l2a') || url.includes('sentinel-2')) {
        // Sentinel-2 specific handling with custom rendering params for better visualization
        tileUrl = `https://tiles.rdnt.io/tiles/{z}/{x}/{y}@1x?url=${encodeURIComponent(url)}&rescale=0,3000&colormap_name=viridis`;
      } else if (url.includes('landsat')) {
        // Landsat imagery might need different rendering parameters
        tileUrl = `https://tiles.rdnt.io/tiles/{z}/{x}/{y}@1x?url=${encodeURIComponent(url)}&rescale=0,10000`;
      } else {
        // Default case for other COGs - using a standard tiler
        tileUrl = `https://tiles.rdnt.io/tiles/{z}/{x}/{y}@1x?url=${encodeURIComponent(url)}`;
      }
      
      console.log('Using tile URL:', tileUrl);
      
      // Create a new XYZ source for the COG through the tiler service
      const cogSource = new XYZSource({
        url: tileUrl,
        attributions: '© Satellite Imagery',
        crossOrigin: 'anonymous',
        maxZoom: 18
      });
      
      // Create a new tile layer with the COG source
      const cogLayer = new TileLayer({
        source: cogSource,
        opacity: 1, // Set opacity to fully opaque
        zIndex: 3 // Below the fire perimeters but above the base map
      });
      
      // Add the layer to the map
      mapInstanceRef.current.addLayer(cogLayer);
      
      // Store the layer in the ref and cache
      satelliteLayerRef.current = cogLayer as unknown as WebGLTileLayer;
      imageCache.current[url] = satelliteLayerRef.current;
      
      // If metadata is provided, update the metadata state
      if (metadata) {
        setImageMetadata(metadata);
        setShowMetadata(true);
      }
      
    } catch (error) {
      console.error('Error adding COG imagery to map:', error);
    }
  }, []);

  // Function to fetch Sentinel-2 imagery from STAC API based on the current map extent
  const fetchSentinelImagery = useCallback(async (extent: number[], options?: { date?: { lte?: string, gte?: string }, limit?: number, sort?: 'asc' | 'desc' }) => {
    if (!extent || extent.length !== 4 || !extent.every(coord => isFinite(coord))) {
      console.warn('Invalid extent for STAC query:', extent);
      return;
    }

    try {
      setIsLoadingImagery(true);
      
      // Clear metadata when starting a new query
      setImageMetadata({
        date: null,
        cloudCover: null,
        collection: null,
        source: null,
        resolution: null,
        bandInfo: null,
        assetType: null
      });

      // Reset band URLs
      setNirUrl(null);
      setSwirUrl(null);

      // Convert from Web Mercator to WGS84 for the STAC API
      const bbox = transformExtent(extent, WEB_MERCATOR, WGS84);

      // Format bbox as [minX, minY, maxX, maxY] - STAC API expects [west, south, east, north]
      const stacBbox = [
        Math.min(bbox[0], bbox[2]), // west
        Math.min(bbox[1], bbox[3]), // south
        Math.max(bbox[0], bbox[2]), // east
        Math.max(bbox[1], bbox[3])  // north
      ];

      console.log('STAC query bbox (WGS84):', stacBbox);

      const query: any = { "eo:cloud_cover": { lte: 30 } };
      if (options?.date) {
        if (options.date.lte) query["datetime"] = { lte: options.date.lte };
        if (options.date.gte) query["datetime"] = { gte: options.date.gte };
      }
      const sortby = [{ field: "properties.datetime", direction: options?.sort === 'asc' ? 'asc' : 'desc' }];
      const limit = options?.limit || 1;

      const response = await fetch('https://earth-search.aws.element84.com/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collections: ["sentinel-2-l2a"],
          bbox: stacBbox,
          query,
          sortby,
          limit
        })
      });

      if (!response.ok) {
        throw new Error(`STAC API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('STAC API response:', data);

      if (data.features && data.features.length > 0) {
        const stacItem: StacItem = data.features[0];
        
        // Find the visual asset
        if (stacItem.assets && stacItem.assets.visual && stacItem.assets.visual.href) {
          const visualUrl = stacItem.assets.visual.href;
          console.log('Found Sentinel-2 visual URL:', visualUrl);
          
          // Store NIR (B08) and SWIR (B11/B12) URLs
          if (stacItem.assets.nir || stacItem.assets.nir08 || stacItem.assets.B08) {
            const nirB08Url = 
              (stacItem.assets.nir && stacItem.assets.nir.href) ||
              (stacItem.assets.nir08 && stacItem.assets.nir08.href) ||
              (stacItem.assets.B08 && stacItem.assets.B08.href);
            
            if (nirB08Url) {
              console.log('NIR (B08) COG URL:', nirB08Url);
              setNirUrl(nirB08Url);
            }
          }
          
          // For SWIR, try all possible bands - B12 (SWIR2), B11 (SWIR1), or generically named "swir"
          if (stacItem.assets.swir22 && stacItem.assets.swir22.href) {
            const swirB12Url = stacItem.assets.swir22.href;
            console.log('SWIR2 (B12) COG URL:', swirB12Url);
            setSwirUrl(swirB12Url);
          } else if (stacItem.assets.swir16 && stacItem.assets.swir16.href) {
            const swirB11Url = stacItem.assets.swir16.href;
            console.log('SWIR1 (B11) COG URL:', swirB11Url);
            setSwirUrl(swirB11Url);
          } else if (stacItem.assets.swir && stacItem.assets.swir.href) {
            const swirUrl = stacItem.assets.swir.href;
            console.log('SWIR COG URL:', swirUrl);
            setSwirUrl(swirUrl);
          } else if (stacItem.assets.B12 && stacItem.assets.B12.href) {
            const swirB12Url = stacItem.assets.B12.href;
            console.log('B12 (SWIR2) COG URL:', swirB12Url);
            setSwirUrl(swirB12Url);
          } else if (stacItem.assets.B11 && stacItem.assets.B11.href) {
            const swirB11Url = stacItem.assets.B11.href;
            console.log('B11 (SWIR1) COG URL:', swirB11Url);
            setSwirUrl(swirB11Url);
          }
          
          // Extract and store metadata
          const metadata: ImageMetadata = {
            date: stacItem.properties.datetime || null,
            cloudCover: stacItem.properties['eo:cloud_cover'] || null,
            collection: stacItem.collection || null,
            source: 'Sentinel-2',
            resolution: stacItem.properties.gsd ? `${stacItem.properties.gsd}m` : '10m',
            bandInfo: extractBandInfo(stacItem),
            assetType: stacItem.assets.visual.title || 'Visual'
          };
          
          setImageMetadata(metadata);
          setSentinelUrl(visualUrl);
          setShowMetadata(true);
          
          // Add the imagery to the map
          addCogImageryToMap(visualUrl, metadata);
        } else {
          console.warn('No visual asset found in STAC item:', stacItem);
          setSentinelUrl(null);
          setShowMetadata(false);
        }
      } else {
        console.warn('No Sentinel-2 imagery found for the given extent');
        setSentinelUrl(null);
        setShowMetadata(false);
      }
    } catch (error) {
      console.error('Error fetching Sentinel-2 imagery:', error);
      setSentinelUrl(null);
      setShowMetadata(false);
    } finally {
      setIsLoadingImagery(false);
    }
  }, [addCogImageryToMap]);
  
  // fetch data from hosted db
  const fetchFiresFromDB = useCallback(async () => {
    try {
      console.log('Fetching fires from database...');
      
      // Try to fetch data with mode: 'cors' instead of credentials: 'include'
      // This is often more compatible with simple dev setups
      const response = await fetch('/burn-records/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
        // Remove mode: 'cors' when using the proxy
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch fires: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Database fires data:', data);
      
      // Transform data to match FireSelector_db's expected format
      const formattedFires = data.map((item: any) => ({
        id: item.id.toString(),
        fireNumber: item.fire_number,
        pre_image_date: item.pre_image_date,
        post_image_date: item.post_image_date,
        severty_class: item.severity_class || 'Unknown'
      }));
      
      console.log('Formatted fires for selector:', formattedFires);
      return formattedFires;
    } catch (error) {
      console.error('Error fetching fires from database:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('CORS error detected. Your backend needs CORS headers configured.');
        console.warn('Add this to your FastAPI backend:');
        console.warn(`
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
        `);
        
        // Return sample data for development when CORS fails
        console.log('Returning sample data for development');
        const sampleData = [
          { id: '1', fireNumber: 'V92294', pre_image_date: '2017-08-27', post_image_date: '2017-08-27', severty_class: 'Medium' },
          { id: '2', fireNumber: 'V92294', pre_image_date: '2017-08-27', post_image_date: '2017-08-27', severty_class: 'Medium' },
          { id: '3', fireNumber: 'V92294', pre_image_date: '2017-08-27', post_image_date: '2017-08-27', severty_class: 'Unburned' },
          { id: '4', fireNumber: 'V92294', pre_image_date: '2017-08-27', post_image_date: '2017-08-27', severty_class: 'Low' },
          { id: '5', fireNumber: 'V92294', pre_image_date: '2017-08-27', post_image_date: '2017-08-27', severty_class: 'Low' }
        ];
        return sampleData;
      }
      
      return [];
    }
  }, []);

  // Function to fetch fire data (now fire points)
  const fetchFireData = useCallback(async () => {
    try {
      // Fetch fire points (current fire locations)
      const response = await fetch(
        'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application%2Fjson&srsName=EPSG:3857'
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch fire points: ${response.statusText}`);
      }

      const data = await response.json();
      const fireFeatures = data.features.map((feature: any) => {
        const properties = feature.properties;
        let geometry = feature.geometry;
        const olFeature = new GeoJSON().readFeature(feature) as Feature<Geometry>;
        const geom = olFeature.getGeometry();
        let extent = [0, 0, 0, 0];
        if (geom) {
          try {
            extent = geom.getExtent();
            // For point features, create a 2km buffer
            if (geometry.type === 'Point') {
              const coords = geometry.coordinates;
              extent = [
                coords[0] - 2000,
                coords[1] - 2000,
                coords[0] + 2000,
                coords[1] + 2000
              ];
            }
            if (!isFinite(extent[0]) || !isFinite(extent[1]) || !isFinite(extent[2]) || !isFinite(extent[3])) {
              extent = [0, 0, 0, 0];
            }
          } catch (e) {
            extent = [0, 0, 0, 0];
          }
        }
        return {
          id: feature.id,
          fireNumber: properties.FIRE_NUMBER, // Confirm this property exists in fire points schema
          geometry: geometry,
          extent: extent,
          olGeometry: geom,
          properties: properties
        };
      });
      setFires(fireFeatures);
      if (onFiresLoaded) {
        onFiresLoaded(fireFeatures);
      }
      // Add fire points as a vector layer if not already present
      if (!firesLayerRef.current && mapInstanceRef.current) {
        const vectorSource = new VectorSource({
          features: data.features.map((feature: any) => {
            const olFeature = new GeoJSON().readFeature(feature) as Feature<Geometry>;
            if (feature.geometry.type === 'Point') {
              const geom = olFeature.getGeometry();
              if (geom) {
                try {
                  const coords = feature.geometry.coordinates;
                  olFeature.setGeometry(new Point(coords));
                } catch (e) {}
              }
            }
            return olFeature;
          })
        });
        firesLayerRef.current = new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'red' }),
              stroke: new Stroke({ color: 'white', width: 2 })
            })
          }),
          zIndex: 200 // Fire points always on top
        });
        mapInstanceRef.current.addLayer(firesLayerRef.current);
      } else if (firesLayerRef.current) {
        // If already present, update zIndex and ensure visible
        firesLayerRef.current.setZIndex(200);
        firesLayerRef.current.setVisible(true);
      }
    } catch (error) {
      console.error('Error fetching fire points:', error);
    }
  }, [onFiresLoaded]);

  // New function to fetch available pre-burn dates only
  const fetchPreBurnDates = useCallback(async (extent: number[], ignition: string) => {
    // Convert from Web Mercator to WGS84 for the STAC API
    const bbox = transformExtent(extent, WEB_MERCATOR, WGS84);
    const stacBbox = [
      Math.min(bbox[0], bbox[2]),
      Math.min(bbox[1], bbox[3]),
      Math.max(bbox[0], bbox[2]),
      Math.max(bbox[1], bbox[3])
    ];
    const query: any = { "eo:cloud_cover": { lte: 30 }, "datetime": { lte: ignition } };
    const sortby = [{ field: "properties.datetime", direction: 'desc' }];
    const limit = 10;
    const response = await fetch('https://earth-search.aws.element84.com/v1/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collections: ["sentinel-2-l2a"],
        bbox: stacBbox,
        query,
        sortby,
        limit
      })
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features.map((f: any) => f.properties.datetime).filter(Boolean);
    }
    return [];
  }, []);

  // Helper function to check if backend is accessible
  const checkBackendConnection = useCallback(async () => {
    try {
      // Use a relative URL to leverage the proxy configuration in package.json
      const response = await fetch('/', {
        method: 'GET',
        // Remove mode: 'cors' as it's not needed with proxy
      });
      
      console.log('Backend connection test result:', response.ok ? 'Success' : 'Failed');
      return response.ok;
    } catch (error) {
      console.error('Backend connection test error:', error);
      return false;
    }
  }, []);

  // Effect to initialize the map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let baseLayer: TileLayer<OSM | XYZ>;

    if (basemap === 'osm') {
      baseLayer = new TileLayer({
        source: new OSM()
      });
    } else {
      baseLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        })
      });
    }

    const initialMap = new Map({
      target: mapRef.current,
      layers: [baseLayer],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom
      })
    });

    // Store initial view state
    lastValidViewRef.current = {
      center: fromLonLat(center),
      zoom: zoom
    };

    // Add scale line control
    initialMap.addControl(new ScaleLine());

    // Add WMS layer for fire perimeters - Use layer name without 'pub:' prefix
    const firePerimetersSource = new TileWMS({
      url: 'https://openmaps.gov.bc.ca/geo/pub/wms',
      params: {
        LAYERS: 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        VERSION: '1.1.1'
      },
      serverType: 'geoserver',
      transition: 0
    });

    const firePerimetersLayer = new TileLayer({
      source: firePerimetersSource,
      opacity: 0.7,
      zIndex: 100 // Perimeters below fire points, above imagery
    });

    initialMap.addLayer(firePerimetersLayer);
    firePerimetersLayerRef.current = firePerimetersLayer;
    firePerimetersLayer.setZIndex(100); // Always below fire points, above imagery

    // Add a map view change event listener to store valid view states
    initialMap.getView().on('change', function () {
      const center = initialMap.getView().getCenter();
      const zoom = initialMap.getView().getZoom();

      // Only store if valid values
      if (center && zoom && center.every((coord) => isFinite(coord))) {
        lastValidViewRef.current = {
          center: center,
          zoom: zoom || 6
        };
      }
    });

    // Store the current map extent when the map stops moving
    moveEndListenerRef.current = initialMap.on('moveend', () => {
      const extent = initialMap.getView().calculateExtent(initialMap.getSize());
      setCurrentMapExtent(extent);
    });

    // Initial extent
    const initialExtent = initialMap.getView().calculateExtent(initialMap.getSize());
    setCurrentMapExtent(initialExtent);

    mapInstanceRef.current = initialMap;

    // Fetch fire data when map is initialized
    fetchFireData();
    
    // Also fetch fires from database for FireSelector_db
    // First check if we can connect to the backend
    checkBackendConnection().then(isConnected => {
      if (isConnected) {
        console.log('Backend is accessible, fetching fire data');
      } else {
        console.warn('Backend seems inaccessible, will attempt fetch anyway but may fail');
      }
      
      // Proceed with fetching fires regardless
      fetchFiresFromDB()
        .then(dbFiresData => {
          console.log('Successfully fetched database fires');
          setDbFires(dbFiresData);
          // Call the callback if it exists
          if (onDbFiresLoaded) {
            onDbFiresLoaded(dbFiresData);
          }
        })
        .catch(error => {
          console.error('Failed to fetch database fires:', error);
        });
    });

    // Cleanup function
    return () => {
      if (moveEndListenerRef.current) {
        unByKey(moveEndListenerRef.current);
      }
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }

      // Clear image cache
      imageCache.current = {};
    };
  }, []); // Empty dependency array to ensure the map is only created once

  // Effect to update the map view when center or zoom changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const view = mapInstanceRef.current.getView();
    view.setCenter(fromLonLat(center));
    view.setZoom(zoom);

    // Update last valid view
    lastValidViewRef.current = {
      center: fromLonLat(center),
      zoom: zoom
    };
  }, [center, zoom]);

  // Effect to handle basemap changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const layers = map.getLayers();
    const baseLayerIndex = 0; // Assume base layer is always the first layer

    let newBaseLayer: TileLayer<OSM | XYZ>;
    if (basemap === 'osm') {
      newBaseLayer = new TileLayer({
        source: new OSM()
      });
    } else {
      newBaseLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        })
      });
    }

    // Replace the base layer
    layers.removeAt(baseLayerIndex);
    layers.insertAt(baseLayerIndex, newBaseLayer);
  }, [basemap]);

  // Effect to handle pre-burn and post-burn/current imagery toggles
  useEffect(() => {
    // Helper to get buffered extent for selected fire
    const getBufferedExtent = () => {
      if (selectedFire) {
        const selectedFireObj = fires.find(fire => fire.fireNumber === selectedFire);
        if (selectedFireObj && selectedFireObj.extent && selectedFireObj.extent.length === 4 && selectedFireObj.extent.every(coord => isFinite(coord))) {
          const bufferSize = 10000;
          return [
            selectedFireObj.extent[0] - bufferSize,
            selectedFireObj.extent[1] - bufferSize,
            selectedFireObj.extent[2] + bufferSize,
            selectedFireObj.extent[3] + bufferSize
          ];
        }
      }
      return currentMapExtent;
    };

    // Helper to build date string for STAC
    const formatDate = (date: string | null | undefined) => {
      if (!date) return null;
      return new Date(date).toISOString().split('T')[0];
    };

    // Pre-burn: fetch available dates only when fire/toggle changes
    if (showPreBurnImagery) {
      const bbox = getBufferedExtent();
      const ignition = formatDate(ignitionDate);
      // Only fetch date list if not already loaded for this fire
      if (bbox && ignition && preBurnDates.length === 0) {
        fetchPreBurnDates(bbox, ignition).then((dates: string[]) => {
          setPreBurnDates(dates);
          if (onPreBurnDates) onPreBurnDates(dates);
        });
      }
      // Only fetch the most recent image if no date is selected
    } else if (showPostBurnImagery) {
      // Post-burn: fetch last 10 images after fire out date (if present)
      const bbox = getBufferedExtent();
      const fireOut = formatDate(fireOutDate);
      if (bbox && fireOut && postBurnDates.length === 0) {
        // Fetch last 10 post-burn dates
        fetch('https://earth-search.aws.element84.com/v1/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collections: ["sentinel-2-l2a"],
            bbox,
            query: { "eo:cloud_cover": { lte: 30 }, "datetime": { gte: fireOut } },
            sortby: [{ field: "properties.datetime", direction: 'desc' }],
            limit: 10
          })
        })
          .then(res => res.json())
          .then(json => {
            const dates = (json.features || []).map((f: any) => f.properties.datetime).filter(Boolean);
            setPostBurnDates(dates);
            if (onPostBurnDates) onPostBurnDates(dates);
          });
      }
      // Only fetch the most recent image if no date is selected
      if (bbox && fireOut && !selectedPostBurnDate) {
        fetchSentinelImagery(bbox, {
          date: { gte: fireOut },
          limit: 1,
          sort: 'desc'
        });
      }
    } else {
      // Hide satellite imagery when both toggles are off
      if (mapInstanceRef.current && satelliteLayerRef.current) {
        mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
        satelliteLayerRef.current = null;
        setShowMetadata(false);
        setSentinelUrl(null);
        setNirUrl(null);
        setSwirUrl(null);
      }
    }
  }, [showPreBurnImagery, showPostBurnImagery, ignitionDate, fireOutDate, selectedFire, fires, currentMapExtent, selectedPreBurnDate, selectedPostBurnDate, preBurnDates.length, postBurnDates.length]);

  // Reset NBR calculation extent when fire or imagery changes
  useEffect(() => {
    // When the selected fire or imagery changes, we want to reset the NBR calculation extent
    initialNbrExtentRef.current = null;
    setNbrCalculationExtent(null);
  }, [selectedFire, sentinelUrl]);

  // Effect to handle fire selection
  useEffect(() => {
    if (!mapInstanceRef.current || fires.length === 0) return;

    // Update WMS fire perimeters layer if needed
    if (firePerimetersLayerRef.current) {
      const source = firePerimetersLayerRef.current.getSource();

      if (source) {
        if (selectedFire) {
          // Debug: Print all attributes of selected fire to console
          const selectedFireObj = fires.find(
            (fire) => fire.fireNumber === selectedFire
          );
          if (selectedFireObj) {
            console.log('Selected Fire Details:');
            console.log('Fire Number:', selectedFireObj.fireNumber);
            console.log('Fire ID:', selectedFireObj.id);
            console.log('Extent:', selectedFireObj.extent);
            console.log('Geometry:', selectedFireObj.geometry);
            if (
              selectedFireObj.geometry &&
              selectedFireObj.geometry.coordinates
            ) {
              console.log(
                'Coordinates:',
                selectedFireObj.geometry.coordinates
              );
              console.log('Geometry Type:', selectedFireObj.geometry.type);
            }
            console.log('OpenLayers Geometry:', selectedFireObj.olGeometry);
            console.log('All Properties:', selectedFireObj.properties);
            
            // Pass fire properties to parent component if callback exists
            if (onFireSelect && selectedFireObj.properties) {
              onFireSelect(selectedFireObj.properties);
            }

            // Print the CQL filter we're about to use
            console.log('CQL Filter:', `FIRE_NUMBER='${selectedFire}'`);
          }

          try {
            // Apply CQL Filter to the WMS layer
            source.updateParams({
              CQL_FILTER: `FIRE_NUMBER='${selectedFire}'`,
              VERSION: '1.1.1'
            });
          } catch (error) {
            console.error('Error updating WMS parameters:', error);
          }
        } else {
          try {
            // Clear CQL_FILTER to show all fire perimeters
            source.updateParams({
              CQL_FILTER: null,
              VERSION: '1.1.1'
            });
          } catch (error) {
            console.error('Error clearing WMS parameters:', error);
          }
        }

        // Debug: Print the current WMS URL with parameters
        const urls = source.getUrls();
        console.log(
          'WMS URL:',
          urls && urls.length > 0 ? urls[0] : 'No URL'
        );
        console.log('WMS Parameters:', source.getParams());
      }
    }

    // Find the selected fire and zoom to it
    if (selectedFire) {
      const selectedFireObj = fires.find(
        (fire) => fire.fireNumber === selectedFire
      );

      if (selectedFireObj) {
        try {
          if (
            selectedFireObj.geometry &&
            selectedFireObj.geometry.type === 'Point' &&
            selectedFireObj.geometry.coordinates &&
            selectedFireObj.geometry.coordinates.length === 2
          ) {
            // Get original coordinates
            const originalCoords = selectedFireObj.geometry.coordinates;
            console.log('Original coordinates from GeoJSON:', originalCoords);
            
            // Convert the coordinates to Web Mercator using our helper function
            const webMercatorCoords = convertBCCoordinates(originalCoords);
            console.log('Converted coordinates for Web Mercator:', webMercatorCoords);
            
            // Check if the conversion worked (no NaN values)
            if (webMercatorCoords.every(coord => typeof coord === 'number' && isFinite(coord))) {
              // Set the map view to center on these coordinates with a moderate zoom level
              mapInstanceRef.current.getView().animate({
                center: webMercatorCoords,
                zoom: 12,
                duration: 1000
              });
            } else {
              // If conversion failed, use the last valid view
              console.warn('Coordinate conversion failed, using last valid view');
              if (lastValidViewRef.current) {
                mapInstanceRef.current.getView().animate({
                  center: lastValidViewRef.current.center,
                  zoom: lastValidViewRef.current.zoom,
                  duration: 1000
                });
              }
            }
          } else if (
            selectedFireObj.extent &&
            selectedFireObj.extent.length === 4 &&
            selectedFireObj.extent.every(
              (coord) => typeof coord === 'number' && isFinite(coord)
            )
          ) {
            // If we have a valid extent, use it for zooming
            console.log('Using extent for zoom:', selectedFireObj.extent);

            mapInstanceRef.current.getView().fit(selectedFireObj.extent, {
              padding: [50, 50, 50, 50],
              duration: 1000,
              maxZoom: 14
            });
          } else {
            console.warn('No valid geometry or extent for fire:', selectedFire);

            // Reset to last valid view state if we can't zoom to the fire
            if (lastValidViewRef.current) {
              mapInstanceRef.current.getView().animate({
                center: lastValidViewRef.current.center,
                zoom: lastValidViewRef.current.zoom,
                duration: 1000
              });
            }
          }
        } catch (error) {
          console.error('Error while zooming to fire:', error);

          // If all else fails, reset view to last valid state
          if (lastValidViewRef.current) {
            mapInstanceRef.current.getView().animate({
              center: lastValidViewRef.current.center,
              zoom: lastValidViewRef.current.zoom,
              duration: 1000
            });
          }
        }
      }
    }
  }, [selectedFire, fires]);

  // Add map click handler to select fire by clicking a point
  useEffect(() => {
    if (!mapInstanceRef.current || !firesLayerRef.current) return;
    const map = mapInstanceRef.current;
    const firesLayer = firesLayerRef.current;

    // Handler for map clicks
    const handleMapClick = (evt: any) => {
      let foundFire: string | null = null;
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === firesLayer) {
          // Find the fireNumber for this feature
          const fireNumber = feature.get('FIRE_NUMBER') || feature.get('fireNumber');
          if (fireNumber) {
            foundFire = fireNumber as string;
            return true; // Stop iteration
          }
        }
        return false;
      });
      if (foundFire) {
        // Call the fire select logic (update selectedFire, fire details, etc)
        if (typeof onFireSelect === 'function') {
          const fireObj = fires.find(f => f.fireNumber === foundFire);
          if (fireObj && fireObj.properties) {
            onFireSelect(fireObj.properties);
          }
        }
        // Optionally, update selectedFire in parent via callback/prop
        // If you want to update selectedFire in this component, you may need to lift state up
        if (typeof window !== 'undefined') {
          // Dispatch a custom event or use a callback prop
          const event = new CustomEvent('fire-point-selected', { detail: { fireNumber: foundFire } });
          window.dispatchEvent(event);
        }
      }
    };
    map.on('singleclick', handleMapClick);
    return () => {
      map.un('singleclick', handleMapClick);
    };
  }, [fires, firesLayerRef, onFireSelect]);

  // Reset COG state when fire or toggle changes
  useEffect(() => {
    setNirUrl(null);
    setSwirUrl(null);
    setSentinelUrl(null);
    setShowMetadata(false);
  }, [selectedFire, showPreBurnImagery]);

  // Effect: When preBurnMetadata changes and pre-burn imagery is active, update imageMetadata
  useEffect(() => {
    if (showPreBurnImagery && preBurnMetadata && preBurnVisualUrl) {
      setImageMetadata(preBurnMetadata);
      setShowMetadata(true);
      // Add the COG imagery to the map ONLY when the user selects an image
      addCogImageryToMap(preBurnVisualUrl, preBurnMetadata);
    }
  }, [showPreBurnImagery, preBurnMetadata, preBurnVisualUrl, addCogImageryToMap]);

  return (
    <div className="map-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <StacMetadataDisplay 
        isVisible={showMetadata}
        date={imageMetadata.date}
        cloudCover={imageMetadata.cloudCover}
        source={imageMetadata.source}
        collection={imageMetadata.collection}
        resolution={imageMetadata.resolution}
        bandInfo={imageMetadata.bandInfo}
        assetType={imageMetadata.assetType}
      />
      
      {/* Add NBRCalculator component with fixed calculation extent */}
      <NBRCalculator
        mapInstance={mapInstanceRef.current}
        nirUrl={nirUrl}
        swirUrl={swirUrl}
        extent={nbrCalculationExtent || currentMapExtent} // Use the stored calculation extent if available
        visible={showNBR && !!nirUrl && !!swirUrl}
        onLoadingChange={onNbrLoadingChange}
      />
    </div>
  );
};

export default OLMap;