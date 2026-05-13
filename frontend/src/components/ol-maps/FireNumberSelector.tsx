//src/components/ol-maps/FireNumberSelector.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import './Selectors.scss';

interface FireNumberSelectorProps {
  fires: string[];
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

  const sortedFires = useMemo(
    () => [...fires].sort(sortAlphaNumeric),
    [fires]
  );

  const filteredFires = useMemo(
    () =>
      sortedFires.filter(f =>
        f.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sortedFires, searchTerm]
  );

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectFire = (fire: string) => {
    onFireSelect(fire);
    setIsOpen(false);
    setSearchTerm('');
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
            : selectedFire || 'Search fire number...'
        }
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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
              {filteredFires.map(fire => (
                <li
                  key={fire}
                  className={`bcgov-fire-selector-item ${
                    fire === selectedFire ? 'selected' : ''
                  }`}
                  onClick={() => selectFire(fire)}
                >
                  {fire}
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