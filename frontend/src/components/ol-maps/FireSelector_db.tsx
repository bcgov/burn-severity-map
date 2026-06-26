import React from 'react';
import FireYearSelector from './FireYearSelector';
import FireNumberSelector from './FireNumberSelector';

interface FireSelectorDbProps {
  fires: string[];
  availableYears: string[];
  selectedYear: string | null;
  selectedFire: string | null;
  onYearSelect: (year: string | null) => void;
  onFireSelect: (fire: string | null) => void;
}

const FireSelectorDb: React.FC<FireSelectorDbProps> = ({
  fires,
  availableYears,
  selectedYear,
  selectedFire,
  onYearSelect,
  onFireSelect
}) => {
  return (
    <>
      <FireYearSelector
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearSelect={onYearSelect}
      />

      <FireNumberSelector
        fires={fires}
        selectedFire={selectedFire}
        onFireSelect={onFireSelect}
        disabled={!selectedYear}
      />
    </>
  );
};

export default FireSelectorDb;