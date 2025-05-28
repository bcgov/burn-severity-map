import React, { useState } from 'react';
import './NBRToggle.css'; // Keep the existing CSS for spinner and loading states
import './Selectors.scss'; // Add the import for the toggle switch styles

interface NBRToggleProps {
  isActive: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const NBRToggle: React.FC<NBRToggleProps> = ({
  isActive,
  onToggle,
  isLoading = false,
  disabled = false
}) => {
  const [isNBRCalculated, setIsNBRCalculated] = useState(false);

  const handleToggle = () => {
    if (!isNBRCalculated) {
      onToggle();
      setIsNBRCalculated(true);
    }
  };

  return (
    <div className="toggle-container">
      <label className="toggle-switch">
        <input 
          type="checkbox"
          id="nbr-toggle"
          checked={isActive}
          onChange={handleToggle}
          disabled={disabled || isLoading}
          aria-label="Toggle NBR Visualization"
        />
        <span className="toggle-slider"></span>
      </label>
      <span className={`toggle-label ${disabled ? 'disabled' : ''}`}>
        Normalized Burn Ratio
      </span>
      
      {disabled && !isLoading && (
        <div className="bcgov-toggle-disabled-message">
          <small>(Select a fire and enable imagery first)</small>
        </div>
      )}

      {isLoading && (
        <div className="nbr-spinner-container">
          <div className="nbr-spinner"></div>
          <span className="nbr-loading-text">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default NBRToggle;