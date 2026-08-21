import React from 'react';
import './Selectors.scss';

export interface SensorOption {
    label: string;
    value: string;
}

interface SensorSelectorProps {
    selectedSensor: string | null;
    onSensorSelect: (sensor: string | null) => void;
    availableSensors: SensorOption[];
}

const SensorSelector: React.FC<SensorSelectorProps> =({
    selectedSensor,
    onSensorSelect,
    availableSensors
}) => {
    return (
        <div className='bcgov-year-selector'>
            <label className='bcgov-fire-selector-label'>
                <h4>Sensor</h4>
                <p>Select a sensor to view available image tiles</p>
            </label>
            <select
                className='bcgov-fire-selector-input'
                value={selectedSensor ?? ''}
                onChange={(e) => 
                    onSensorSelect(e.target.value || null)
                }
                aria-label='Select a sensor'
            >
                <option className='bcgov-fire-selector-list' value=''>Select sensor</option>
                {availableSensors.map(sensor => (
                    <option key={sensor.value} value={sensor.value}>
                        {sensor.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SensorSelector;