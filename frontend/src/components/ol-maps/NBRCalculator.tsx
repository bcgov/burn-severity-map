import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fromUrl, writeArrayBuffer } from 'geotiff';
import ndarray from 'ndarray';
import { Map } from 'ol';
import { transformExtent } from 'ol/proj';
import ImageLayer from 'ol/layer/Image';
import ImageCanvasSource from 'ol/source/ImageCanvas';

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

// Color scale for the NBR visualization
// NBR values range from -1 to 1 where:
// -1 to -0.25: High severity burn
// -0.25 to -0.1: Moderate severity burn
// -0.1 to 0.1: Unburned
// 0.1 to 0.27: Low post-fire regrowth
// 0.27 to 1: High post-fire regrowth
const getNBRColor = (nbrValue: number): [number, number, number, number] => {
  // Define our color stops for NBR visualization
  if (nbrValue < -0.7) return [220, 0, 0, 255]; // Very severe burn - Dark Red
  if (nbrValue < -0.44) return [255, 0, 0, 255]; // Severe burn - Red
  if (nbrValue < -0.25) return [255, 50, 0, 255]; // Moderate-high burn - Orange-Red
  if (nbrValue < -0.1) return [255, 150, 0, 255]; // Moderate burn - Orange
  if (nbrValue < 0.1) return [255, 255, 0, 255]; // Low burn / unburned - Yellow
  if (nbrValue < 0.27) return [50, 180, 50, 255]; // Unburned vegetation - Light Green
  if (nbrValue < 0.44) return [0, 100, 0, 255]; // Healthy vegetation - Green
  if (nbrValue < 0.7) return [0, 50, 0, 255]; // Very healthy vegetation - Dark Green
  
  return [0, 0, 0, 0]; // Default transparent
};

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
  const [calculationKey, setCalculationKey] = useState<string | null>(null); // Track unique calculation inputs
  const [isNBRProcessed, setIsNBRProcessed] = useState(false); // Track if NBR has already been processed
  const nbrDataRef = useRef<{
    data: number[][],
    width: number,
    height: number,
    extent: number[]
  } | null>(null);
  
  // Reset isNBRProcessed when input URLs or extent changes
  useEffect(() => {
    // Reset the processor state when inputs change so it can be recalculated if needed
    setIsNBRProcessed(false);
    setCalculationKey(null);
  }, [nirUrl, swirUrl, extent]);

  // Calculate NBR from NIR and SWIR bands
  const calculateNBR = useCallback(async () => {
    if (isNBRProcessed) {
      console.log('NBR has already been processed. Skipping recalculation.');
      return;
    }

    if (!nirUrl || !swirUrl || !extent) {
      console.error('Missing required data for NBR calculation');
      return;
    }

    // Create a unique key for this calculation to avoid duplicates
    const currentKey = `${nirUrl}-${swirUrl}-${extent.join(',')}`;
    if (calculationKey === currentKey) {
      console.log('Skipping redundant NBR calculation for the same inputs.');
      return;
    }

    setCalculationKey(currentKey);
    setIsNBRProcessed(true); // Mark NBR as processed to prevent recalculation
    
    try {
      setIsLoading(true);
      onLoadingChange?.(true);
      
      const nirTiff = await fromUrl(nirUrl);
      const swirTiff = await fromUrl(swirUrl);
      const nirImage = await nirTiff.getImage(0);
      const swirImage = await swirTiff.getImage(0);
      
      const nirResolution = nirImage.getResolution();
      const swirResolution = swirImage.getResolution();
      
      // Instead of reading the whole image, get the bounds for our area of interest
      console.log('Getting bounding box for subset...');
      // Transform map extent to image's coordinate space
      const mapBboxWgs84 = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
      
      // Get image's bounding box
      const nirBbox = nirImage.getBoundingBox();
      const swirBbox = swirImage.getBoundingBox();
      
      console.log('NIR image bbox:', nirBbox);
      console.log('SWIR image bbox:', swirBbox);
      console.log('Map bbox WGS84:', mapBboxWgs84);
      
      // Calculate the window coordinates (pixel space) for our area of interest in NIR image
      const nirImageWidth = nirImage.getWidth();
      const nirImageHeight = nirImage.getHeight();
      
      // Calculate percentage of the way through the image
      // Map each coordinate from the geographic space to pixel space
      let nirX1 = Math.max(0, Math.floor(nirImageWidth * (mapBboxWgs84[0] - nirBbox[0]) / (nirBbox[2] - nirBbox[0])));
      let nirY1 = Math.max(0, Math.floor(nirImageHeight * (1 - (mapBboxWgs84[3] - nirBbox[1]) / (nirBbox[3] - nirBbox[1]))));
      let nirX2 = Math.min(nirImageWidth, Math.ceil(nirImageWidth * (mapBboxWgs84[2] - nirBbox[0]) / (nirBbox[2] - nirBbox[0])));
      let nirY2 = Math.min(nirImageHeight, Math.ceil(nirImageHeight * (1 - (mapBboxWgs84[1] - nirBbox[1]) / (nirBbox[3] - nirBbox[1]))));
      
      // Make sure we have valid window dimensions
      const validWindow = nirX2 > nirX1 && nirY2 > nirY1;
      
      if (!validWindow) {
        console.error('❌ Invalid window dimensions:', { nirX1, nirY1, nirX2, nirY2 });
        console.log('Falling back to whole image');
        // Fall back to whole image if the window is invalid
        nirX1 = 0;
        nirY1 = 0;
        nirX2 = nirImageWidth;
        nirY2 = nirImageHeight;
      }
      
      console.log('✅ Using window for rasters:', { nirX1, nirY1, nirX2, nirY2 });
      
      // Calculate equivalent window for SWIR image (which might have different dimensions)
      const swirImageWidth = swirImage.getWidth();
      const swirImageHeight = swirImage.getHeight();
      const swirX1 = Math.floor(nirX1 * swirImageWidth / nirImageWidth);
      const swirY1 = Math.floor(nirY1 * swirImageHeight / nirImageHeight);
      const swirX2 = Math.ceil(nirX2 * swirImageWidth / nirImageWidth);
      const swirY2 = Math.ceil(nirY2 * swirImageHeight / nirImageHeight);

      console.log('SWIR window:', { swirX1, swirY1, swirX2, swirY2 });

      // Now read the subsets of both images
      const nirData = (await nirImage.readRasters({ window: [nirX1, nirY1, nirX2, nirY2] })) as TypedArray[];
      const swirData = (await swirImage.readRasters({ window: [swirX1, swirY1, swirX2, swirY2] })) as TypedArray[];

      const windowWidth = nirX2 - nirX1;
      const windowHeight = nirY2 - nirY1;
      const nbrArray = ndarray(new Float32Array(windowWidth * windowHeight), [windowHeight, windowWidth]);

      for (let y = 0; y < windowHeight; y++) {
        for (let x = 0; x < windowWidth; x++) {
          // Get raw pixel values
          const rawNir = (nirData[0] as TypedArray)[y * windowWidth + x];
          const rawSwir = (swirData[0] as TypedArray)[y * windowWidth + x];
          
          // Check for no data values (often 0 or very large values)
          if (rawNir === 0 || rawSwir === 0 || rawNir > 65000 || rawSwir > 65000) {
            nbrArray.set(y, x, -9999); // Set as no data
            continue;
          }
          
          // Scale values - Sentinel-2 typically stores values as integers that need scaling
          // Different sensors may need different scaling factors
          // For Sentinel-2, typical scale factor is 0.0001 for reflectance
          const scaleFactor = 0.0001;
          const nir = rawNir * scaleFactor;
          const swir = rawSwir * scaleFactor;
          
          // Calculate NBR: (NIR - SWIR) / (NIR + SWIR)
          const denominator = nir + swir;
          
          if (denominator > 0.001) { // Avoid division by values very close to zero
            const nbrValue = (nir - swir) / denominator;
            
            // Clamp NBR values to expected range (-1 to 1)
            if (nbrValue >= -1 && nbrValue <= 1) {
              nbrArray.set(y, x, nbrValue);
            } else {
              // If outside expected range, likely bad data
              nbrArray.set(y, x, -9999);
            }
          } else {
            nbrArray.set(y, x, -9999); // No data
          }
        }
      }

      const nbr2DArray: number[][] = [];
      for (let y = 0; y < nbrArray.shape[0]; y++) {
        const row: number[] = [];
        for (let x = 0; x < nbrArray.shape[1]; x++) {
          row.push(nbrArray.get(y, x));
        }
        nbr2DArray.push(row);
      }

      // Dynamically retrieve bbox from OLMap
      // Use the already defined mapBboxWgs84 from above

      nbrDataRef.current = {
        data: nbr2DArray,
        width: windowWidth,
        height: windowHeight,
        extent: extent // Use the original extent directly
      };

      // Calculate min and max values directly from the 2D array to avoid flattening
      let minValue = Infinity;
      let maxValue = -Infinity;

      for (let y = 0; y < nbrArray.shape[0]; y++) {
        for (let x = 0; x < nbrArray.shape[1]; x++) {
          const value = nbrArray.get(y, x);
          if (value !== -9999) // Exclude no-data values
          {
            if (value < minValue) minValue = value;
            if (value > maxValue) maxValue = value;
          }
        }
      }

      console.log('✅ NBR calculation completed. Min value:', minValue, 'Max value:', maxValue);

      // Render NBR data on the map using WebGL or ImageCanvas
      // Get geographic extents and properly georeference the NBR layer
      const nbrExtent = transformExtent(mapBboxWgs84, 'EPSG:4326', 'EPSG:3857');
      
      // Create a static canvas that doesn't change with each render
      const canvas = document.createElement('canvas');
      canvas.width = windowWidth;
      canvas.height = windowHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context for canvas');
        return;
      }

      const imageData = ctx.createImageData(windowWidth, windowHeight);

      // Render the NBR values to the canvas
      for (let y = 0; y < windowHeight; y++) {
        for (let x = 0; x < windowWidth; x++) {
          const value = nbrArray.get(y, x);
          const [r, g, b, a] = getNBRColor(value);
          const index = (y * windowWidth + x) * 4;
          imageData.data[index] = r;
          imageData.data[index + 1] = g;
          imageData.data[index + 2] = b;
          imageData.data[index + 3] = a;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Skip GeoTIFF creation as it's causing errors and isn't necessary for display
      
      // Create a properly georeferenced layer using static canvas
      const nbrLayer = new ImageLayer({
        source: new ImageCanvasSource({
          canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
            // The canvas is already populated with our NBR visualization
            return canvas;
          },
          projection: 'EPSG:3857',
          ratio: 1
        }),
        extent: nbrExtent, // Apply extent to the layer itself, not the source
        zIndex: 50,
        opacity: 0.8
      });
      
      // Critical: Set the name so we can find it later
      nbrLayer.set('name', 'NBRLayer');
      
      // Don't set extent to avoid locking the view
      // This ensures the user can still pan and zoom freely
      
      // Critical: Explicitly prevent extent locking
    //   nbrLayer.setExtent(undefined);
      
      // Save the current map view state before adding the layer
      if (!mapInstance) return;
      const view = mapInstance.getView();
      const currentCenter = view.getCenter();
      const currentZoom = view.getZoom();
      const currentRotation = view.getRotation();
      
      // Find and remove any existing NBR layers
      const layers = mapInstance.getLayers().getArray();
      for (const layer of layers) {
        if (layer.get('name') === 'NBRLayer') {
          mapInstance.removeLayer(layer);
        }
      }
      
      // Add the new NBR layer
      mapInstance.addLayer(nbrLayer);
      
      // Critical: Find the fire perimeters layer
      const firePerimetersLayer = layers.find(layer => {
        if (layer.get('name') === 'firePerimeters') {
          return true;
        }
        
        // Need to cast to handle TileLayer with TileWMS source
        try {
          // @ts-ignore - TileLayer with WMS source
          const source = layer.getSource();
          if (source && typeof source.getParams === 'function') {
            const params = source.getParams();
            return params && params.LAYERS === 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP';
          }
        } catch (e) {
          // Ignore errors from invalid layers
        }
        
        return false;
      });
      
      // If found, ensure it's on top and visible
      if (firePerimetersLayer) {
        // Move fire perimeters layer to top
        mapInstance.removeLayer(firePerimetersLayer);
        firePerimetersLayer.setZIndex(200);
        firePerimetersLayer.setVisible(true);
        mapInstance.addLayer(firePerimetersLayer);
      }
      
      // Restore the map view to what it was before
      if (currentCenter && currentZoom !== undefined) {
        view.setCenter(currentCenter);
        view.setZoom(currentZoom);
        if (currentRotation !== undefined) {
          view.setRotation(currentRotation);
        }
      }
      
      console.log('✅ NBR layer added with fire perimeters layer on top');
      
      // Turn off recent imagery layer if it exists
      const recentImageryLayer = layers.find(layer => layer.get('name') === 'recentImagery');
      if (recentImageryLayer) {
        recentImageryLayer.setVisible(false);
      }

      // Call the completion callback with min/max values
      onCalculationComplete?.(minValue, maxValue);

    } catch (error) {
      console.error('Error during NBR calculation:', error);
      setIsNBRProcessed(false); // Reset so user can try again
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [nirUrl, swirUrl, extent, isNBRProcessed, calculationKey, onLoadingChange, onCalculationComplete, mapInstance]);

  useEffect(() => {
    if (visible) {
      calculateNBR();
    }
  }, [visible, calculateNBR]);

  // Ensure the component returns a valid React element
  return null; // Replace with actual JSX if needed
};

export { NBRCalculator };