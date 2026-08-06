import React, { useState, useEffect } from 'react';
import './BurnSeverityLegend.scss';

interface BurnSeverityLegendProps {
  isVisible: boolean;
  onClose?: () => void;
}

/**
 * Component to display a legend for burn severity classes
 */
const BurnSeverityLegend: React.FC<BurnSeverityLegendProps> = ({ isVisible, onClose }) => {
  const [visible, setVisible] = useState(isVisible);
  
  // Update local state when prop changes
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);
  
  if (!visible) return null;
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className="burn-severity-legend">
      <div className="legend-header">
        <h3>Burn Severity Legend</h3>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      <div className="legend-items">
        <div className="legend-item">
          <div className="color-box high"></div>
          <span>High</span>
        </div>
        <div className="legend-item">
          <div className="color-box medium"></div>
          <span>Medium</span>
        </div>
        <div className="legend-item">
          <div className="color-box low"></div>
          <span>Low</span>
        </div>
        <div className="legend-item">
          <div className="color-box unburned"></div>
          <span>Unburned</span>
        </div>
        <div className="legend-item">
          <div className="color-box unknown"></div>
          <span>Unknown</span>
        </div>
      </div>
    </div>
  );
};

export default BurnSeverityLegend;
