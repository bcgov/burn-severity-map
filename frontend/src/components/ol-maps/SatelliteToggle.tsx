import React from 'react';
import './Selectors.scss';

interface SatelliteToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const SatelliteToggle: React.FC<SatelliteToggleProps> = ({ isActive, onToggle }) => {
  return (
    <div className="toggle-container">
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          id="satellite-toggle"
          checked={isActive} 
          onChange={onToggle}
          aria-label="Toggle Sentinel Imagery"
        />
        <span className="toggle-slider"></span>
      </label>
      <span className="toggle-label">
        Sentinel Imagery
      </span>
    </div>
  );
};

export default SatelliteToggle;