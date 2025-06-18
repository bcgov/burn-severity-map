import React, { useState, useEffect, useMemo } from 'react';
import './FireDetailsPanel.scss';

// Interface for a single fire record similar to FireSelector_db
interface FireRecord {
  properties: {
    FIRE_NUMBER: string;
    PRE_FIRE_IMAGE_DATE?: string;
    POST_FIRE_IMAGE_DATE?: string;
    BURN_SEVERITY_RATING?: string;
    AREA_HA?: number | string;
    [key: string]: any;
  };
  geometry?: any;
  type: string;
  [key: string]: any;
}

// Interface for a grouped fire with records by severity class
interface GroupedFire {
  fireNumber: string;
  records: {
    [severityClass: string]: FireRecord[];
  };
  totalRecords: number;
  totalArea: number;
}

// Accept either a FeatureCollection or a GroupedFire as a prop
interface FireDetailsPanelProps {
  featureCollection?: any; // GeoJSON FeatureCollection
  groupedFire?: {
    fireNumber: string;
    records: {
      [severityClass: string]: any[];
    };
    totalRecords: number;
  } | null;
}

// Helper function to group features by fire number and severity rating
const groupFeaturesBySeverity = (features: any[]): GroupedFire | null => {
  if (!features || features.length === 0) return null;
  
  const result: GroupedFire = {
    fireNumber: features[0]?.properties?.FIRE_NUMBER || 'Unknown Fire',
    records: {},
    totalRecords: 0,
    totalArea: 0
  };
  
  features.forEach(feature => {
    if (!feature.properties) return;
    
    const severity = feature.properties.BURN_SEVERITY_RATING || 'Unknown';
    const area = Number(feature.properties.AREA_HA) || 0;
    
    if (!result.records[severity]) {
      result.records[severity] = [];
    }
    
    result.records[severity].push(feature);
    result.totalRecords += 1;
    result.totalArea += area;
  });
  
  return result;
};

const FireDetailsPanel: React.FC<FireDetailsPanelProps> = ({ featureCollection, groupedFire: inputGroupedFire }) => {
  // State to track which severity sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Log which data source we're using
  useEffect(() => {
    if (inputGroupedFire) {
      console.log('FireDetailsPanel using passed groupedFire data:', inputGroupedFire);
    } else if (featureCollection) {
      console.log('FireDetailsPanel using featureCollection data:', featureCollection);
    }
  }, [featureCollection, inputGroupedFire]);
  
  // Toggle a severity section's expanded state
  const toggleSection = (severity: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [severity]: !prev[severity]
    }));
  };
  
  // Extract features from the featureCollection if available
  const features = featureCollection && Array.isArray(featureCollection.features)
    ? featureCollection.features
    : [];

  // Calculate derived data based on either source
  const processedData = useMemo(() => {
    // First check if we have a directly passed groupedFire
    if (inputGroupedFire) {
      // Convert the passed GroupedFire to our internal format with totalArea
      let totalArea = 0;
      
      // Calculate total area from all records
      Object.keys(inputGroupedFire.records).forEach(severity => {
        inputGroupedFire.records[severity].forEach(record => {
          // If the record has area field directly
          if (typeof record.area_ha === 'number') {
            totalArea += record.area_ha;
          } 
          // If it's in a properties object like a GeoJSON Feature
          else if (record.properties?.AREA_HA) {
            totalArea += Number(record.properties.AREA_HA) || 0;
          }
        });
      });
      
      return {
        fireNumber: inputGroupedFire.fireNumber,
        records: inputGroupedFire.records,
        totalRecords: inputGroupedFire.totalRecords,
        totalArea: totalArea
      };
    } 
    
    // Otherwise process the featureCollection
    return groupFeaturesBySeverity(features);
  }, [features, inputGroupedFire]);
  
  // Show empty message if no data is available
  if (!processedData) {
    return <div className="fire-details-panel empty">
      <div className="panel-content">
        <div className="empty-message">No fire details available. Select a fire from the dropdown.</div>
      </div>
    </div>;
  }

  // Calculate summary info from processed data
  const severitySummary = Object.entries(processedData.records).map(([severity, recordList]) => {
    const records = recordList as any[];
    const count = records.length;
    
    // Calculate the area, handling different record formats
    let areaTotal = 0;
    records.forEach(record => {
      if (record.properties?.AREA_HA) {
        areaTotal += Number(record.properties.AREA_HA) || 0;
      } else if (record.area_ha) {
        areaTotal += Number(record.area_ha) || 0;
      }
    });
    
    const percentOfTotal = processedData.totalArea > 0 ? (areaTotal / processedData.totalArea * 100) : 0;
    
    return {
      severity,
      count,
      areaTotal,
      percentOfTotal
    };
  }).sort((a, b) => {
    // Sort by severity: High, Medium, Low, Unburned, etc.
    const order = { 'High': 0, 'Medium': 1, 'Low': 2, 'Unburned': 3, 'Unknown': 4 };
    const orderA = order[a.severity as keyof typeof order] ?? 999;
    const orderB = order[b.severity as keyof typeof order] ?? 999;
    return orderA - orderB;
  });

  return (
    <div className="fire-details-panel">
      <div className="panel-content">
        <div className="fire-header">
          <h4>Fire {processedData.fireNumber}</h4>
          <div className="record-summary">
            <span className="record-count">{processedData.totalRecords}</span> burn severity records
          </div>
          <div className="total-area">
            Total Area: <strong>{processedData.totalArea.toFixed(2)} ha</strong>
          </div>
        </div>

        {/* Fire details content and table as requested */}
        <div className="fire-details-content">
          <h5>Burn Severity Summary</h5>
          
          <table className="fire-details-table">
            <thead>
              <tr>
                <th>Severity Class</th>
                <th>Records</th>
                <th>Area (ha)</th>
                <th>% of Fire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {severitySummary.map((summary) => (
                <React.Fragment key={summary.severity}>
                  <tr className={`severity-row ${summary.severity.toLowerCase()}`}>
                    <td>
                      <div className="severity-indicator"></div>
                      <span className="severity-name">{summary.severity}</span>
                    </td>
                    <td>{summary.count}</td>
                    <td>{summary.areaTotal.toFixed(2)} ha</td>
                    <td>{summary.percentOfTotal.toFixed(1)}%</td>
                    <td>
                      <button 
                        className="toggle-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(summary.severity);
                        }}
                      >
                        {expandedSections[summary.severity] ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expandable details section */}
                  {expandedSections[summary.severity] && (
                    <tr className="detail-row">
                      <td colSpan={5}>
                        <div className="records-detail">
                          <table className="records-table">
                            <thead>
                              <tr>
                                <th>Pre-Fire Date</th>
                                <th>Post-Fire Date</th>
                                <th>Area (ha)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(processedData.records[summary.severity] as any[]).map((record, idx) => {
                                // Handle both GeoJSON feature format and db record format
                                const props = record.properties || record;
                                const preDate = props.PRE_FIRE_IMAGE_DATE || props.pre_image_date || 'N/A';
                                const postDate = props.POST_FIRE_IMAGE_DATE || props.post_image_date || 'N/A';
                                const area = Number(props.AREA_HA || props.area_ha || 0);
                                
                                return (
                                  <tr 
                                    key={`${processedData.fireNumber}_${preDate}_${postDate}_${idx}`}
                                    className="record-row"
                                  >
                                    <td>{preDate}</td>
                                    <td>{postDate}</td>
                                    <td>{area.toFixed(2)} ha</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FireDetailsPanel;
