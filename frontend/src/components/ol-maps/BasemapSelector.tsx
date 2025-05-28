import React from 'react';
import './Selectors.scss';

interface BasemapSelectorProps {
  selectedBasemap: string;
  onBasemapChange: (basemap: string) => void;
}

const BasemapSelector: React.FC<BasemapSelectorProps> = ({ 
  selectedBasemap, 
  onBasemapChange 
}) => {
  const basemapOptions = [
    { id: 'osm', name: 'OpenStreetMap' },
    { id: 'satellite', name: 'Satellite' },
    { id: 'topo', name: 'Topographic' }
  ];

  return (
    <div className="basemap-options">
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
  );
};

export default BasemapSelector;