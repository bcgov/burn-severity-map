import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Selectors.scss';

// Interface for a single fire record
interface FireRecord {
  id: string;
  fireNumber: string;
  pre_image_date: string;
  post_image_date: string;
  severty_class: string;
  geometry?: any; // Optional GeoJSON geometry that can be populated later
}

// Interface for a grouped fire with records by severity class
interface GroupedFire {
  fireNumber: string;
  records: {
    [severityClass: string]: FireRecord[];
  };
  totalRecords: number;
}

// Interface for the component props
interface FireSelectorProps {
  fires: FireRecord[];
  onFireSelect: (fireNumber: string | null) => void;
  selectedFire: string | null;
}

// Helper function for alphanumeric sorting
const sortAlphaNumeric = (a: string, b: string): number => {
  // Regular expression to separate numbers and strings
  const regex = /(\d+)|(\D+)/g;
  
  // Get all parts (numbers and strings)
  const aParts = String(a).match(regex) || [];
  const bParts = String(b).match(regex) || [];
  
  // Compare parts one by one
  const len = Math.min(aParts.length, bParts.length);
  
  for (let i = 0; i < len; i++) {
    // If both parts are numeric
    if (!isNaN(Number(aParts[i])) && !isNaN(Number(bParts[i]))) {
      const diff = parseInt(aParts[i]) - parseInt(bParts[i]);
      if (diff !== 0) return diff;
    } else {
      // String comparison
      const diff = aParts[i].localeCompare(bParts[i]);
      if (diff !== 0) return diff;
    }
  }
  
  // If all compared parts are equal, the longer one is greater
  return aParts.length - bParts.length;
};

// Helper function to group fires by fire number and severity class
const groupFiresByNumberAndSeverity = (fires: FireRecord[]): GroupedFire[] => {
  const fireGroups: { [key: string]: GroupedFire } = {};
  
  fires.forEach(fire => {
    if (!fireGroups[fire.fireNumber]) {
      fireGroups[fire.fireNumber] = {
        fireNumber: fire.fireNumber,
        records: {},
        totalRecords: 0
      };
    }
    
    const severityClass = fire.severty_class || 'Unknown';
    if (!fireGroups[fire.fireNumber].records[severityClass]) {
      fireGroups[fire.fireNumber].records[severityClass] = [];
    }
    
    fireGroups[fire.fireNumber].records[severityClass].push(fire);
    fireGroups[fire.fireNumber].totalRecords += 1;
  });
  
  // Convert the object to an array
  return Object.values(fireGroups);
};

const FireSelector: React.FC<FireSelectorProps> = ({ 
  fires, 
  onFireSelect,
  selectedFire 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Group fires by fire number and severity
  const groupedFires = useMemo(() => {
    return groupFiresByNumberAndSeverity(fires);
  }, [fires]);
  
  // Helper function to get display text for the selected fire
  const getSelectedFireDisplayText = () => {
    if (!selectedFire) return "Search by fire number...";
    
    const groupedFire = groupedFires.find(f => f.fireNumber === selectedFire);
    if (!groupedFire) return selectedFire;
    
    // Show fire number and count of records
    return `${selectedFire} (${groupedFire.totalRecords} records)`;
  };
  
  // Helper to get severity count text for a fire
  const getSeverityCountText = (fire: GroupedFire) => {
    const counts = Object.entries(fire.records).map(([severity, records]) => 
      `${severity}: ${records.length}`
    ).join(', ');
    
    return counts || 'No severity data';
  };
  
  // Filter and sort fires based on search term
  const filteredGroupedFires = useMemo(() => {
    // First filter by search term
    const filtered = groupedFires.filter(fire => 
      fire.fireNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Also search in severity classes
      Object.keys(fire.records).some(severity => 
        severity.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // Then sort alphanumerically by fireNumber
    return filtered.sort((a, b) => sortAlphaNumeric(a.fireNumber, b.fireNumber));
  }, [groupedFires, searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset search term when selected fire changes externally
  useEffect(() => {
    setSearchTerm('');
  }, [selectedFire]);

  // Handle fire selection
  const handleSelectFire = (fire: GroupedFire) => {
    onFireSelect(fire.fireNumber);
    setSearchTerm(''); // Reset search term
    setIsOpen(false);
  };

  return (
    <div 
      className="bcgov-fire-selector" 
      ref={dropdownRef}
    >
      <div className="bcgov-fire-selector-header">
        <div className="bcgov-fire-selector-label">
          <h4>Fire Number - Severity</h4>
          <p>Select a fire to view burn severity</p>
        </div>
        <div 
          className="bcgov-fire-selector-input-container" 
          onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
        >
          <input
            type="text"
            placeholder={getSelectedFireDisplayText()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
              // Focus on input when clicking
              e.currentTarget.focus();
            }}
            onFocus={() => setIsOpen(true)}
            className="bcgov-fire-selector-input"
          />
          <button 
            className="bcgov-fire-selector-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
              if (!isOpen) {
                // Reset search term when opening dropdown
                setSearchTerm('');
              }
            }}
          >
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="bcgov-fire-selector-dropdown">
          {fires.length === 0 ? (
            <div className="bcgov-fire-selector-no-results">
              No processed burn severity records available
            </div>
          ) : filteredGroupedFires.length > 0 ? (
            <ul className="bcgov-fire-selector-list">
              {filteredGroupedFires.map((fire) => (
                <li 
                  key={fire.fireNumber} 
                  className={`bcgov-fire-selector-item ${selectedFire === fire.fireNumber ? 'selected' : ''}`}
                  onClick={() => handleSelectFire(fire)}
                >
                  <div className="fire-number">{fire.fireNumber}</div>
                  <div className="fire-severity-counts">
                    {Object.entries(fire.records).map(([severity, records]) => (
                      <span 
                        key={severity} 
                        className={`severity-badge ${severity.toLowerCase()}`}
                        title={`${severity}: ${records.length} records`}
                      >
                        {records.length}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bcgov-fire-selector-no-results">
              No fires matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FireSelector;