import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Selectors.scss';

interface FireSelectorProps {
  fires: string[];
  onFireSelect: (fireNumber: string | null) => void;
  selectedFire: string | null;
}

const sortAlphaNumeric = (a: string, b: string): number => {
  const regex = /(\d+)|(\D+)/g;
  const aParts = String(a).match(regex) || [];
  const bParts = String(b).match(regex) || [];
  const len = Math.min(aParts.length, bParts.length);
  for (let i = 0; i < len; i++) {
    if (!isNaN(Number(aParts[i])) && !isNaN(Number(bParts[i]))) {
      const diff = parseInt(aParts[i]) - parseInt(bParts[i]);
      if (diff !== 0) return diff;
    } else {
      const diff = aParts[i].localeCompare(bParts[i]);
      if (diff !== 0) return diff;
    }
  }
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

  const sortedFires = useMemo(() => {
    return [...fires].sort(sortAlphaNumeric);
  }, [fires]);

  const filteredFires = useMemo(() => {
    return sortedFires.filter(fire =>
      fire.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedFires, searchTerm]);

  const getSelectedFireDisplayText = () => {
    return selectedFire || "Search by fire number...";
  };

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

  useEffect(() => {
    setSearchTerm('');
  }, [selectedFire]);

  const handleSelectFire = (fireNumber: string) => {
    onFireSelect(fireNumber);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="bcgov-fire-selector" ref={dropdownRef}>
      <div className="bcgov-fire-selector-header">
        <div className="bcgov-fire-selector-label">
          <h4>Fire Number</h4>
          <p>Select a fire to view burn severity</p>
        </div>
        <div
          className="bcgov-fire-selector-input-container"
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="text"
            placeholder={getSelectedFireDisplayText()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
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
              {filteredFires.map((fireNumber) => (
                <li
                  key={fireNumber}
                  className={`bcgov-fire-selector-item ${selectedFire === fireNumber ? 'selected' : ''}`}
                  onClick={() => handleSelectFire(fireNumber)}
                >
                  <div className="fire-number">{fireNumber}</div>
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
