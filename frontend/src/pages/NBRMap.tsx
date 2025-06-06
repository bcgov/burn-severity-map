import React, { useState } from 'react';
import '../style.scss';
import './NBRMap.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector from '../components/ol-maps/FireSelector';
import SatelliteToggle from '../components/ol-maps/SatelliteToggle';
import NBRToggle from '../components/ol-maps/NBRToggle';
import PreBurnToggle from '../components/ol-maps/PreBurnToggle';
import PostBurnToggle from '../components/ol-maps/PostBurnToggle';

// Fire interface to track fire data
interface Fire {
  id: string;
  fireNumber: string;
  geometry: any;
  extent: number[];
}

function NBRMap() {
  const [basemap, setBasemap] = useState('osm');
  // Set initial center and zoom for all of British Columbia
  const [center] = useState<[number, number]>([-126.5, 54.5]); // Approximate center of BC
  const [zoom] = useState(5); // Zoomed out to show the whole province
  const [fires, setFires] = useState<Fire[]>([]);
  const [selectedFire, setSelectedFire] = useState<string | null>(null);
  const [showSatelliteImagery, setShowSatelliteImagery] = useState<boolean>(false);
  const [showPreBurnImagery, setShowPreBurnImagery] = useState<boolean>(false);
  const [showPostBurnImagery, setShowPostBurnImagery] = useState<boolean>(false);
  const [showNBR, setShowNBR] = useState<boolean>(false);
  const [isNBRLoading, setIsNBRLoading] = useState<boolean>(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(false);
  const [fireProperties, setFireProperties] = useState<any | null>(null); // Add state for fire properties
  const [preBurnDates, setPreBurnDates] = useState<string[]>([]);
  const [selectedPreBurnDate, setSelectedPreBurnDate] = useState<string | null>(null);
  // Add post-burn state
  const [postBurnDates, setPostBurnDates] = useState<string[]>([]);
  const [selectedPostBurnDate, setSelectedPostBurnDate] = useState<string | null>(null);
  const [preBurnVisualUrl, setPreBurnVisualUrl] = useState<string | null>(null);
  const [preBurnNirUrl, setPreBurnNirUrl] = useState<string | null>(null);
  const [preBurnSwirUrl, setPreBurnSwirUrl] = useState<string | null>(null);
  const [preBurnMetadata, setPreBurnMetadata] = useState<any | null>(null); // New state for pre-burn metadata

  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
  };

  const handleFiresLoaded = (loadedFires: Fire[]) => {
    setFires(loadedFires);
  };

  const handleFireSelect = (fireNumber: string | null) => {
    setSelectedFire(fireNumber);
    // Reset other states when fire changes
    if (fireNumber !== selectedFire) {
      setShowSatelliteImagery(false);
      setShowNBR(false);
      setFireProperties(null); // Reset fire properties when fire selection changes
    }
  };
  
  // New handler for receiving fire properties
  const handleFireProperties = (properties: any | null) => {
    setFireProperties(properties);
  };

  const handleSatelliteToggle = () => {
    setShowSatelliteImagery(!showSatelliteImagery);
    // Reset NBR when satellite imagery is toggled off
    if (showSatelliteImagery) {
      setShowNBR(false);
    }
  };

  const handlePreBurnToggle = () => {
    setShowPreBurnImagery((prev) => {
      if (!prev) setShowPostBurnImagery(false); // Only one can be active at a time
      return !prev;
    });
    setShowSatelliteImagery(false); // Remove legacy toggle
    setShowNBR(false);
  };
  const handlePostBurnToggle = () => {
    setShowPostBurnImagery((prev) => {
      if (!prev) setShowPreBurnImagery(false); // Only one can be active at a time
      return !prev;
    });
    setShowSatelliteImagery(false); // Remove legacy toggle
    setShowNBR(false);
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

  // Listen for fire-point-selected event from OLMap
  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && e.detail.fireNumber) {
        setSelectedFire(e.detail.fireNumber);
      }
    };
    window.addEventListener('fire-point-selected', handler);
    return () => window.removeEventListener('fire-point-selected', handler);
  }, []);

  // Variables to store ignition and fire out dates for use in STAC queries
  const ignitionDate = fireProperties?.IGNITION_DATE || null;
  const fireOutDate = fireProperties?.FIRE_OUT_DATE || null;

  // Handler for available pre-burn dates from OLMap
  const handlePreBurnDates = (dates: string[]) => {
    setPreBurnDates(dates);
    // Do not auto-select the most recent date
    // if (dates.length > 0 && !selectedPreBurnDate) {
    //   setSelectedPreBurnDate(dates[0]);
    // }
  };
  // Handler for available post-burn dates from OLMap
  const handlePostBurnDates = (dates: string[]) => {
    setPostBurnDates(dates);
    if (dates.length > 0 && !selectedPostBurnDate) {
      setSelectedPostBurnDate(dates[0]);
    }
  };

  // Handler for dropdown change
  const handlePreBurnDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPreBurnDate(e.target.value);
  };
  const handlePostBurnDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPostBurnDate(e.target.value);
  };

  // Reset selected dates and lists when fire or toggles change
  React.useEffect(() => {
    setSelectedPreBurnDate(null);
    setPreBurnDates([]);
    setPreBurnMetadata(null);
    setPreBurnVisualUrl(null);
    setPreBurnNirUrl(null);
    setPreBurnSwirUrl(null);
  }, [selectedFire, showPreBurnImagery]);
  React.useEffect(() => {
    setSelectedPostBurnDate(null);
    setPostBurnDates([]);
  }, [selectedFire, showPostBurnImagery]);

  // Handler for selecting a STAC item from PreBurnToggle
  const handlePreBurnStacSelect = (stacItem: any) => {
    if (stacItem && stacItem.assets) {
      setPreBurnVisualUrl(stacItem.assets.visual?.href || null);
      setPreBurnNirUrl(stacItem.assets.nir08?.href || null);
      setPreBurnSwirUrl(stacItem.assets.swir22?.href || null);
      // Extract and store all relevant metadata for the selected STAC item
      setPreBurnMetadata({
        date: stacItem.properties.datetime || null,
        cloudCover: stacItem.properties['eo:cloud_cover'] || null,
        collection: stacItem.collection || null,
        source: 'Sentinel-2',
        resolution: stacItem.properties.gsd ? `${stacItem.properties.gsd}m` : '10m',
        bandInfo: stacItem.properties['eo:bands']
          ? stacItem.properties['eo:bands'].map((band: any) => band.common_name || band.name).join(', ')
          : 'RGB (true color)',
        assetType: stacItem.assets.visual?.title || 'Visual'
      });
      // Optionally log for debug
      console.log('Pre-burn visual:', stacItem.assets.visual?.href);
      console.log('Pre-burn NIR08:', stacItem.assets.nir08?.href);
      console.log('Pre-burn SWIR22:', stacItem.assets.swir22?.href);
    }
  };

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
              <div className="bcgov-legend-symbol bcgov-fire-perimeter-symbol"></div>
              <span>Active Wildfire Perimeters</span>
            </div>
            {showPreBurnImagery && (
              <div className="bcgov-legend-item">
                <div className="bcgov-legend-symbol" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                  border: '1px dashed #555' 
                }}></div>
                <span>Pre-Burn Imagery</span>
              </div>
            )}
            {showPostBurnImagery && (
              <div className="bcgov-legend-item">
                <div className="bcgov-legend-symbol" style={{ 
                  backgroundColor: 'rgba(0, 0, 255, 0.7)', 
                  border: '1px dashed #555' 
                }}></div>
                <span>Post-Burn/Current Imagery</span>
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
              <div className="satellite-toggle-group">
                <div className="satellite-toggle-item">
                  <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Pre-Burn Imagery</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PreBurnToggle
                      isActive={showPreBurnImagery}
                      onToggle={handlePreBurnToggle}
                      ignitionDate={ignitionDate}
                      bbox={(() => {
                        const fire = fires.find(f => f.fireNumber === selectedFire);
                        return fire && fire.extent && fire.extent.length === 4 ? fire.extent : null;
                      })()}
                      onStacSelect={handlePreBurnStacSelect}
                    />
                    <span style={{ marginLeft: 8 }}>Sentinel 2 True Color</span>
                  </div>
                </div>
                <div className="satellite-toggle-item" style={{ marginTop: 12 }}>
                  <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Post-Burn/ Current Imagery</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PostBurnToggle
                      isActive={showPostBurnImagery}
                      onToggle={handlePostBurnToggle}
                    />
                    <span style={{ marginLeft: 8 }}>Sentinel 2 True Color</span>
                  </div>
                  {/* Post-burn date selector */}
                  {showPostBurnImagery && postBurnDates.length > 0 && (
                    <select
                      value={selectedPostBurnDate || ''}
                      onChange={handlePostBurnDateChange}
                      style={{ marginTop: 8, width: '100%' }}
                    >
                      {postBurnDates.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <NBRToggle
                isActive={showNBR}
                onToggle={handleNBRToggle}
                isLoading={isNBRLoading}
                disabled={!(showPreBurnImagery || showPostBurnImagery)}
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
              showPreBurnImagery={showPreBurnImagery}
              showPostBurnImagery={showPostBurnImagery}
              ignitionDate={ignitionDate}
              fireOutDate={fireOutDate}
              showNBR={showNBR}
              onNbrLoadingChange={handleNBRLoadingChange}
              onFireSelect={handleFireProperties}
              onPreBurnDates={handlePreBurnDates}
              selectedPreBurnDate={selectedPreBurnDate}
              // New props for post-burn
              onPostBurnDates={handlePostBurnDates}
              selectedPostBurnDate={selectedPostBurnDate}
              // Pass pre-burn COGs
              preBurnVisualUrl={preBurnVisualUrl}
              preBurnNirUrl={preBurnNirUrl}
              preBurnSwirUrl={preBurnSwirUrl}
              // Pass pre-burn metadata
              preBurnMetadata={preBurnMetadata}
            />
          </div>
          
          <div className="bcgov-basemap-selector">
            <h4>Basemap</h4>
            <BasemapSelector selectedBasemap={basemap} onBasemapChange={handleBasemapChange} />
          </div>
        </div>

        {/* Right Panel - Fire Details (updated) */}
        <div className="right-panel">
          <h3>Fire Details</h3>
          {selectedFire && fireProperties ? (
            <div className="fire-details-content">
              <table className="fire-details-table">
                <tbody>
                  <tr>
                    <th>Fire Number</th>
                    <td>{fireProperties.FIRE_NUMBER || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Ignition Date</th>
                    <td>{fireProperties.IGNITION_DATE ? new Date(fireProperties.IGNITION_DATE).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Fire Out Date</th>
                    <td>{fireProperties.FIRE_OUT_DATE ? new Date(fireProperties.FIRE_OUT_DATE).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Fire Status</th>
                    <td>{fireProperties.FIRE_STATUS || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Geographic Description</th>
                    <td>{fireProperties.GEOGRAPHIC_DESCRIPTION || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Fire Area (ha)</th>
                    <td>{fireProperties.CURRENT_SIZE ? Number(fireProperties.CURRENT_SIZE).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Fire URL</th>
                    <td>
                      {fireProperties.FIRE_URL ? (
                        <a href={fireProperties.FIRE_URL} target="_blank" rel="noopener noreferrer">
                          View Fire Info
                        </a>
                      ) : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
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
