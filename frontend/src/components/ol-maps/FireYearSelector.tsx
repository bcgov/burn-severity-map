//src/components/ol-maps/FireYearSelector.tsx
import React from 'react';
import './Selectors.scss';


interface FireYearSelectorProps {
  selectedYear: string | null;
  onYearSelect: (year: string | null) => void;
  availableYears: string[]; 
}

const FireYearSelector: React.FC<FireYearSelectorProps> = ({
  selectedYear,
  onYearSelect,
  availableYears
}) => {

  return (
    <div className="bcgov-year-selector">
      <label className="bcgov-fire-selector-label">
        <h4>Fire Year</h4>
        <p>Select a year to view burn severity</p>
      </label>
      <select
        className="bcgov-fire-selector-input"
        value={selectedYear ?? ''}
        onChange={(e) =>
          onYearSelect(e.target.value || null)
        }
        aria-label="Select fire year"
      >
        <option className="bcgov-fire-selector-list" value="">Select year</option>
        {availableYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FireYearSelector;