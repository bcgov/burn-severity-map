import React, { useState } from 'react';
import '../style.scss';
import './NBRMap.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector from '../components/ol-maps/FireSelector';
import FireSelector_db from '../components/ol-maps/FireSelector_db';
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

// DbFire interface for records from database
interface DbFire {
  id: string;
  fireNumber: string;
  fire_number: string;
  pre_image_date: string;
  post_image_date: string;
  severity_class: string;
  severty_class: string; // Handle both spellings for compatibility
  [key: string]: any; // Allow for additional properties
}

// Fire properties interface
interface FireProperties {
  _isDbRecord?: boolean;
  _isLoading?: boolean;
  _hasError?: boolean;
  _errorMessage?: string;
  FIRE_NUMBER: string;
  PRE_FIRE_IMAGE_DATE?: string;
  POST_FIRE_IMAGE_DATE?: string;
  BURN_SEVERITY_RATING?: string;
  FIRE_STATUS?: string;
  COMMENTS?: string;
  AREA_HA?: number | null;
  FIRE_YEAR?: number | null;
  IGNITION_DATE?: string | null;
  FIRE_OUT_DATE?: string | null;
  GEOGRAPHIC_DESCRIPTION?: string;
  [key: string]: any; // Allow for additional properties
}

function NBRMap() {
  const [basemap, setBasemap] = useState('osm');
  // Set initial center and zoom for all of British Columbia
  const [center] = useState<[number, number]>([-126.5, 54.5]); // Approximate center of BC
  const [zoom] = useState(5); // Zoomed out to show the whole province
  const [fires, setFires] = useState<Fire[]>([]);
  const [selectedFire, setSelectedFire] = useState<string | null>(null);
  // Add state for database fires
  const [dbFires, setDbFires] = useState<DbFire[]>([]);
  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
  const [showSatelliteImagery, setShowSatelliteImagery] = useState<boolean>(false);
  const [showPreBurnImagery, setShowPreBurnImagery] = useState<boolean>(false);
  const [showPostBurnImagery, setShowPostBurnImagery] = useState<boolean>(false);
  const [showNBR, setShowNBR] = useState<boolean>(false);
  const [isNBRLoading, setIsNBRLoading] = useState<boolean>(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(false);
  const [fireProperties, setFireProperties] = useState<FireProperties | null>(null); // Add state for fire properties
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
  
  // Handler for when database fires are loaded
  const handleDbFiresLoaded = (loadedDbFires: DbFire[]) => {
    setDbFires(loadedDbFires);
    console.log('DB fires loaded:', loadedDbFires);
  };

  const handleFireSelect = (fireNumber: string | null) => {
    setSelectedFire(fireNumber);
    // Reset other states when fire changes
    if (fireNumber !== selectedFire) {
      setShowSatelliteImagery(false);
      setShowNBR(false);
      setFireProperties(null); // Reset fire properties when fire selection changes
      
      // Reset DB fire selection when a current wildfire is selected
      setSelectedDbFire(null);
    }
  };
  
  // Function to fetch fire details from the database
  const fetchDbFireDetails = async (fireNumber: string) => {
    try {
      console.log('Getting details for DB fire:', fireNumber);
      
      // Since the /burn-severity/{fire_number} endpoint doesn't work,
      // let's use the data we already have in dbFires or
      // fetch all records and filter for the one we need
      
      // First check if we already have the fire in our dbFires state
      const existingFire = dbFires.find(fire => fire.fireNumber === fireNumber);
      
      if (existingFire) {
        console.log('Using existing DB fire data:', existingFire);
        
        // Transform the existing data into the format expected by the UI
        const fireProps: FireProperties = {
          _isDbRecord: true,
          FIRE_NUMBER: existingFire.fireNumber,
          PRE_FIRE_IMAGE_DATE: existingFire.pre_image_date,
          POST_FIRE_IMAGE_DATE: existingFire.post_image_date,
          BURN_SEVERITY_RATING: existingFire.severty_class,
          FIRE_STATUS: 'Processed',
          COMMENTS: `Severity: ${existingFire.severty_class}`,
          AREA_HA: null as number | null, // We don't have this data
          FIRE_YEAR: existingFire.pre_image_date ? new Date(existingFire.pre_image_date).getFullYear() : null,
          
          // Add these as aliases for compatibility with the UI
          IGNITION_DATE: existingFire.pre_image_date,
          FIRE_OUT_DATE: existingFire.post_image_date,
          GEOGRAPHIC_DESCRIPTION: `Burn Severity: ${existingFire.severty_class}`
        };
        
        return fireProps;
      }
      
      // If we don't have the fire in our state, fetch all records again
      const response = await fetch('/burn-records/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch fire records: ${response.statusText}`);
      }
      
      const allFires = await response.json();
      console.log('All DB fires:', allFires);
      
      // Find the fire we're looking for
      const targetFire = allFires.find((fire: DbFire) => fire.fire_number === fireNumber);
      
      if (targetFire) {
        console.log('Found target fire in all records:', targetFire);
        
        // Transform the data into the format expected by the UI
        const fireProps: FireProperties = {
          _isDbRecord: true,
          FIRE_NUMBER: targetFire.fire_number,
          PRE_FIRE_IMAGE_DATE: targetFire.pre_image_date,
          POST_FIRE_IMAGE_DATE: targetFire.post_image_date,
          BURN_SEVERITY_RATING: targetFire.severity_class,
          FIRE_STATUS: 'Processed',
          COMMENTS: `Severity: ${targetFire.severity_class}`,
          AREA_HA: null as number | null, // We don't have this data
          FIRE_YEAR: targetFire.pre_image_date ? new Date(targetFire.pre_image_date).getFullYear() : null,
          
          // Add these as aliases for compatibility with the UI
          IGNITION_DATE: targetFire.pre_image_date,
          FIRE_OUT_DATE: targetFire.post_image_date,
          GEOGRAPHIC_DESCRIPTION: `Burn Severity: ${targetFire.severity_class}`
        };
        
        return fireProps;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting DB fire details:', error);
      return null;
    }
  };
  
  // Handler for DB fire selection
  const handleDbFireSelect = (fireNumber: string | null) => {
    // Only update if the selection has actually changed
    if (selectedDbFire !== fireNumber) {
      setSelectedDbFire(fireNumber);
      console.log('Selected DB fire:', fireNumber);
      
      // Reset current fire selection when a DB fire is selected
      setSelectedFire(null);
      
      // Reset visualization toggles
      setShowSatelliteImagery(false);
      setShowNBR(false);
      
      // If a fire is selected, fetch its details
      if (fireNumber) {
        // Set loading state to show user something is happening
        setFireProperties({ FIRE_NUMBER: fireNumber, _isLoading: true });
        
        fetchDbFireDetails(fireNumber)
          .then(properties => {
            if (properties) {
              setFireProperties(properties);
              console.log('DB fire properties loaded:', properties);
            } else {
              // Show error message if no data found
              console.warn('No data returned for DB fire:', fireNumber);
              setFireProperties({ 
                FIRE_NUMBER: fireNumber,
                _isDbRecord: true,
                _hasError: true,
                _errorMessage: 'No details found for this fire. The fire may not exist in the database.'
              });
            }
          })
          .catch(error => {
            console.error('Failed to load DB fire properties:', error);
            // Show error message to the user
            setFireProperties({ 
              FIRE_NUMBER: fireNumber,
              _isDbRecord: true, 
              _hasError: true,
              _errorMessage: 'Failed to load fire details. Please try again later.'
            });
          });
      } else {
        // Reset fire properties if no fire is selected
        setFireProperties(null);
      }
    }
  };
  
  // New handler for receiving fire properties
  const handleFireProperties = (properties: FireProperties | null) => {
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

  // Effect to coordinate selectors: ensure only one selector has an active selection
  React.useEffect(() => {
    // If both selectors have active selections, prioritize the most recent one
    if (selectedFire && selectedDbFire) {
      console.warn('Both fire selectors have active selections - this should not happen');
      // The most recent action would have set its state last, so no need to do anything here
    }
  }, [selectedFire, selectedDbFire]);

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
          {/* 1. Database Fire Selector */}
          <h3>Processed Burn Severity Fires</h3>
          <FireSelector_db
            fires={dbFires}
            onFireSelect={handleDbFireSelect}
            selectedFire={selectedDbFire}
          />
          
          {/* 2. Wildfire Selector */}
          <h3>Current Wildfires</h3>
          <FireSelector 
            fires={fires}
            onFireSelect={handleFireSelect}
            selectedFire={selectedFire}
          />

          {/* 3. Legend */}
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

          {/* 4. Satellite Toggle and 5. NBR Toggle */}
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
              onDbFiresLoaded={handleDbFiresLoaded}
              selectedFire={selectedFire}
              selectedDbFire={selectedDbFire}
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
        </div>        {/* Right Panel - Fire Details (updated) */}
        <div className="right-panel">
          <h3>{selectedDbFire ? 'Processed Burn Severity Fire Details' : 'Fire Details'}</h3>
          
          {!fireProperties && (
            <div className="no-fire-selected">
              <p>Select a fire to view details</p>
            </div>
          )}
          
          {fireProperties && fireProperties._isLoading && (
            <div className="loading-state">
              <p>Loading fire details...</p>
            </div>
          )}
          
          {fireProperties && fireProperties._hasError && (
            <div className="error-state">
              <p>{fireProperties._errorMessage || 'An error occurred while loading fire details.'}</p>
            </div>
          )}
          
          {fireProperties && !fireProperties._isLoading && !fireProperties._hasError && (
            <div className="fire-details-content">
              <table className="fire-details-table">
                <tbody>
                  {selectedDbFire && fireProperties._isDbRecord ? (
                    // Dynamic rendering of DB fire properties
                    Object.entries(fireProperties)
                      // Filter out properties we don't want to display
                      .filter(([key]) => {
                        // Exclude internal properties (starting with underscore)
                        if (key.startsWith('_')) return false;
                        
                        // Exclude geometry-related fields that don't make sense to display
                        if (key === 'geometry' || key === 'type' || key === 'bbox' || key === 'id') return false;
                        
                        // Exclude duplicated fields (those that are aliases of DB fields)
                        if (
                          key === 'IGNITION_DATE' && fireProperties.PRE_FIRE_IMAGE_DATE === fireProperties.IGNITION_DATE ||
                          key === 'FIRE_OUT_DATE' && fireProperties.POST_FIRE_IMAGE_DATE === fireProperties.FIRE_OUT_DATE ||
                          key === 'GEOGRAPHIC_DESCRIPTION' && fireProperties.COMMENTS === fireProperties.GEOGRAPHIC_DESCRIPTION ||
                          key === 'CURRENT_SIZE' && fireProperties.AREA_HA === fireProperties.CURRENT_SIZE
                        ) return false;
                        
                        return true;
                      })
                      // Sort properties alphabetically with FIRE_NUMBER first
                      .sort(([keyA], [keyB]) => {
                        // Always put FIRE_NUMBER first
                        if (keyA === 'FIRE_NUMBER') return -1;
                        if (keyB === 'FIRE_NUMBER') return 1;
                        
                        // Then sort other keys alphabetically
                        return keyA.localeCompare(keyB);
                      })
                      .map(([key, value]) => {
                        // Skip null or undefined values
                        if (value === null || value === undefined) return null;
                        
                        // Format the display key to be more readable
                        let displayKey = key
                          .replace(/_/g, ' ')  // Replace underscores with spaces
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize words
                          .join(' ');
                          
                        // Special case handling for common field names
                        if (key === 'FIRE_NUMBER') displayKey = 'Fire Number';
                        else if (key === 'PRE_FIRE_IMAGE_DATE') displayKey = 'Pre-Fire Image Date';
                        else if (key === 'POST_FIRE_IMAGE_DATE') displayKey = 'Post-Fire Image Date';
                        else if (key === 'AREA_HA') displayKey = 'Fire Area (ha)';
                        else if (key === 'BURN_SEVERITY_RATING') displayKey = 'Burn Severity Rating';
                        else if (key === 'FIRE_STATUS') displayKey = 'Fire Status';
                        else if (key === 'FIRE_YEAR') displayKey = 'Fire Year';
                        else if (key === 'COMMENTS') displayKey = 'Comments';
                        else if (key === 'FEATURE_AREA_SQM') displayKey = 'Area (sq m)';
                        else if (key === 'FEATURE_LENGTH_M') displayKey = 'Perimeter Length (m)';
                        
                        // Format the display value based on type
                        let displayValue: React.ReactNode = String(value);
                        
                        // Format date values
                        if (
                          typeof value === 'string' &&
                          (key.toUpperCase().includes('DATE') || key.toUpperCase().includes('_DATE'))
                        ) {
                          try {
                            displayValue = new Date(value).toLocaleDateString();
                          } catch (e) {
                            // If date parsing fails, use raw value
                            console.warn(`Failed to parse date: ${value}`, e);
                          }
                        }
                        
                        // Format number values
                        if (
                          typeof value === 'number' ||
                          (typeof value === 'string' && !isNaN(Number(value)) && key.toUpperCase().includes('AREA'))
                        ) {
                          try {
                            displayValue = Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
                          } catch (e) {
                            // If number parsing fails, use raw value
                            console.warn(`Failed to format number: ${value}`, e);
                          }
                        }
                        
                        // Render the table row
                        return (
                          <tr key={key}>
                            <th>{displayKey}</th>
                            <td>{displayValue}</td>
                          </tr>
                        );
                      })
                  ) : (
                    // Static rendering for current wildfire properties
                    <>
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
                      {fireProperties.FIRE_URL && (
                        <tr>
                          <th>Fire URL</th>
                          <td>
                            <a href={fireProperties.FIRE_URL} target="_blank" rel="noopener noreferrer">
                              View Fire Info
                            </a>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NBRMap;
