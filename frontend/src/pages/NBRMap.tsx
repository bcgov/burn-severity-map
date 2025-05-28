import React, { useState, useEffect } from 'react';
import '../style.scss';
import './NBRMap.scss';
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
  properties?: any; // Add properties to store fire attributes
}

function NBRMap() {
  const [basemap, setBasemap] = useState('osm');
  const [center] = useState<[number, number]>([-123.3656, 48.4284]); // Victoria, BC
  const [zoom] = useState(10);
  const [fires, setFires] = useState<Fire[]>([]);
  const [selectedFire, setSelectedFire] = useState<string | null>(null);
  const [selectedFireDetails, setSelectedFireDetails] = useState<any>(null);
  const [showSatelliteImagery, setShowSatelliteImagery] = useState<boolean>(false);
  const [showNBR, setShowNBR] = useState<boolean>(false);
  const [isNBRLoading, setIsNBRLoading] = useState<boolean>(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(false);

  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
  };

  const handleFiresLoaded = (loadedFires: Fire[]) => {
    setFires(loadedFires);
  };

  const handleFireSelect = (fireNumber: string | null) => {
    setSelectedFire(fireNumber);
    
    // Find the selected fire details
    if (fireNumber) {
      const fireDetails = fires.find(fire => fire.fireNumber === fireNumber);
      setSelectedFireDetails(fireDetails?.properties || null);
    } else {
      setSelectedFireDetails(null);
    }
    
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

  const toggleInfoPanel = () => {
    setIsInfoExpanded(!isInfoExpanded);
  };

  // Effect to update selectedFireDetails when fires array updates and a fire is already selected
  useEffect(() => {
    if (selectedFire && fires.length > 0) {
      const fireDetails = fires.find(fire => fire.fireNumber === selectedFire);
      setSelectedFireDetails(fireDetails?.properties || null);
    }
  }, [fires, selectedFire]);

  return (
    <div className="App">
      {/* Info Section - Now a collapsible panel */}
      <div className="info-section-container">
        <div className="info-section-header" onClick={toggleInfoPanel}>
          <h2>Burn Severity Analysis</h2>
          <button className="info-toggle-button">
            {isInfoExpanded ? '▲' : '▼'}
          </button>
        </div>

        {isInfoExpanded && (
          <div className="info-section-content">
            <p>This tool allows you to analyze the burn severity of wildfires using the Normalized Burn Ratio (NBR) index.</p>
            
            <div className="info-columns">
              <div className="info-column">
                <h3>How to use:</h3>
                <ol>
                  <li>Select a fire from the list on the left</li>
                  <li>Enable Sentinel-2 satellite imagery</li>
                  <li>Toggle the NBR visualization</li>
                  <li>View the results in the map</li>
                </ol>
              </div>
              
              <div className="info-column">
                <h3>About NBR</h3>
                <p>The Normalized Burn Ratio is calculated using the Near-Infrared (NIR) and Short-Wave Infrared (SWIR) bands:</p>
                <p><strong>NBR = (NIR - SWIR) / (NIR + SWIR)</strong></p>
                <p>NBR values range from -1 to +1, where:</p>
                <ul>
                  <li>-1.0 to -0.25: High severity burn</li>
                  <li>-0.25 to -0.1: Moderate severity burn</li>
                  <li>-0.1 to +0.1: Low/unburned</li>
                  <li>+0.1 to +1.0: Healthy vegetation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="app-layout">
        {/* Left Panel - Fire Selection and Controls */}
        <div className="left-panel">
          {/* 1. Wildfire Selector */}
          <h3>Fire Selection</h3>
          <FireSelector 
            fires={fires}
            onFireSelect={handleFireSelect}
            selectedFire={selectedFire}
          />

          {/* 2. Legend */}
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

          {/* 3. Satellite Toggle and 4. NBR Toggle */}
          {selectedFire && (
            <div className="controls-section">
              <h3>Analysis Tools</h3>
              <SatelliteToggle 
                isActive={showSatelliteImagery}
                onToggle={handleSatelliteToggle}
              />
              <NBRToggle
                isActive={showNBR}
                onToggle={handleNBRToggle}
                isLoading={isNBRLoading}
                disabled={!showSatelliteImagery}
              />
            </div>
          )}
        </div>

        {/* Center Panel - Map */}
        <div className="center-panel">
          <div className="map-container">
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
          </div>
          
          <div className="bcgov-basemap-selector">
            <h4>Basemap</h4>
            <BasemapSelector selectedBasemap={basemap} onBasemapChange={handleBasemapChange} />
          </div>
        </div>

        {/* Right Panel - Fire Details with Table */}
        <div className="right-panel">
          <h3>Fire Details</h3>
          {selectedFire ? (
            <div className="fire-details-content">
              {selectedFireDetails ? (
                <table className="fire-details-table">
                  <tbody>
                    <tr>
                      <th>Fire Number</th>
                      <td>{selectedFireDetails.FIRE_NUMBER || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Fire Status</th>
                      <td>{selectedFireDetails.FIRE_STATUS || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Fire Size (ha)</th>
                      <td>{selectedFireDetails.FIRE_SIZE_HECTARES !== undefined ? 
                          selectedFireDetails.FIRE_SIZE_HECTARES.toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                          }) : 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Fire URL</th>
                      <td>
                        {selectedFireDetails.FIRE_URL ? (
                          <a href={selectedFireDetails.FIRE_URL} target="_blank" rel="noopener noreferrer">
                            View fire details
                          </a>
                        ) : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <th>Load Date</th>
                      <td>
                        {selectedFireDetails.LOAD_DATE ? 
                          new Date(selectedFireDetails.LOAD_DATE).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Loading fire details...</p>
              )}
            </div>
          ) : (
            <div className="no-fire-selected">
              <p>Select a fire to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NBRMap;
