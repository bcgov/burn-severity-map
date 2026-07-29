//src/components/ol-maps/FireNumberSelector.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import './Selectors.scss';
import { FireOption } from '../FireDataContext';

interface FireNumberSelectorProps {
  fires: FireOption[];
  selectedFire: string | null;
  onFireSelect: (fire: string | null) => void;
  disabled?: boolean;
}

const sortAlphaNumeric = (a: string, b: string): number => {
  const r = /(\d+)|(\D+)/g;
  const aParts = a.match(r) || [];
  const bParts = b.match(r) || [];
  const len = Math.min(aParts.length, bParts.length);

  for (let i = 0; i < len; i++) {
    const aNum = Number(aParts[i]);
    const bNum = Number(bParts[i]);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum !== bNum) return aNum - bNum;
    } else if (aParts[i] !== bParts[i]) {
      return aParts[i].localeCompare(bParts[i]);
    }
  }
  return aParts.length - bParts.length;
};

const FireNumberSelector: React.FC<FireNumberSelectorProps> = ({
  fires,
  selectedFire,
  onFireSelect,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sortedFires = useMemo(() => {
    return [...fires].sort((a, b) => sortAlphaNumeric(a.fireNumber, b.fireNumber));
  }, [fires]);

  const filteredFires = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return sortedFires.filter(f => {
        const matchFireNumber = f.fireNumber.toLowerCase().includes(lowerSearchTerm);
        const matchIncidentName = f.incidentName?.toLowerCase().includes(lowerSearchTerm);

        return matchFireNumber || matchIncidentName;
    });
  }, [sortedFires, searchTerm]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectFire = (fireNumber: string | null) => {
    onFireSelect(fireNumber);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if ((e.key === 'Backspace' || e.key === 'Delete' ) && searchTerm === '' && selectedFire) {
      e.preventDefault();
      selectFire(null);
      onFireSelect(null);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="bcgov-fire-selector" ref={ref}>
      <div className="bcgov-fire-selector-label">
        <h4>Fire Number</h4>
        <p>Select a fire to view burn severity</p>
      </div>

      <input
        type="text"
        className="bcgov-fire-selector-input"
        placeholder={
          disabled
            ? 'Select a year first'
            : selectedFire || 'Search fire number or name...'
        }
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        aria-disabled={disabled}
      />

      {isOpen && !disabled && (
        <div className="bcgov-fire-selector-dropdown">
          {filteredFires.length === 0 ? (
            <div className="bcgov-fire-selector-no-results">
              No fires match “{searchTerm}”
            </div>
          ) : (
            <ul className="bcgov-fire-selector-list">
              {filteredFires.map(option => (
                <li
                  key={option.fireNumber}
                  className={`bcgov-fire-selector-item ${
                    option.fireNumber === selectedFire ? 'selected' : ''
                  }`}
                  onClick={() => selectFire(option.fireNumber)}
                >
                  <span>{option.fireNumber} - {option.incidentName.includes(option.fireNumber) ? option.geogDescription : option.incidentName}</span>
                  {option.isProcessed && (
                    <span style={{ fontSize: '0.8em', backgroundColor: '#e0f7fa', color: '#006064', padding: '2px 6px', borderRadius: '4px' }}>
                      Processed
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FireNumberSelector;