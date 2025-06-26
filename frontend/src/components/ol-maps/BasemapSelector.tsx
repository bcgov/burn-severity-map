import React, { useState } from 'react';
import './Selectors.scss';

interface BasemapSelectorProps {
  selectedBasemap: string;
  onBasemapChange: (basemap: string) => void;
}

const BasemapSelector: React.FC<BasemapSelectorProps> = ({ 
  selectedBasemap, 
  onBasemapChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const basemapOptions = [
    { id: 'osm', name: 'OpenStreetMap' },
    { id: 'satellite', name: 'Satellite' }
  ];

  // Get the name of the currently selected basemap
  const selectedBasemapName = basemapOptions.find(option => option.id === selectedBasemap)?.name || 'Map';

  return (
    <div className={`basemap-options ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="basemap-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="basemap-title">
          {isExpanded ? 'Basemap' : selectedBasemapName}
        </span>
        <button className="toggle-button">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Content is always rendered but visibility is controlled by CSS */}
      <div className="basemap-content">
        {basemapOptions.map(option => (
          <div key={option.id} className="bcgov-basemap-option">
            <input
              type="radio"
              id={option.id}
              name="basemap"
              value={option.id}
              checked={selectedBasemap === option.id}
              onChange={() => onBasemapChange(option.id)}
            />
            <label htmlFor={option.id}>{option.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasemapSelector;