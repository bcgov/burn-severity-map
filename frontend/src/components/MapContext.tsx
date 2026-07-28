
// src/MapContext.ts
import React from 'react';
import type { Map } from 'ol';
// import { Fire } from './FireSelector';
import { FireOption } from './FireDataContext';

type MapContextType = {
  map: Map | null;
  bounds: any; // You can refine this later
  addPreviewLayer: (url: string) => void;
  removePreviewLayer: () => void;
  // addFireBoundary: (fireNumber: string) => void;
  addAnalysisLayer: () => void;
  updateMapView: (centre: [number,number], zoom: number) => void; //centre: [lon, lat]
  selectedFire: FireOption | null;
  setSelectedFire: (fire: FireOption | null) => void;
  analysisFire: string | null;
  setAnalysisFire: (fireNumber: string | null) => void;
};

export const MapContext = React.createContext<MapContextType>({
  map: null,
  bounds: null,
  addPreviewLayer: () => {},
  removePreviewLayer: () => {},
  // addFireBoundary: () => {},
  addAnalysisLayer: () => {},
  updateMapView: () => {},
  selectedFire: null,
  setSelectedFire: () => {},
  analysisFire: null,
  setAnalysisFire: () => {}
});
