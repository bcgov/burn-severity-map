import React, { useState } from 'react';

interface PreBurnToggleProps {
  isActive: boolean;
  onToggle: () => void;
  ignitionDate: string | null;
  bbox: number[] | null;
  onStacSelect?: (stacItem: any) => void;
  disabled?: boolean;
}

const PreBurnToggle: React.FC<PreBurnToggleProps> = ({
  isActive,
  onToggle,
  ignitionDate,
  bbox,
  onStacSelect,
  disabled
}) => {
  const [stacItems, setStacItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch STAC items when toggled on
  React.useEffect(() => {
    if (isActive && ignitionDate && bbox) {
      setLoading(true);
      fetch('https://earth-search.aws.element84.com/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collections: ["sentinel-2-l2a"],
          bbox,
          query: {
            "eo:cloud_cover": { lte: 30 },
            "datetime": {
              gte: new Date(new Date(ignitionDate).getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              lte: new Date(ignitionDate).toISOString()
            }
          },
          sortby: [{ field: "properties.datetime", direction: 'desc' }],
          limit: 100
        })
      })
        .then(res => res.json())
        .then(json => {
          // Group by date (YYYY-MM-DD), pick the image with the lowest cloud cover for each date
          const features = json.features || [];
          const byDate: Record<string, any[]> = {};
          (features as any[]).forEach((item: any) => {
            const date = item.properties.datetime.split('T')[0];
            if (!byDate[date]) byDate[date] = [];
            byDate[date].push(item);
          });
          // For each date, pick the image with the lowest cloud cover
          const bestPerDate = Object.values(byDate).map(items => {
            return items.reduce((best, curr) =>
              (curr.properties['eo:cloud_cover'] < best.properties['eo:cloud_cover'] ? curr : best)
            );
          });
          // Sort by date descending (most recent first)
          bestPerDate.sort((a, b) => b.properties.datetime.localeCompare(a.properties.datetime));
          console.log('Best STAC items per date:', bestPerDate);
          setStacItems(bestPerDate);
          // Do NOT auto-select the first image
          setSelectedDate(null);
        })
        .finally(() => setLoading(false));
    } else {
      setStacItems([]);
      setSelectedDate(null);
    }
  }, [isActive, ignitionDate, bbox]);

  // Handle dropdown change
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    // Find the selected STAC item
    const item = stacItems.find((f) => f.properties.datetime === date);
    if (item) {
      // User selected a valid image, load it
      if (onStacSelect) onStacSelect(item);
    } else {
      // User cleared the selection, clear any loaded COG/metadata
      if (onStacSelect) onStacSelect(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={onToggle}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        <span
          style={{
            width: 36,
            height: 20,
            background: isActive ? '#1976d2' : '#ccc',
            borderRadius: 12,
            position: 'relative',
            transition: 'background 0.2s',
            marginRight: 8,
            display: 'inline-block',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: isActive ? 18 : 2,
              top: 2,
              width: 16,
              height: 16,
              background: '#fff',
              borderRadius: '50%',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
        </span>
      </label>
      {isActive && (
        <div style={{ marginTop: 8, width: '100%' }}>
          {loading ? (
            <span>Loading...</span>
          ) : stacItems.length > 0 ? (
            <select
              value={selectedDate || ''}
              onChange={handleSelect}
              style={{ width: '100%' }}
            >
              {stacItems.map(item => (
                <option key={item.id} value={item.properties.datetime}>
                  {new Date(item.properties.datetime).toLocaleString()}
                </option>
              ))}
            </select>
          ) : (
            <span>No images found</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PreBurnToggle;
