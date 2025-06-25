import React, { useState } from 'react';
import '../style.scss';
import './burn-severity.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector_db from '../components/ol-maps/FireSelector_db';
import type { Feature as GeoJSONFeature } from 'geojson';

// DbFire interface for records from database
interface DbFire {
  id: string;
  fireNumber: string;
  pre_image_date: string;
  post_image_date: string;
  severty_class: string; // Note: Backend might use "severity_class" - handle both with [key: string]
  geometry?: any;
  [key: string]: any; // Allow for additional properties like severity_class (different spelling)
}

// Fire properties interface
interface FireProperties {
  _isDbRecord?: boolean;
  _isLoading?: boolean;
  _hasError?: boolean;
  _errorMessage?: string;
  _dbSchema?: boolean; // Flag to indicate this object has the original DB schema
  FIRE_NUMBER: string;
  [key: string]: any; // Allow for additional properties
}

function BurnSeverity() {
  const [basemap, setBasemap] = useState('osm');
  // Set initial center and zoom for all of British Columbia
  const [center] = useState<[number, number]>([-126.5, 54.5]); // Approximate center of BC
  const [zoom] = useState(5); // Zoomed out to show the whole province
  
  // Add state for database fires
  const [dbFires, setDbFires] = useState<DbFire[]>([]);
  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
  const [fireProperties, setFireProperties] = useState<FireProperties | null>(null);

  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
  };
  
  // Handler for when database fires are loaded
  const handleDbFiresLoaded = (loadedDbFires: DbFire[]) => {
    setDbFires(loadedDbFires);
  };
  
  // Note: We'll get fire properties through the database fire selection now
  
  // Function to fetch fire details from the database
  const fetchDbFireDetails = async (fireNumber: string) => {
    try {
      console.log('Getting details for DB fire:', fireNumber);
      
      // First check if we already have the fire in our dbFires state
      const existingFire = dbFires.find(fire => fire.fireNumber === fireNumber);
      
      if (existingFire) {
        console.log('Using existing DB fire data:', existingFire);
        
        // Create a dynamically-built object that preserves all DB fields
        // First copy all properties from the existing fire
        const fireProps: FireProperties = {
          _isDbRecord: true,
          FIRE_NUMBER: existingFire.fireNumber,
          _dbSchema: true // Mark this as having the original DB schema
        };
        
        // Dynamically copy all properties from the DB record
        Object.entries(existingFire).forEach(([key, value]) => {
          // Convert to the internal property name format if needed
          if (key !== 'fireNumber') {
            fireProps[key] = value;
          }
        });
        
        return fireProps;
      }
      
      // If we don't have the fire in our state, fetch all records again
      const response = await fetch('/pg-bs/', {
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
        
        // Create a dynamically-built object that preserves all DB fields
        const fireProps: FireProperties = {
          _isDbRecord: true,
          FIRE_NUMBER: targetFire.fire_number,
          _dbSchema: true // Mark this as having the original DB schema
        };
        
        // Dynamically copy all properties from the DB record
        Object.entries(targetFire).forEach(([key, value]) => {
          // Skip the fire_number as we already have FIRE_NUMBER
          if (key !== 'fire_number') {
            fireProps[key] = value;
          }
        });
        
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
      // If a fire is selected, fetch its details
      if (fireNumber) {
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
            setFireProperties({ 
              FIRE_NUMBER: fireNumber,
              _isDbRecord: true, 
              _hasError: true,
              _errorMessage: 'Failed to load fire details. Please try again later.'
            });
          });
      } else {
        setFireProperties(null);
      }
    }
  };

  // Helper: Convert fireProperties with geometry to GeoJSON Feature
  const getHighlightFeature = (): GeoJSONFeature | null => {
    if (fireProperties && fireProperties.geometry && typeof fireProperties.geometry === 'object' && fireProperties.geometry.type) {
      // Only include valid, non-internal properties
      const properties: Record<string, any> = {};
      Object.entries(fireProperties).forEach(([key, value]) => {
        if (!key.startsWith('_') && key !== 'geometry' && typeof value !== 'function' && value !== undefined && value !== null) {
          properties[key] = value;
        }
      });
      return {
        type: 'Feature',
        geometry: fireProperties.geometry,
        properties,
      };
    }
    return null;
  };

  return (
    <div className="App">
      <div className="app-layout">
        {/* Left Panel - Fire Selection */}
        <div className="left-panel">
          {/* Database Fire Selector */}
          <h3>Processed Burn Severity Fires</h3>
          <FireSelector_db
            fires={dbFires}
            onFireSelect={handleDbFireSelect}
            selectedFire={selectedDbFire}
          />
        </div>

        {/* Center Panel - Map */}
        <div className="center-panel">
          <div className="map-container">
            <OLMap 
              center={center} 
              zoom={zoom} 
              basemap={basemap}
              onDbFiresLoaded={handleDbFiresLoaded}
              selectedDbFire={selectedDbFire}
              highlightFeature={getHighlightFeature()}
            />
          </div>
          
          <div className="bcgov-basemap-selector">
            <BasemapSelector selectedBasemap={basemap} onBasemapChange={handleBasemapChange} />
          </div>
        </div>

        {/* Right Panel - Fire Details */}
        <div className="right-panel">
          <h3>Processed Burn Severity Fire Details</h3>
          
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
                  {fireProperties._isDbRecord && (
                    // Fully dynamic rendering of DB fire properties
                    Object.entries(fireProperties)
                      // Filter to show only the database fields (no metadata fields)
                      .filter(([key]) => {
                        // Exclude internal properties (starting with underscore)
                        if (key.startsWith('_')) return false;
                        
                        // Exclude geometry-related fields that don't make sense to display
                        if (key === 'geometry' || key === 'type' || key === 'bbox') return false;
                        
                        // Always include these core fields if they exist
                        const priorityFields = [
                          'FIRE_NUMBER',
                          'id',
                          'fire_number',
                          'fireNumber',
                          'post_image_date',
                          'pre_image_date',
                          'severty_class',
                          'severity_class'
                        ];
                        
                        if (priorityFields.includes(key)) {
                          return true;
                        }
                        
                        // For all other fields, include them only if we have the DB schema flag
                        // This will allow new fields added to the DB to be displayed automatically
                        return fireProperties._dbSchema === true;
                      })
                      // Sort properties with priority fields first, then alphabetically
                      .sort(([keyA], [keyB]) => {
                        // Define the priority order 
                        const priorityOrder = [
                          'FIRE_NUMBER', 'fire_number', 'fireNumber',
                          'id', 
                          'pre_image_date',
                          'post_image_date',
                          'severty_class', 'severity_class'
                        ];
                        
                        // Get priority index (or a large number if not in priority list)
                        const indexA = priorityOrder.indexOf(keyA);
                        const indexB = priorityOrder.indexOf(keyB);
                        const priorityA = indexA === -1 ? 999 : indexA;
                        const priorityB = indexB === -1 ? 999 : indexB;
                        
                        // Sort by priority first
                        if (priorityA !== priorityB) {
                          return priorityA - priorityB;
                        }
                        
                        // If same priority, sort alphabetically
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
                        else if (key === 'pre_image_date') displayKey = 'Pre-Fire Image Date';
                        else if (key === 'post_image_date') displayKey = 'Post-Fire Image Date';
                        else if (key === 'severity_class' || key === 'severty_class') displayKey = 'Severity Class';
                        
                        // Format the display value based on type
                        let displayValue: React.ReactNode = String(value);
                        
                        // Format date values
                        if (
                          typeof value === 'string' &&
                          (key.toLowerCase().includes('date') || key.toLowerCase().includes('_date'))
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
                          (typeof value === 'string' && !isNaN(Number(value)) && key.toLowerCase().includes('area'))
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

export default BurnSeverity;
