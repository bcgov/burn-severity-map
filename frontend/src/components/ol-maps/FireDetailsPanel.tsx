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
  fireNumber: string | null;
  fires: FireRecord[];
}

const FireDetailsPanel: React.FC<FireDetailsPanelProps> = ({ fireNumber, fires }) => {
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecords>({});
  const [recordCount, setRecordCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  
  useEffect(() => {
    if (fireNumber) {
      // Group records by severity class
      const records = fires.filter(fire => fire.fireNumber === fireNumber);
      const grouped: GroupedRecords = {};
      
      records.forEach(record => {
        const sevClass = record.severty_class || 'Unknown';
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
  }, [fireNumber, fires]);
  
  if (!fireNumber || recordCount === 0) {
    return null;
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
        <h3>Fire {fireNumber}</h3>
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
                {groupedRecords[severity].map(record => (
                  <li key={record.id} className="record-item">
                    <div className="record-dates">
                      <div className="date">
                        <span>Pre-burn:</span> {record.pre_image_date}
                      </div>
                      <div className="date">
                        <span>Post-burn:</span> {record.post_image_date}
                      </div>
                    </div>
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
