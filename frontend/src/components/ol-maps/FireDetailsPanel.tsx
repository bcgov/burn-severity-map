import React from 'react';
import './FireDetailsPanel.scss';

// Accept a FeatureCollection as a prop
interface FireDetailsPanelProps {
  featureCollection: any; // GeoJSON FeatureCollection
}

const FireDetailsPanel: React.FC<FireDetailsPanelProps> = ({ featureCollection }) => {
  const features = featureCollection && Array.isArray(featureCollection.features)
    ? featureCollection.features
    : [];

  if (features.length === 0) {
    return <div>No fire details available.</div>;
  }

  return (
    <div className="fire-details-panel">
      <div className="panel-content">
        <div className="record-summary">
          <span className="record-count">{features.length}</span> burn severity records
        </div>
        <ul className="record-list">
          {features.map((feature: any, idx: number) => (
            <li
              key={`${feature.properties.FIRE_NUMBER}_${feature.properties.PRE_FIRE_IMAGE_DATE}_${feature.properties.POST_FIRE_IMAGE_DATE}_${idx}`}
              className="record-item"
            >
              <div className="record-dates">
                <div className="date">
                  <span>Pre-burn:</span> {feature.properties.PRE_FIRE_IMAGE_DATE}
                </div>
                <div className="date">
                  <span>Post-burn:</span> {feature.properties.POST_FIRE_IMAGE_DATE}
                </div>
                <div className="severity">
                  <span>Severity:</span> {feature.properties.BURN_SEVERITY_RATING}
                </div>
              </div>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FireDetailsPanel;
