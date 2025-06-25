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
import BurnSeverityLegend from './BurnSeverityLegend';
import BurnSeveritySummary from './BurnSeveritySummary';
import type { Feature as GeoJSONFeature } from 'geojson';

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

// Interface for a single burn record from the backend
interface FireRecord {
  id: string;
  fireNumber: string;
  pre_image_date: string;
  post_image_date: string;
  severty_class: string;
  geometry?: any;
}

interface OLMapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  basemap?: string;
  onDbFiresLoaded?: (dbFires: FireRecord[]) => void; // Callback for database fires
  selectedDbFire?: string | null; // Selected DB fire prop
  showSatelliteImagery?: boolean;
  showNBR?: boolean;
  visualCogUrl?: string | null;
  stacItemUrl?: string | null;
  onNbrLoadingChange?: (loading: boolean) => void;
  showPreBurnImagery?: boolean;
  showPostBurnImagery?: boolean;
  ignitionDate?: string | null;
  fireOutDate?: string | null;
  // Pre-burn date selection
  onPreBurnDates?: (dates: string[]) => void;
  selectedPreBurnDate?: string | null;
  // Post-burn props
  onPostBurnDates?: (dates: string[]) => void;
  selectedPostBurnDate?: string | null;
  // Pre-burn COGs
  preBurnVisualUrl?: string | null;
  preBurnNirUrl?: string | null;
  preBurnSwirUrl?: string | null;
  preBurnMetadata?: any | null;
  // New prop for highlighting a single feature
  highlightFeature?: GeoJSONFeature | null;
}

