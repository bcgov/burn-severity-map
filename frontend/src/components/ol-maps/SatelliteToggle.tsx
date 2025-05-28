import React from 'react';

interface SatelliteToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const SatelliteToggle: React.FC<SatelliteToggleProps> = ({ isActive, onToggle }) => {
  return (
    <div className="bcgov-satellite-toggle">
      <input 
        type="checkbox" 
        id="satellite-toggle"
        checked={isActive} 
        onChange={onToggle}
        aria-label="Toggle Sentinel Imagery"
      />
      <label htmlFor="satellite-toggle" className="bcgov-satellite-toggle-label">
        Sentinel Imagery
      </label>
    </div>
  );
};

export default SatelliteToggle;