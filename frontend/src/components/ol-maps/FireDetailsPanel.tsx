import React, { useEffect, useState } from 'react';
import './FireDetailsPanel.scss';

interface FireRecord {
  id: string;
  fireNumber: string;
  pre_image_date: string;
  post_image_date: string;
  severty_class: string;
  geometry?: any;
}

interface GroupedRecords {
  [severity: string]: FireRecord[];
}

interface FireDetailsPanelProps {
  featureCollection: any; // GeoJSON FeatureCollection
}

const FireDetailsPanel: React.FC<FireDetailsPanelProps> = ({ featureCollection }) => {
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecords>({});
  const [recordCount, setRecordCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  
  useEffect(() => {
    if (featureCollection && Array.isArray(featureCollection.features)) {
      // Group records by severity class
      const records = featureCollection.features;
      const grouped: GroupedRecords = {};
      
      records.forEach((record: any) => {
        const sevClass = record.properties.severty_class || 'Unknown';
        if (!grouped[sevClass]) {
          grouped[sevClass] = [];
        }
        grouped[sevClass].push(record);
      });
      
      setGroupedRecords(grouped);
      setRecordCount(records.length);
    } else {
      setGroupedRecords({});
      setRecordCount(0);
    }
  }, [featureCollection]);
  
  if (recordCount === 0) {
    return <div>No fire details available.</div>;
  }

  // Order severities in a specific sequence
  const severityOrder = ['High', 'Medium', 'Low', 'Unburned', 'Unknown'];
  const orderedSeverities = Object.keys(groupedRecords).sort((a, b) => {
    const indexA = severityOrder.indexOf(a);
    const indexB = severityOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
  
  return (
    <div className={`fire-details-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="panel-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Fire Details</h3>
        <span className="expander">{isExpanded ? '▼' : '▲'}</span>
      </div>
      
      {isExpanded && (
        <div className="panel-content">
          <div className="record-summary">
            <span className="record-count">{recordCount}</span> burn severity records
          </div>
          
          {orderedSeverities.map(severity => (
            <div key={severity} className={`severity-group ${severity.toLowerCase()}`}>
              <div className="severity-header">
                <div className="severity-indicator"></div>
                <h4>{severity}</h4>
                <span className="count">{groupedRecords[severity].length}</span>
              </div>
              
              <ul className="record-list">
                {groupedRecords[severity].map((record, idx) => (
                  <li key={`${record.properties.FIRE_NUMBER}_${record.properties.PRE_FIRE_IMAGE_DATE}_${record.properties.POST_FIRE_IMAGE_DATE}_${idx}`} className="record-item">
                    <div className="record-dates">
                      <div className="date">
                        <span>Pre-burn:</span> {record.properties.PRE_FIRE_IMAGE_DATE}
                      </div>
                      <div className="date">
                        <span>Post-burn:</span> {record.properties.POST_FIRE_IMAGE_DATE}
                      </div>
                    </div>
                    {/* Add more details as needed */}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FireDetailsPanel;
