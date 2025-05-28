import React, { useState } from 'react';
import '../style.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector from '../components/ol-maps/FireSelector';
import SatelliteToggle from '../components/ol-maps/SatelliteToggle';
import NBRToggle from '../components/ol-maps/NBRToggle';

// Fire interface to track fire data
interface Fire {
  id: string;
  fireNumber: string;
  geometry: any;
  extent: number[];
}

function NBRMap() {
  const [basemap, setBasemap] = useState('osm');
  const [center] = useState<[number, number]>([-123.3656, 48.4284]); // Victoria, BC
  const [zoom] = useState(10);
  const [fires, setFires] = useState<Fire[]>([]);
  const [selectedFire, setSelectedFire] = useState<string | null>(null);
  const [showSatelliteImagery, setShowSatelliteImagery] = useState<boolean>(false);
  const [showNBR, setShowNBR] = useState<boolean>(false);
  const [isNBRLoading, setIsNBRLoading] = useState<boolean>(false);

  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
  };

  const handleFiresLoaded = (loadedFires: Fire[]) => {
    setFires(loadedFires);
  };

  const handleFireSelect = (fireNumber: string | null) => {
    setSelectedFire(fireNumber);
    // Reset satellite imagery and NBR when fire changes
    if (fireNumber !== selectedFire) {
      setShowSatelliteImagery(false);
      setShowNBR(false);
    }
  };

  const handleSatelliteToggle = () => {
    setShowSatelliteImagery(!showSatelliteImagery);
    // Reset NBR when satellite imagery is toggled off
    if (showSatelliteImagery) {
      setShowNBR(false);
    }
  };

  const handleNBRToggle = () => {
    setShowNBR(!showNBR);
  };

  const handleNBRLoadingChange = (loading: boolean) => {
    setIsNBRLoading(loading);
  };

  return (
    <div className="App">
      {/* New Three-Column Layout */}
      <div className="app-layout">
        {/* Left Panel: Fire Selector, Satellite Toggle, and Legend */}
        <div className="left-panel">
          <h3>Fire Selection</h3>
          <FireSelector 
            fires={fires}
            onFireSelect={handleFireSelect}
            selectedFire={selectedFire}
          />
          
          {/* Only show satellite toggle when a fire is selected */}
          {selectedFire && (
            <div style={{ marginTop: '20px' }}>
              <h3>Imagery Options</h3>
              <SatelliteToggle 
                isActive={showSatelliteImagery}
                onToggle={handleSatelliteToggle}
              />
              
              {/* Only enable NBR toggle when satellite imagery is enabled */}
              <NBRToggle
                isActive={showNBR}
                onToggle={handleNBRToggle}
                isLoading={isNBRLoading}
                disabled={!showSatelliteImagery}
              />
            </div>
          )}
          
          {/* Legend */}
          <div className="bcgov-map-legend">
            <h3>Legend</h3>
            <div className="bcgov-legend-item">
              <div className="bcgov-legend-symbol" style={{ backgroundColor: 'red' }}></div>
              <span>Active Wildfires</span>
            </div>
            <div className="bcgov-legend-item">
              <div className="bcgov-legend-symbol" style={{ backgroundColor: 'yellow' }}></div>
              <span>Selected Fire</span>
            </div>
            {showSatelliteImagery && (
              <div className="bcgov-legend-item">
                <div className="bcgov-legend-symbol" style={{ 
                  backgroundImage: 'linear-gradient(45deg, rgba(0, 128, 0, 0.5), rgba(0, 0, 255, 0.5))', 
                  border: '1px dashed #555' 
                }}></div>
                <span>Sentinel-2 Imagery</span>
              </div>
            )}
            {showNBR && (
              <>
                <div className="bcgov-legend-item">
                  <div className="bcgov-legend-symbol" style={{ backgroundColor: 'rgb(220, 0, 0)' }}></div>
                  <span>High Severity Burn</span>
                </div>
                <div className="bcgov-legend-item">
                  <div className="bcgov-legend-symbol" style={{ backgroundColor: 'rgb(255, 150, 0)' }}></div>
                  <span>Moderate Burn</span>
                </div>
                <div className="bcgov-legend-item">
                  <div className="bcgov-legend-symbol" style={{ backgroundColor: 'rgb(255, 255, 0)' }}></div>
                  <span>Low/No Burn</span>
                </div>
                <div className="bcgov-legend-item">
                  <div className="bcgov-legend-symbol" style={{ backgroundColor: 'rgb(0, 100, 0)' }}></div>
                  <span>Healthy Vegetation</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Panel: Map */}
        <div className="center-panel">
          <OLMap 
            center={center} 
            zoom={zoom} 
            basemap={basemap}
            onFiresLoaded={handleFiresLoaded}
            selectedFire={selectedFire}
            showSatelliteImagery={showSatelliteImagery}
            showNBR={showNBR}
            onNbrLoadingChange={handleNBRLoadingChange}
          />
          
          {/* Basemap selector - inside map but in a corner */}
          <div className="bcgov-basemap-selector" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1,
            backgroundColor: 'white',
            padding: '5px',
            borderRadius: '3px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
          }}>
            <h4 style={{ margin: '0 0 5px 0' }}>Basemap</h4>
            <BasemapSelector selectedBasemap={basemap} onBasemapChange={handleBasemapChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NBRMap;
