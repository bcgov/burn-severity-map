import React, { useState } from 'react';
import './NBRToggle.css'; // We'll create this CSS file next

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
  const [isNBRCalculated, setIsNBRCalculated] = useState(false); // Track if NBR is already calculated

  const handleToggle = () => {
    if (!isNBRCalculated) {
      onToggle(); // Trigger the calculation only once
      setIsNBRCalculated(true);
    }
  };

  return (
    <div className="bcgov-satellite-toggle">
      <div className="nbr-toggle-container">
        <input 
          type="checkbox"
          id="nbr-toggle"
          checked={isActive}
          onChange={handleToggle} // Use the new handler
          disabled={disabled || isLoading}
          aria-label="Toggle NBR Visualization"
        />
        <label htmlFor="nbr-toggle" className="bcgov-satellite-toggle-label">
          Normalized Burn Ratio
        </label>
      </div>
      
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