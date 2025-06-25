import React from 'react';
import './BurnSeverityLegend.scss';

interface BurnSeverityLegendProps {
  isVisible: boolean;
}

/**
 * Component to display a legend for burn severity classes
 */
const BurnSeverityLegend: React.FC<BurnSeverityLegendProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="burn-severity-legend">
      <div className="legend-header">
        <h3>Burn Severity Legend</h3>
      </div>
      <div className="legend-items">
        <div className="legend-item">
          <div className="color-box high"></div>
          <span>High</span>
        </div>
        <div className="legend-item">
          <div className="color-box moderate"></div>
          <span>Moderate</span>
        </div>
        <div className="legend-item">
          <div className="color-box low"></div>
          <span>Low</span>
        </div>
        <div className="legend-item">
          <div className="color-box unburnt"></div>
          <span>Unburnt</span>
        </div>
      </div>
    </div>
  );
};

export default BurnSeverityLegend;
