import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fromUrl } from 'geotiff';
import ndarray from 'ndarray';
import { Map } from 'ol';
import { transformExtent } from 'ol/proj';
import ImageLayer from 'ol/layer/Image';
import ImageCanvasSource from 'ol/source/ImageCanvas';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { Layer } from 'ol/layer';

// TypedArray type definition to fix TypeScript errors
type TypedArray = 
  | Int8Array 
  | Uint8Array 
  | Uint8ClampedArray 
  | Int16Array 
  | Uint16Array 
  | Int32Array 
  | Uint32Array 
  | Float32Array 
  | Float64Array;

interface NBRCalculatorProps {
  mapInstance: Map | null;
  nirUrl: string | null;
  swirUrl: string | null;
  extent: number[] | null;
  visible: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onCalculationComplete?: (minValue: number, maxValue: number) => void;
}

// Create a Web Worker inline-function
const createWorker = () => {
  const workerFunction = `
    self.onmessage = function(e) {
      const { nirData, swirData, windowWidth, windowHeight, noDataValue } = e.data;
      
      // Create result arrays
      const nbrValues = new Float32Array(windowWidth * windowHeight);
      let minValue = Infinity;
      let maxValue = -Infinity;
      
      // Use the same scale factor for both arrays
      const scaleFactor = 0.0001;
      
      // Process in chunks to avoid blocking too long
      const chunkSize = 10000;
      let pixelIndex = 0;
      
      while (pixelIndex < windowWidth * windowHeight) {
        const endIndex = Math.min(pixelIndex + chunkSize, windowWidth * windowHeight);
        
        for (let i = pixelIndex; i < endIndex; i++) {
          const rawNir = nirData[i];
          const rawSwir = swirData[i];
          
          // Check for no data values
          if (rawNir === 0 || rawSwir === 0 || rawNir > 65000 || rawSwir > 65000) {
            nbrValues[i] = noDataValue;
            continue;
          }
          
          // Scale values
          const nir = rawNir * scaleFactor;
          const swir = swirData[i] * scaleFactor;
          
          // Calculate NBR
          const denominator = nir + swir;
          
          if (denominator > 0.001) {
            const nbrValue = (nir - swir) / denominator;
            
            // Clamp NBR values to expected range (-1 to 1)
            if (nbrValue >= -1 && nbrValue <= 1) {
              nbrValues[i] = nbrValue;
              
              // Update min/max
              if (nbrValue < minValue) minValue = nbrValue;
              if (nbrValue > maxValue) maxValue = nbrValue;
            } else {
              nbrValues[i] = noDataValue;
            }
          } else {
            nbrValues[i] = noDataValue;
          }
        }
        
        // Report progress
        if (windowWidth * windowHeight > 100000) {
          const progress = Math.round((endIndex / (windowWidth * windowHeight)) * 100);
          self.postMessage({ type: 'progress', progress });
        }
        
        pixelIndex = endIndex;
      }
      
      // Send back the calculated values
      self.postMessage({
        type: 'complete',
        nbrValues,
        minValue: minValue === Infinity ? -1 : minValue, 
        maxValue: maxValue === -Infinity ? 1 : maxValue,
        width: windowWidth,
        height: windowHeight
      });
    };
  `;

  const blob = new Blob([workerFunction], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Color scale for the NBR visualization - Using lookup arrays for better performance
const NBR_COLOR_MAP: Record<string, [number, number, number, number]> = {
  'severe': [220, 0, 0, 255],      // Very severe burn - Dark Red
  'high': [255, 0, 0, 255],        // Severe burn - Red
  'moderate-high': [255, 50, 0, 255], // Moderate-high burn - Orange-Red  
  'moderate': [255, 150, 0, 255],  // Moderate burn - Orange
  'low': [255, 255, 0, 255],       // Low burn / unburned - Yellow
  'regrowth-low': [50, 180, 50, 255], // Unburned vegetation - Light Green
  'regrowth-mod': [0, 100, 0, 255],   // Healthy vegetation - Green
  'regrowth-high': [0, 50, 0, 255],   // Very healthy vegetation - Dark Green
  'nodata': [0, 0, 0, 0]           // Default transparent
};

// Fast color lookup function
const getNBRColor = (nbrValue: number): [number, number, number, number] => {
  if (nbrValue === -9999) return NBR_COLOR_MAP.nodata;
  if (nbrValue < -0.7) return NBR_COLOR_MAP.severe;
  if (nbrValue < -0.44) return NBR_COLOR_MAP.high; 
  if (nbrValue < -0.25) return NBR_COLOR_MAP['moderate-high'];
  if (nbrValue < -0.1) return NBR_COLOR_MAP.moderate;
  if (nbrValue < 0.1) return NBR_COLOR_MAP.low;
  if (nbrValue < 0.27) return NBR_COLOR_MAP['regrowth-low'];
  if (nbrValue < 0.44) return NBR_COLOR_MAP['regrowth-mod'];
  if (nbrValue < 0.7) return NBR_COLOR_MAP['regrowth-high'];
  return NBR_COLOR_MAP.nodata;
};

// Cache previous calculation results
interface CacheEntry {
  key: string;
  nbrValues: Float32Array;
  minValue: number;
  maxValue: number;
  width: number;
  height: number;
  extent: number[];
}

const NBRCalculator: React.FC<NBRCalculatorProps> = ({
  mapInstance,
  nirUrl,
  swirUrl,
  extent,
  visible,
  onLoadingChange,
  onCalculationComplete
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [calculationKey, setCalculationKey] = useState<string | null>(null);
  const [isNBRProcessed, setIsNBRProcessed] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const cacheRef = useRef<CacheEntry | null>(null);
  
  const nbrDataRef = useRef<{
    data: Float32Array,
    width: number,
    height: number,
    extent: number[]
  } | null>(null);
  
  // Reset state when inputs change
  useEffect(() => {
    setIsNBRProcessed(false);
    setCalculationKey(null);
  }, [nirUrl, swirUrl, extent]);
  
  // Cleanup function for Web Worker
  const cleanupWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);
  
  // Effect to clean up resources when component becomes invisible
  useEffect(() => {
    if (!visible && mapInstance) {
      const layers = mapInstance.getLayers().getArray();
      const nbrLayer = layers.find(layer => layer.get('name') === 'NBRLayer');
      
      if (nbrLayer) {
        mapInstance.removeLayer(nbrLayer);
        console.log('NBR layer removed from map and resources released');
      }
      
      // Don't clear cache, we might need it again, but terminate worker
      cleanupWorker();
      
      // Reset processing state
      setIsNBRProcessed(false);
      setCalculationKey(null);
    }
    
    return () => {
      cleanupWorker();
    };
  }, [visible, mapInstance, cleanupWorker]);

  // Function to downsample large images to improve performance
  const calculateDownsamplingFactor = useCallback((width: number, height: number): number => {
    const pixelCount = width * height;
    // If the image is very large, use downsampling
    if (pixelCount > 4000000) return 4;      // > 4 megapixels: use 1/4 resolution 
    else if (pixelCount > 2000000) return 2; // > 2 megapixels: use 1/2 resolution
    return 1; // Otherwise use full resolution
  }, []);
  
  // Create a canvas layer from NBR data
  const createNBRLayer = useCallback((nbrValues: Float32Array, width: number, height: number, nbrExtent: number[]) => {
    if (!mapInstance) return;
    
    // Create and draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for canvas');
      return;
    }

    const imageData = ctx.createImageData(width, height);
    
    // Use Uint8ClampedArray directly for better performance
    const pixelData = imageData.data;
    
    // Batch process pixels - this is much faster than individual pixel operations
    for (let i = 0; i < nbrValues.length; i++) {
      const value = nbrValues[i];
      const [r, g, b, a] = getNBRColor(value);
      const pixelIndex = i * 4;
      pixelData[pixelIndex] = r;
      pixelData[pixelIndex + 1] = g;
      pixelData[pixelIndex + 2] = b;
      pixelData[pixelIndex + 3] = a;
    }

    ctx.putImageData(imageData, 0, 0);
    
    // Create layer
    const nbrLayer = new ImageLayer({
      source: new ImageCanvasSource({
        canvasFunction: () => canvas,
        projection: 'EPSG:3857',
        ratio: 1
      }),
      extent: nbrExtent,
      zIndex: 50,
      opacity: 0.8
    });
    
    nbrLayer.set('name', 'NBRLayer');
    
    // Save current map view
    const view = mapInstance.getView();
    const currentCenter = view.getCenter();
    const currentZoom = view.getZoom();
    const currentRotation = view.getRotation();
    
    // Remove any existing NBR layers
    const layers = mapInstance.getLayers().getArray();
    for (const layer of layers) {
      if (layer.get('name') === 'NBRLayer') {
        mapInstance.removeLayer(layer);
      }
    }
    
    // Add new layer
    mapInstance.addLayer(nbrLayer);
    
    // Bring fire perimeters to top
    const firePerimetersLayer = layers.find(layer => {
      if (layer.get('name') === 'firePerimeters') return true;
      
      try {
        // Use proper type casting for TileLayer with TileWMS source
        if (layer instanceof TileLayer) {
          const tileLayer = layer as TileLayer<TileWMS>;
          const source = tileLayer.getSource();
          if (source && 'getParams' in source) {
            const params = (source as TileWMS).getParams();
            return params && params.LAYERS === 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP';
          }
        }
      } catch (e) {
        // Ignore errors from invalid layers
      }
      
      return false;
    });
    
    if (firePerimetersLayer) {
      mapInstance.removeLayer(firePerimetersLayer);
      firePerimetersLayer.setZIndex(200);
      mapInstance.addLayer(firePerimetersLayer);
    }
    
    // Restore view
    if (currentCenter && currentZoom !== undefined) {
      view.setCenter(currentCenter);
      view.setZoom(currentZoom);
      if (currentRotation !== undefined) {
        view.setRotation(currentRotation);
      }
    }
    
    console.log('✅ NBR layer created and added to map');
  }, [mapInstance]);

  // Calculate NBR from NIR and SWIR bands - optimized version
  const calculateNBR = useCallback(async () => {
    // Skip if already processed
    if (isNBRProcessed) {
      console.log('NBR already processed. Skipping recalculation.');
      return;
    }

    // Check required inputs
    if (!nirUrl || !swirUrl || !extent) {
      console.error('Missing required data for NBR calculation');
      return;
    }

    // Create a unique key for this calculation to avoid duplicates
    const currentKey = `${nirUrl}-${swirUrl}-${extent.join(',')}`;
    
    // Check cache first
    if (cacheRef.current && cacheRef.current.key === currentKey) {
      console.log('Using cached NBR results');
      const { nbrValues, width, height, extent: cachedExtent, minValue, maxValue } = cacheRef.current;
      
      // Create layer from cached data
      const nbrExtent = transformExtent(
        transformExtent(extent, 'EPSG:3857', 'EPSG:4326'),
        'EPSG:4326', 
        'EPSG:3857'
      );
      
      createNBRLayer(nbrValues, width, height, nbrExtent);
      
      // Report completion
      onCalculationComplete?.(minValue, maxValue);
      return;
    }

    if (calculationKey === currentKey) {
      console.log('Calculation already in progress');
      return;
    }

    setCalculationKey(currentKey);
    setIsNBRProcessed(true);
    setCalculationProgress(0);
    
    try {
      setIsLoading(true);
      onLoadingChange?.(true);
      
      // Clear existing worker if any
      cleanupWorker();
      
      // Initialize worker for calculation
      workerRef.current = createWorker();
      
      // Load GeoTIFFs in parallel
      console.log('Loading NIR and SWIR data...');
      const [nirTiff, swirTiff] = await Promise.all([
        fromUrl(nirUrl),
        fromUrl(swirUrl)
      ]);
      
      const nirImage = await nirTiff.getImage(0);
      const swirImage = await swirTiff.getImage(0);
      
      // Transform map extent to image's geographic space
      const mapBboxWgs84 = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
      
      // Get bounding boxes
      const nirBbox = nirImage.getBoundingBox();
      const swirBbox = swirImage.getBoundingBox();
      
      // Calculate pixel windows for both images
      const nirImageWidth = nirImage.getWidth();
      const nirImageHeight = nirImage.getHeight();
      
      // Map from geographic to pixel coordinates
      let nirX1 = Math.max(0, Math.floor(nirImageWidth * (mapBboxWgs84[0] - nirBbox[0]) / (nirBbox[2] - nirBbox[0])));
      let nirY1 = Math.max(0, Math.floor(nirImageHeight * (1 - (mapBboxWgs84[3] - nirBbox[1]) / (nirBbox[3] - nirBbox[1]))));
      let nirX2 = Math.min(nirImageWidth, Math.ceil(nirImageWidth * (mapBboxWgs84[2] - nirBbox[0]) / (nirBbox[2] - nirBbox[0])));
      let nirY2 = Math.min(nirImageHeight, Math.ceil(nirImageHeight * (1 - (mapBboxWgs84[1] - nirBbox[1]) / (nirBbox[3] - nirBbox[1]))));
      
      // Validate window
      if (nirX2 <= nirX1 || nirY2 <= nirY1) {
        console.warn('Invalid window dimensions, using full image');
        nirX1 = 0;
        nirY1 = 0;
        nirX2 = nirImageWidth;
        nirY2 = nirImageHeight;
      }
      
      // Calculate window dimensions
      const windowWidth = nirX2 - nirX1;
      const windowHeight = nirY2 - nirY1;
      
      // Determine if we should downsample for performance
      const downsamplingFactor = calculateDownsamplingFactor(windowWidth, windowHeight);
      
      // Adjust window if downsampling
      let actualWidth = windowWidth;
      let actualHeight = windowHeight;
      
      if (downsamplingFactor > 1) {
        // Log original size versus downsampled size
        console.log(`Downsampling from ${windowWidth}x${windowHeight} to ${Math.ceil(windowWidth/downsamplingFactor)}x${Math.ceil(windowHeight/downsamplingFactor)}`);
        actualWidth = Math.ceil(windowWidth / downsamplingFactor);
        actualHeight = Math.ceil(windowHeight / downsamplingFactor);
      }
      
      // Calculate equivalent window for SWIR image
      const swirImageWidth = swirImage.getWidth();
      const swirImageHeight = swirImage.getHeight();
      const swirX1 = Math.floor(nirX1 * swirImageWidth / nirImageWidth);
      const swirY1 = Math.floor(nirY1 * swirImageHeight / nirImageHeight);
      const swirX2 = Math.ceil(nirX2 * swirImageWidth / nirImageWidth);
      const swirY2 = Math.ceil(nirY2 * swirImageHeight / nirImageHeight);
      
      console.log('Reading raster data...');
      
      // Read rasters with downsampling if needed
      const nirOptions: any = { window: [nirX1, nirY1, nirX2, nirY2] };
      const swirOptions: any = { window: [swirX1, swirY1, swirX2, swirY2] };
      
      if (downsamplingFactor > 1) {
        nirOptions.width = actualWidth;
        nirOptions.height = actualHeight;
        swirOptions.width = actualWidth;
        swirOptions.height = actualHeight;
      }
      
      // Read the actual data
      const [nirRasters, swirRasters] = await Promise.all([
        nirImage.readRasters(nirOptions) as Promise<TypedArray[]>,
        swirImage.readRasters(swirOptions) as Promise<TypedArray[]>
      ]);
      
      // Set up worker message handler
      workerRef.current.onmessage = (e) => {
        const { type, progress, nbrValues, minValue, maxValue, width, height } = e.data;
        
        if (type === 'progress') {
          setCalculationProgress(progress);
        } 
        else if (type === 'complete') {
          // Store in cache
          cacheRef.current = {
            key: currentKey,
            nbrValues,
            minValue,
            maxValue,
            width,
            height,
            extent
          };
          
          // Create the NBR layer
          const nbrExtent = transformExtent(mapBboxWgs84, 'EPSG:4326', 'EPSG:3857');
          createNBRLayer(nbrValues, width, height, nbrExtent);
          
          // Update state
          setIsLoading(false);
          onLoadingChange?.(false);
          
          // Report completion
          onCalculationComplete?.(minValue, maxValue);
          
          // Clean up worker
          cleanupWorker();
        }
      };
      
      // Post data to worker for processing
      workerRef.current.postMessage({
        nirData: nirRasters[0],
        swirData: swirRasters[0],
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        noDataValue: -9999
      });
      
    } catch (error) {
      console.error('Error during NBR calculation:', error);
      setIsNBRProcessed(false);
      setIsLoading(false);
      onLoadingChange?.(false);
      cleanupWorker();
    }
  }, [
    nirUrl, swirUrl, extent, isNBRProcessed, calculationKey, 
    onLoadingChange, onCalculationComplete, cleanupWorker, 
    createNBRLayer, calculateDownsamplingFactor
  ]);

  useEffect(() => {
    if (visible) {
      calculateNBR();
    }
  }, [visible, calculateNBR]);

  // Render loading progress if visible
  if (visible && isLoading && calculationProgress > 0) {
    return (
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Calculating NBR: {calculationProgress}%
      </div>
    );
  }
  
  // Component doesn't need to render visible elements when not showing progress
  return null;
};

export { NBRCalculator };