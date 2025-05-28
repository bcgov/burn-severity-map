import React from 'react';

interface StacMetadataDisplayProps {
  isVisible: boolean;
  date: string | null;
  cloudCover: number | null;
  source: string | null;
  collection?: string | null;
  resolution?: string | null;
  bandInfo?: string | null;
  assetType?: string | null;
}

const StacMetadataDisplay: React.FC<StacMetadataDisplayProps> = ({
  isVisible,
  date,
  cloudCover,
  source,
  collection = null,
  resolution = null,
  bandInfo = null,
  assetType = null
}) => {
  if (!isVisible || !date) return null;

  // Format the date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '45px', // Changed from 10px to 45px to move it up
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '300px',
        fontSize: '12px',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
      }}
    >
      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Satellite Imagery</h4>
      {source && (
        <div>
          <strong>Source:</strong> {source}
        </div>
      )}
      <div>
        <strong>Date:</strong> {formattedDate}
      </div>
      {cloudCover !== null && (
        <div>
          <strong>Cloud Cover:</strong> {cloudCover}%
        </div>
      )}
      {collection && (
        <div>
          <strong>Collection:</strong> {collection}
        </div>
      )}
      {resolution && (
        <div>
          <strong>Resolution:</strong> {resolution}
        </div>
      )}
      {bandInfo && (
        <div>
          <strong>Bands:</strong> {bandInfo}
        </div>
      )}
      {assetType && (
        <div>
          <strong>Asset Type:</strong> {assetType}
        </div>
      )}
    </div>
  );
};

export default StacMetadataDisplay;