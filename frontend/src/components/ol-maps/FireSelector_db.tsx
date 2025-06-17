import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Selectors.scss';

interface Fire {
  id: string;
  fireNumber: string;
  pre_image_date: string;
  post_image_date: string;
  severty_class: string;
}

interface FireSelectorProps {
  fires: Fire[];
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

const FireSelector: React.FC<FireSelectorProps> = ({ 
  fires, 
  onFireSelect,
  selectedFire 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Helper function to get display text for the selected fire
  const getSelectedFireDisplayText = () => {
    if (!selectedFire) return "Search by number or severity...";
    
    const selectedFireObj = fires.find(f => f.fireNumber === selectedFire);
    if (!selectedFireObj) return selectedFire;
    
    return `${selectedFire} - ${selectedFireObj.severty_class || 'Unknown'}`;
  };
  
  // Filter and sort fires based on search term
  const filteredFires = useMemo(() => {
    // First filter by search term - include both fire number and severity class in search
    const filtered = fires.filter(fire => 
      fire.fireNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fire.severty_class && fire.severty_class.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Then sort alphanumerically by fireNumber
    return filtered.sort((a, b) => sortAlphaNumeric(a.fireNumber, b.fireNumber));
  }, [fires, searchTerm]);

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
  const handleSelectFire = (fire: Fire) => {
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
          ) : filteredFires.length > 0 ? (
            <ul className="bcgov-fire-selector-list">
              {filteredFires.map((fire) => (
                <li 
                  key={fire.id} 
                  className={`bcgov-fire-selector-item ${selectedFire === fire.fireNumber ? 'selected' : ''}`}
                  onClick={() => handleSelectFire(fire)}
                >
                  {fire.fireNumber} - {fire.severty_class || 'Unknown'}
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