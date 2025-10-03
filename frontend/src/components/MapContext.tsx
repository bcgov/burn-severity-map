
// src/MapContext.ts
import React from 'react';
import type { Map } from 'ol';
import { Fire } from './FireSelector';

type MapContextType = {
  map: Map | null;
  bounds: any; // You can refine this later
  addPreviewLayer: (url: string) => void;
  addFireBoundary: (fireNumber: string) => void;
  updateMapView: (centre: [number,number], zoom: number) => void; //centre: [lon, lat]
  selectedFire: Fire | null;
  setSelectedFire: (fire: Fire | null) => void;
  analysisFire: string | null;
  setAnalysisFire: (fireNumber: string | null) => void;
};

export const MapContext = React.createContext<MapContextType>({
  map: null,
  bounds: null,
  addPreviewLayer: () => {},
  addFireBoundary: () => {},
  updateMapView: () => {},
  selectedFire: null,
  setSelectedFire: () => {},
  analysisFire: null,
  setAnalysisFire: () => {}
});