const OLMap: React.FC<OLMapProps> = ({
  center = [-123.3656, 48.4284], // Default to Victoria, BC
  zoom = 6,
  basemap = 'osm',
  onDbFiresLoaded,
  selectedDbFire,
  showSatelliteImagery = false,
  showNBR = false,
  visualCogUrl = null,
  stacItemUrl = null,
  onNbrLoadingChange,
  showPreBurnImagery = false,
  showPostBurnImagery = false,
  ignitionDate = null,
  fireOutDate = null,
  onPreBurnDates,
  selectedPreBurnDate,
  onPostBurnDates,
  selectedPostBurnDate,
  preBurnVisualUrl = null,
  preBurnNirUrl = null,
  preBurnSwirUrl = null,
  preBurnMetadata = null,
  highlightFeature = null,
}) => {
  // Create refs and state
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  
  // State for database fires (used for FireSelector_db)
  const [dbFires, setDbFires] = useState<any[]>([]);
  const satelliteLayerRef = useRef<WebGLTileLayer | null>(null);
  const [sentinelUrl, setSentinelUrl] = useState<string | null>(null);
  const [isLoadingImagery, setIsLoadingImagery] = useState<boolean>(false);
  
  // State for the burn severity vector layer
  const [burnSeverityLayer, setBurnSeverityLayer] = useState<VectorLayer<VectorSource> | null>(null);
  
  // State for the legend and summary visibility
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(true);
  
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
  
  // New state for selected fire feature collection
  const [selectedFireFeatureCollection, setSelectedFireFeatureCollection] = useState<any | null>(null);
  
  // Flag to track if we've just fitted the view to features
  const recentlyFittedRef = useRef<boolean>(false);

  // Helper function to safely fit the view to an extent
  const fitMapToExtent = useCallback((extent: number[], options?: { maxZoom?: number, duration?: number }) => {
    if (!mapInstanceRef.current || !extent || extent[0] === Infinity) return;

    console.log('Fitting map to extent:', extent);
    recentlyFittedRef.current = true;
    
    mapInstanceRef.current.getView().fit(extent, { 
      maxZoom: options?.maxZoom || 14, 
      duration: options?.duration || 1000 
    });
    
    // Reset the flag after the animation
    setTimeout(() => {
      recentlyFittedRef.current = false;
    }, (options?.duration || 1000) + 100);
  }, []);

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
      // Use the pg-bs endpoint with the proxy configured in webpack.config.js
      const response = await fetch('/pg-bs/burn-severity/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch fires: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Backend data:', data);
      // Convert GeoJSON FeatureCollections to FireRecord[]
      const formattedFires = extractFireRecordsFromGeoJSON(Array.isArray(data) ? data : []);
      
      // Also fetch geometry for each fire to make it GeoJSON-compatible
      // This will be done when a fire is selected rather than all at once
      
      return formattedFires;
    } catch (error) {
      // Error fetching fire data from backend
      console.error('Failed to fetch fire data from backend:', error);
      return [];
    }
  }, []);

  // The fetchFireData function has been removed as we're no longer working with fire points

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
      // Use the pg-bs endpoint with the proxy configuration in webpack.config.js
      const response = await fetch('/pg-bs/burn-severity/', {
        method: 'GET',
        // No need for mode: 'cors' as we're using the proxy
      });
      
      return response.ok;
    } catch (error) {
      // Silent error handling - we'll use fallback data if needed
      return false;
    }
  }, []);

  // Function to fetch and display burn severity geometry
  const fetchAndDisplayBurnGeometry = useCallback(async (fireNumber: string) => {
    if (!mapInstanceRef.current) return;
    try {
      // Show the legend and summary when fetching fire data
      setShowLegend(true);
      setShowSummary(true);
      
      // Fetch all records for this fire number as a single FeatureCollection with multiple features
      const response = await fetch(`/pg-bs/burn-severity/${fireNumber}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch geometry: ${response.status} ${response.statusText}`);
      }
      const featureCollection = await response.json();
      console.log('Raw backend data:', featureCollection);
      
      // Extract features from the response, handling both formats without duplication
      let allFeatures = [];
      
      // Clear any previous features to prevent duplication
      if (Array.isArray(featureCollection)) {
        // Handle the old format (array of FeatureCollections)
        allFeatures = featureCollection.flatMap(fc => 
          (fc && fc.type === 'FeatureCollection' && Array.isArray(fc.features)) 
            ? fc.features 
            : []
        );
      } else if (featureCollection && featureCollection.type === 'FeatureCollection' && Array.isArray(featureCollection.features)) {
        // Handle the new format (single FeatureCollection with multiple features)
        allFeatures = [...featureCollection.features]; // Use spread to create a clean copy
      }
      
      console.log('Extracted features count:', allFeatures.length);
      
      // Create the combined feature collection regardless of features count
      // so we maintain the variable scope for the rest of the function
      const combinedFeatureCollection = {
        type: 'FeatureCollection',
        features: allFeatures
      };
      
      console.log('Combined FeatureCollection for map:', combinedFeatureCollection);
      
      // Set local state 
      setSelectedFireFeatureCollection(combinedFeatureCollection);
      // Remove existing burn severity layer if it exists
      if (burnSeverityLayer) {
        console.log('Removing existing burn severity layer');
        mapInstanceRef.current.removeLayer(burnSeverityLayer);
        setBurnSeverityLayer(null);
      }
      
      // Remove any highlight layer as well to prevent duplication
      if (highlightLayer) {
        console.log('Removing existing highlight layer');
        mapInstanceRef.current.removeLayer(highlightLayer);
        setHighlightLayer(null);
      }
      
      // Get all layers on the map for debugging
      const allLayers = mapInstanceRef.current.getLayers().getArray();
      console.log(`Map has ${allLayers.length} layers before adding new features`);
      
      // Add new features to the map
      let geojsonFeatures: Feature<Geometry>[] = [];
      if (combinedFeatureCollection && combinedFeatureCollection.type === 'FeatureCollection') {
        // Log the features before adding them to help debug
        console.log(`Adding ${combinedFeatureCollection.features.length} features to the map`);
        
        geojsonFeatures = new GeoJSON().readFeatures(combinedFeatureCollection, {
          featureProjection: WEB_MERCATOR,
          dataProjection: WGS84
        });
        
        // Log the converted features for debugging
        console.log(`Converted ${geojsonFeatures.length} OpenLayers features`);
      } else {
        console.error('Invalid GeoJSON returned for fire', fireNumber);
      }
      const vectorSource = new VectorSource({ features: geojsonFeatures });
      const newLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const burnSeverity = feature.get('BURN_SEVERITY_RATING') || feature.get('severity_class') || 'Unknown';
          console.log('Feature burn severity:', burnSeverity); // Debug log
          
          let fillColor = 'rgba(0,0,0,0.1)'; // Default for unknown
          
          if (burnSeverity === 'High') {
            fillColor = 'rgba(204,0,0,0.6)'; // Red for High
          } else if (burnSeverity === 'Medium' || burnSeverity === 'Moderate') {
            fillColor = 'rgba(255,153,51,0.6)'; // Orange for Medium/Moderate
          } else if (burnSeverity === 'Low') {
            fillColor = 'rgba(255,255,0,0.6)'; // Yellow for Low
          } else if (burnSeverity === 'Unburned' || burnSeverity === 'Unburnt' || burnSeverity === 'Unchanged') {
            fillColor = 'rgba(0,0,0,0.1)'; // Transparent black for unburned areas
          }
          
          // Log the color used for debugging
          console.log(`Style for ${burnSeverity}: ${fillColor}`);
          return new Style({ fill: new Fill({ color: fillColor }), stroke: new Stroke({ color: '#333', width: 1 }) });
        }
      });
      console.log(`Adding new vector layer with ${geojsonFeatures.length} features`);
      mapInstanceRef.current.addLayer(newLayer);
      setBurnSeverityLayer(newLayer);
      
      // Log all features with severity for debugging
      geojsonFeatures.forEach((feature, index) => {
        const severity = feature.get('BURN_SEVERITY_RATING') || feature.get('severity_class') || 'Unknown';
        console.log(`Feature ${index}: ${severity}`);
      });
      
      // Fit map view to new features if any
      if (geojsonFeatures.length > 0) {
        const extent = vectorSource.getExtent();
        // Store the extent in a ref so we don't re-fit when the highlight feature is from the same fire
        if (!highlightFeature) {
          console.log('Fitting to extent of all features');
          fitMapToExtent(extent, { duration: 1000, maxZoom: 14 });
        }
      }
      
      // Log layers again after adding
      const updatedLayers = mapInstanceRef.current.getLayers().getArray();
      console.log(`Map now has ${updatedLayers.length} layers after adding burn severity layer`);
    } catch (error) {
      console.error('Failed to fetch or display burn geometry:', error);
    }
  }, [fitMapToExtent, highlightFeature]);
  
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

    // Fire perimeters WMS layer has been removed as we're no longer showing fire points

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

    // No longer fetching fire point data as we're focusing on burn severity
    
    // Also fetch fires from database for FireSelector_db
    // First check if we can connect to the backend
    checkBackendConnection().then(() => {
      // Proceed with fetching fires regardless of connection status
      // The fetchFiresFromDB will handle fallback data if needed
      fetchFiresFromDB()
        .then(dbFiresData => {
          setDbFires(dbFiresData);
          // Call the callback if it exists
          if (onDbFiresLoaded) {
            onDbFiresLoaded(dbFiresData);
          }
        })
        .catch(() => {
          // Silent error handling - the proxy is working but showing CORS errors
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
    // Use current map extent since we're no longer tracking individual fire points
    const getBufferedExtent = () => {
      // We'll use the current map extent since we don't have fire points anymore
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
  }, [showPreBurnImagery, showPostBurnImagery, ignitionDate, fireOutDate, currentMapExtent, selectedPreBurnDate, selectedPostBurnDate, preBurnDates.length, postBurnDates.length]);

  // Reset NBR calculation extent when fire or imagery changes
  useEffect(() => {
    // When the selected fire or imagery changes, we want to reset the NBR calculation extent
    initialNbrExtentRef.current = null;
    setNbrCalculationExtent(null);
  }, [selectedDbFire, sentinelUrl]);

  // Fire selection effect has been removed as we're no longer working with fire points

  // Map click handler for fire points has been removed as we're no longer working with fire points

  // Reset COG state when fire or toggle changes
  useEffect(() => {
    setNirUrl(null);
    setSwirUrl(null);
    setSentinelUrl(null);
    setShowMetadata(false);
  }, [selectedDbFire, showPreBurnImagery]);

  // Effect: When preBurnMetadata changes and pre-burn imagery is active, update imageMetadata
  useEffect(() => {
    if (showPreBurnImagery && preBurnMetadata && preBurnVisualUrl) {
      setImageMetadata(preBurnMetadata);
      setShowMetadata(true);
      // Add the COG imagery to the map ONLY when the user selects an image
      addCogImageryToMap(preBurnVisualUrl, preBurnMetadata);
    }
  }, [showPreBurnImagery, preBurnMetadata, preBurnVisualUrl, addCogImageryToMap]);

  // Effect to handle DB fire selection and create/update a vector layer for it
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    if (!selectedDbFire || dbFires.length === 0) {
      // Hide the legend when no fire is selected
      setShowLegend(false);
      
      // Clean up any existing layers when no fire is selected
      if (burnSeverityLayer) {
        console.log('Removing burn severity layer - no fire selected');
        mapInstanceRef.current.removeLayer(burnSeverityLayer);
        setBurnSeverityLayer(null);
      }
      if (highlightLayer) {
        console.log('Removing highlight layer - no fire selected');
        mapInstanceRef.current.removeLayer(highlightLayer);
        setHighlightLayer(null);
      }
      return;
    }
    
    try {
      // Fetch and display the burn geometry by fire number directly
      // This will fetch all geometries for that fire number regardless of severity
      fetchAndDisplayBurnGeometry(selectedDbFire)
        .then(features => {
          // No need to log anything here, silently handle success
        })
        .catch(() => {
          // Silent error handling - the proxy is working but showing CORS errors
        });
      
    } catch (error) {
      // Silent error handling for burn geometry display
    }
  }, [selectedDbFire, dbFires, fetchAndDisplayBurnGeometry, fitMapToExtent]);

  // State for the highlighted feature layer
  const [highlightLayer, setHighlightLayer] = useState<VectorLayer<VectorSource> | null>(null);

  /*
  // COMMENTED OUT: Effect to add/remove the highlight layer when highlightFeature changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Remove previous highlight layer if it exists
    if (highlightLayer) {
      console.log('Removing previous highlight layer');
      mapInstanceRef.current.removeLayer(highlightLayer);
      setHighlightLayer(null);
    }
    
    // If no highlight feature is provided, just clean up and return
    if (!highlightFeature) {
      console.log('No highlight feature provided, skipping highlight layer creation');
      return;
    }
    
    console.log('Adding highlight layer for feature with severity:', 
      highlightFeature.properties?.BURN_SEVERITY_RATING || 
      highlightFeature.properties?.severity_class || 
      'Unknown');
      
    if (highlightFeature) {
      const geom = highlightFeature.geometry;
      const isValidGeometry =
        geom &&
        typeof geom === 'object' &&
        typeof geom.type === 'string' &&
        ((geom.type !== 'GeometryCollection' && 'coordinates' in geom) ||
         (geom.type === 'GeometryCollection' && 'geometries' in geom && Array.isArray(geom.geometries)));
      if (!isValidGeometry) {
        console.warn('highlightFeature has invalid geometry:', highlightFeature);
        return;
      }
      // Color map for burn severity - matching the same colors used for the main layer
      const severityColorMap: Record<string, string> = {
        'High': '#d73027',      // Red
        'Medium': '#fc8d59',    // Orange
        'Moderate': '#fc8d59',  // Same orange for Moderate (identical to Medium)
        'Low': '#fee08b',       // Yellow
        'Unburned': '#91cf60',  // Green
        'Unburnt': '#91cf60',   // Same green for Unburnt (alternative spelling)
        'Unchanged': '#91cf60', // Same green for Unchanged
        '': '#cccccc',          // Gray fallback for missing
      };
      // Get the severity value (case-insensitive, fallback to '')
      const severity = (highlightFeature.properties?.BURN_SEVERITY_RATING || highlightFeature.properties?.severty_class || highlightFeature.properties?.severity_class || '').toString();
      // Find a color, fallback to gray
      const color = severityColorMap[severity] || '#cccccc';
      // Create a vector source and layer for the single feature
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures({
          type: 'FeatureCollection',
          features: [highlightFeature],
        }, {
          featureProjection: WEB_MERCATOR,
        }),
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({ color, width: 3 }),
          fill: new Fill({ color: color + '80' }), // semi-transparent fill
        }),
        zIndex: 100,
      });
      mapInstanceRef.current.addLayer(vectorLayer);
      setHighlightLayer(vectorLayer);
      // Only fit to the highlighted feature if we haven't recently fitted to features
      // This prevents the double-zoom effect when selecting a fire
      if (!recentlyFittedRef.current) {
        const extent = vectorSource.getExtent();
        if (extent && extent[0] !== Infinity) {
          console.log('Fitting to extent of highlighted feature');
          fitMapToExtent(extent, { maxZoom: 13, duration: 500 });
        }
      } else {
        console.log('Skipping highlight feature fit - recently fitted to features');
      }
    }
    // Cleanup on unmount
    return () => {
      if (highlightLayer && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(highlightLayer);
      }
    };
  }, [highlightFeature, fitMapToExtent]);
  */

  // Utility to extract FireRecords from GeoJSON FeatureCollections
  function extractFireRecordsFromGeoJSON(data: any[]): FireRecord[] {
    const records: FireRecord[] = [];
    data.forEach(fc => {
      if (fc && Array.isArray(fc.features)) {
        fc.features.forEach((feature: any) => {
          const props = feature.properties || {};
          records.push({
            id: props.FIRE_NUMBER + '_' + (props.PRE_FIRE_IMAGE_DATE || ''),
            fireNumber: props.FIRE_NUMBER,
            pre_image_date: props.PRE_FIRE_IMAGE_DATE,
            post_image_date: props.POST_FIRE_IMAGE_DATE,
            severty_class: props.BURN_SEVERITY_RATING || 'Unknown',
            geometry: feature.geometry
          });
        });
      }
    });
    return records;
  }

  // Utility to flatten features from an array of FeatureCollections
  function flattenFeatures(featureCollections: any[]): any[] {
    return featureCollections.flatMap(fc => Array.isArray(fc.features) ? fc.features : []);
  }

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
      
      {/* Add the burn severity legend */}
      <BurnSeverityLegend 
        isVisible={showLegend}
        onClose={() => setShowLegend(false)}
      />

      {/* Add the burn severity summary with area stats and chart */}
      {selectedDbFire && selectedFireFeatureCollection && showSummary && (
        <BurnSeveritySummary 
          featureCollection={selectedFireFeatureCollection}
          selectedFire={selectedDbFire}
        />
      )}
    </div>
  );
};

export default OLMap;