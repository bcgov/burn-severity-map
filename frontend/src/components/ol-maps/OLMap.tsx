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
  selectedFire?: string | null;
  showSatelliteImagery?: boolean;
  showNBR?: boolean;
  visualCogUrl?: string | null;
  stacItemUrl?: string | null;
  onNbrLoadingChange?: (loading: boolean) => void;
  onFireSelect?: (fireProperties: any | null) => void; // Add new callback prop
}

const OLMap: React.FC<OLMapProps> = ({
  center = [-123.3656, 48.4284], // Default to Victoria, BC
  zoom = 6,
  basemap = 'osm',
  onFiresLoaded,
  selectedFire,
  showSatelliteImagery = false,
  showNBR = false,
  visualCogUrl = null,
  stacItemUrl = null,
  onNbrLoadingChange,
  onFireSelect // Destructure the new prop
}) => {
  // Create refs and state
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [fires, setFires] = useState<Fire[]>([]);
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

  // Function to fetch Sentinel-2 imagery from STAC API based on the current map extent
  const fetchSentinelImagery = useCallback(async (extent: number[]) => {
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

      const response = await fetch('https://earth-search.aws.element84.com/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collections: ["sentinel-2-l2a"],
          bbox: stacBbox,
          query: {
            "eo:cloud_cover": {
              "lte": 30
            }
          },
          sortby: [
            {
              field: "properties.datetime",
              direction: "desc"
            }
          ],
          limit: 1
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
    
    // Check if we already have this image in cache
    if (imageCache.current[url]) {
      console.log('Using cached COG layer');
      satelliteLayerRef.current = imageCache.current[url];
      mapInstanceRef.current.addLayer(satelliteLayerRef.current);
      return;
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

  // Update the existing function to use the new implementation
  const addSentinelImageryToMap = useCallback((url: string) => {
    addCogImageryToMap(url);
  }, [addCogImageryToMap]);

  // New function to add a direct COG URL to the map 
  // This can be called when you pass in the visualCogUrl prop
  useEffect(() => {
    if (visualCogUrl && mapInstanceRef.current) {
      console.log('Adding direct COG URL to map:', visualCogUrl);
      
      // Create basic metadata for direct COG URLs
      const directCogMetadata: ImageMetadata = {
        date: new Date().toISOString(), // Default to current date
        cloudCover: null,
        collection: null,
        source: 'Custom COG',
        resolution: null,
        bandInfo: null,
        assetType: 'Custom Imagery'
      };
      
      addCogImageryToMap(visualCogUrl, directCogMetadata);
      setShowMetadata(true);
    }
  }, [visualCogUrl, addCogImageryToMap]);

  // Function to fetch fire data
  const fetchFireData = useCallback(async () => {
    try {
      // Request the WFS in EPSG:3857 explicitly
      const response = await fetch(
        'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP&outputFormat=application%2Fjson&srsName=EPSG:3857'
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch fire data: ${response.statusText}`);
      }

      const data = await response.json();
      const fireFeatures = data.features.map((feature: any) => {
        // Store all properties for debugging
        const properties = feature.properties;
        let geometry = feature.geometry;
        
        // Create a proper OpenLayers feature
        const olFeature = new GeoJSON().readFeature(feature) as Feature<Geometry>;
        
        // Get the geometry
        const geom = olFeature.getGeometry();
        
        // Create a buffered extent for each point
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
            
            // Check if extent is valid
            if (
              !isFinite(extent[0]) ||
              !isFinite(extent[1]) ||
              !isFinite(extent[2]) ||
              !isFinite(extent[3])
            ) {
              console.warn('Invalid extent for feature:', feature.id);
              extent = [0, 0, 0, 0]; // Default if invalid
            }
          } catch (e) {
            console.warn('Error getting extent for feature:', feature.id, e);
          }
        }
        
        return {
          id: feature.id,
          fireNumber: properties.FIRE_NUMBER,
          geometry: geometry,
          extent: extent,
          olGeometry: geom,
          properties: properties
        };
      });

      setFires(fireFeatures);

      // If onFiresLoaded callback is provided, call it with the fire features
      if (onFiresLoaded) {
        onFiresLoaded(fireFeatures);
      }

      // Create the fires layer if it doesn't exist yet
      if (!firesLayerRef.current && mapInstanceRef.current) {
        const vectorSource = new VectorSource({
          features: data.features.map((feature: any) => {
            // Explicitly cast the result to ensure TypeScript knows it's a Feature<Geometry>
            const olFeature = new GeoJSON().readFeature(feature) as Feature<Geometry>;
            
            // If it's a point feature, make sure to convert coordinates properly
            if (feature.geometry.type === 'Point') {
              const geom = olFeature.getGeometry();
              if (geom) {
                // Get the coordinates and convert them if needed
                try {
                  const coords = feature.geometry.coordinates;
                  // Create a new point geometry with the coordinates
                  olFeature.setGeometry(new Point(coords));
                } catch (e) {
                  console.error('Error setting point geometry:', e);
                }
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
          zIndex: 10 // Ensure fire points show above WMS layer
        });

        mapInstanceRef.current.addLayer(firesLayerRef.current);
      }
    } catch (error) {
      console.error('Error fetching fire data:', error);
    }
  }, [onFiresLoaded]);

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
      zIndex: 5
    });

    initialMap.addLayer(firePerimetersLayer);
    firePerimetersLayerRef.current = firePerimetersLayer;

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

  // Effect to handle satellite imagery toggle
  useEffect(() => {
    // Only fetch imagery when toggled on and we have a valid extent or selected fire
    if (showSatelliteImagery) {
      if (selectedFire) {
        // Find the selected fire and use its extent for fetching imagery
        const selectedFireObj = fires.find(fire => fire.fireNumber === selectedFire);
        
        if (selectedFireObj && selectedFireObj.extent && 
            selectedFireObj.extent.length === 4 && 
            selectedFireObj.extent.every(coord => isFinite(coord))) {
          // Use a buffer around the fire extent to get more satellite context
          const bufferSize = 10000; // 10km buffer
          const bufferedExtent = [
            selectedFireObj.extent[0] - bufferSize,
            selectedFireObj.extent[1] - bufferSize,
            selectedFireObj.extent[2] + bufferSize,
            selectedFireObj.extent[3] + bufferSize
          ];
          fetchSentinelImagery(bufferedExtent);
        } else if (currentMapExtent) {
          // Fallback to current map extent
          fetchSentinelImagery(currentMapExtent);
        }
      } else if (currentMapExtent) {
        // No fire selected, use the current map extent
        fetchSentinelImagery(currentMapExtent);
      }
    } else {
      // Hide satellite imagery when toggle is off
      if (mapInstanceRef.current && satelliteLayerRef.current) {
        mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
        satelliteLayerRef.current = null;
        setShowMetadata(false);
        
        // Release resources when satellite imagery is toggled off
        setSentinelUrl(null);
        // Clear NIR and SWIR URLs to free up memory
        setNirUrl(null);
        setSwirUrl(null);
        
        console.log("Released satellite imagery resources from memory");
      }
    }
  }, [showSatelliteImagery, selectedFire, fires, currentMapExtent, fetchSentinelImagery]);
  
  // Effect to handle NBR toggle visibility
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Find and handle NBR layers when visibility changes
    const layers = mapInstanceRef.current.getLayers().getArray();
    const nbrLayer = layers.find(layer => layer.get('name') === 'NBRLayer');
    
    if (showNBR && nirUrl && swirUrl) {
      // When NBR is toggled ON and we have the necessary URLs
      // Store the current extent as the calculation extent only if we don't have one yet
      if (!initialNbrExtentRef.current && currentMapExtent) {
        console.log('Storing initial NBR calculation extent:', currentMapExtent);
        initialNbrExtentRef.current = [...currentMapExtent];
        setNbrCalculationExtent([...currentMapExtent]);
      }
    } else if (!showNBR && nbrLayer) {
      // Remove NBR layer when toggled off
      mapInstanceRef.current.removeLayer(nbrLayer);
      console.log("Removed NBR layer from map");
      
      // Release resources when NBR is toggled off
      if (onNbrLoadingChange) {
        onNbrLoadingChange(false);
      }
      
      // Don't reset the calculation extent - we want to keep it for when NBR is toggled on again
    }
    
  }, [showNBR, nirUrl, swirUrl, currentMapExtent, onNbrLoadingChange]);

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