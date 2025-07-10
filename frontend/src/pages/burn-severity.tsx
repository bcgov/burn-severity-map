import React, { useState, useEffect } from 'react';
import '../style.scss';
import './NBRMap.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector_db from '../components/ol-maps/FireSelector_db';
import { useAuth } from '../auth/AuthContext';

const NBRMap: React.FC = () => {
  const { user, login, isAuthenticated, isLoadingAuth } = useAuth();

  const [basemap, setBasemap] = useState('osm');
  const [center] = useState<[number, number]>([-126.5, 54.5]);
  const [zoom] = useState(5);
  
  // State for the list of available fire numbers
  const [fireNumbers, setFireNumbers] = useState<string[]>([]);
  // State for the currently selected fire number
  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);

  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
  };
  
  // Fetch the list of fire numbers when the component mounts
  useEffect(() => {
    const fetchFireNumbers = async () => {
      try {
        const response = await fetch('/pg-bs/burn-severity');
        if (!response.ok) {
          throw new Error(`Failed to fetch fire numbers: ${response.statusText}`);
        }
        const data = await response.json();
        // The API returns { "fire_numbers": [...] }, so we extract the array
        if (data && Array.isArray(data.fire_numbers)) {
          setFireNumbers(data.fire_numbers);
        }
      } catch (error) {
        console.error('Error fetching fire numbers:', error);
      }
    };

    fetchFireNumbers();
  }, []); // Empty dependency array ensures this runs only once on mount

  
  // Handler for when a fire is selected from the dropdown.
  // This function is now much simpler.
  const handleDbFireSelect = (fireNumber: string | null) => {
    setSelectedDbFire(fireNumber);
  };

  return (
    <div className="App">
      
      {isAuthenticated ? (
      <div className="app-layout">
        {/* Left Panel - Fire Selection */}
        <div className="left-panel">
          <h3>Processed Burn Severity Fires</h3>
          <FireSelector_db
            fires={fireNumbers}
            onFireSelect={handleDbFireSelect}
            selectedFire={selectedDbFire}
          />
        </div>

        {/* Center Panel - Map */}
        <div className="center-panel">
          <div className="map-container">
            {/* The OLMap component now only needs the selected fire number */}
            <OLMap 
              center={center} 
              zoom={zoom} 
              basemap={basemap}
              selectedDbFire={selectedDbFire}
            />
          </div>
          
          <div className="bcgov-basemap-selector">
            <BasemapSelector selectedBasemap={basemap} onBasemapChange={handleBasemapChange} />
          </div>
        </div>
      </div>
      ):(
      <div>
        <p> Please log in to access the application.</p>
      </div>  
        )
      
      }
    </div>
  );
};

export default NBRMap;