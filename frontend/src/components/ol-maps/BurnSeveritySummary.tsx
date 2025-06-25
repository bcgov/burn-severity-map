import React, { useEffect, useState } from 'react';
import './BurnSeveritySummary.scss';

// Define the colors to match the map symbology
const SEVERITY_COLORS = {
  'High': '#d73027',      // Red
  'Medium': '#fc8d59',    // Orange
  'Moderate': '#fc8d59',  // Same orange for Moderate (identical to Medium)
  'Low': '#fee08b',       // Yellow
  'Unburned': '#91cf60',  // Green
  'Unburnt': '#91cf60',   // Same green for Unburnt (alternative spelling)
  'Unchanged': '#91cf60', // Same green for Unchanged
  'Unknown': '#cccccc',   // Gray fallback
};

// Interface for aggregated data
interface SeveritySummary {
  severity: string;
  area: number;
  percentage: number;
}

interface BurnSeveritySummaryProps {
  featureCollection: any | null; // GeoJSON FeatureCollection
  selectedFire: string | null;
}

const BurnSeveritySummary: React.FC<BurnSeveritySummaryProps> = ({ featureCollection, selectedFire }) => {
  const [summaryData, setSummaryData] = useState<SeveritySummary[]>([]);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to aggregate data by burn severity
  useEffect(() => {
    if (featureCollection && featureCollection.features && featureCollection.features.length > 0) {
      setLoading(true);

      // Group features by burn severity and sum up area
      const severityGroups: Record<string, number> = {};
      let areaTotal = 0;

      featureCollection.features.forEach((feature: any) => {
        if (!feature.properties) return;

        // Get burn severity rating from properties, handle different possible field names
        const severity = 
          feature.properties.BURN_SEVERITY_RATING || 
          feature.properties.severty_class || 
          feature.properties.severity_class || 
          'Unknown';

        // Get area from properties (in hectares)
        const area = parseFloat(feature.properties.AREA_HA || feature.properties.area_ha || 0);

        if (!isNaN(area)) {
          // Add to the corresponding severity group
          if (!severityGroups[severity]) {
            severityGroups[severity] = 0;
          }
          severityGroups[severity] += area;
          areaTotal += area;
        }
      });

      // Convert to array for display and sort by severity
      const severityOrder = ['High', 'Medium', 'Moderate', 'Low', 'Unburned', 'Unburnt', 'Unchanged', 'Unknown'];
      const aggregatedData: SeveritySummary[] = Object.entries(severityGroups)
        .map(([severity, area]) => ({
          severity,
          area,
          percentage: (area / areaTotal) * 100
        }))
        .sort((a, b) => {
          const orderA = severityOrder.indexOf(a.severity);
          const orderB = severityOrder.indexOf(b.severity);
          return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
        });

      setSummaryData(aggregatedData);
      setTotalArea(areaTotal);
      setLoading(false);
    } else {
      setSummaryData([]);
      setTotalArea(0);
    }
  }, [featureCollection]);

  if (!selectedFire) {
    return (
      <div className="burn-severity-summary empty">
        <p>Select a fire to view burn severity summary</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="burn-severity-summary loading">
        <p>Loading burn severity data...</p>
      </div>
    );
  }

  if (!featureCollection || !featureCollection.features || featureCollection.features.length === 0) {
    return (
      <div className="burn-severity-summary empty">
        <p>No burn severity data available for this fire</p>
      </div>
    );
  }

  return (
    <div className="burn-severity-summary">
      <div className="summary-header">
        <h3>Burn Severity Summary - {selectedFire}</h3>
        <button className="close-btn" onClick={() => document.querySelector('.burn-severity-summary')?.classList.toggle('hidden')}>×</button>
      </div>
      <div className="total-area">
        Total Burn Area: <strong>{totalArea.toFixed(2)} ha</strong>
      </div>

      <div className="severity-table">
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Area (ha)</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map(item => (
              <tr key={item.severity}>
                <td>
                  <div className="severity-color" style={{ backgroundColor: SEVERITY_COLORS[item.severity as keyof typeof SEVERITY_COLORS] || '#cccccc' }}></div>
                  {item.severity}
                </td>
                <td>{item.area.toFixed(2)}</td>
                <td>{item.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar chart visualization */}
      <div className="burn-severity-chart">
        {summaryData.map(item => (
          <div 
            key={item.severity} 
            className="chart-bar"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: SEVERITY_COLORS[item.severity as keyof typeof SEVERITY_COLORS] || '#cccccc',
            }}
            title={`${item.severity}: ${item.area.toFixed(2)} ha (${item.percentage.toFixed(1)}%)`}
          >
            {item.percentage > 5 && (
              <span className="bar-label">
                {item.percentage.toFixed(1)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BurnSeveritySummary;
