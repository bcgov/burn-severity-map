//src/pages/burn-severity.tsx
import React, { useState, useEffect } from 'react';
import '../style.scss';
import './burn-severity.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector_db from '../components/ol-maps/FireSelector_db';
import DocumentPanel from '../components/DocumentPanel'
import { useAuth } from '../auth/AuthContext';
import { getFireData, getFireYears, getFireNumbers, getFireDocuments, Document } from "../utils/apiService";
import { Accordion, AccordionGroup } from '@bcgov/design-system-react-components';
import BurnSeveritySummary from '../components/ol-maps/BurnSeveritySummary';

const BurnSeverityPage: React.FC = () => {
  const { user, login, isAuthenticated, isLoadingAuth } = useAuth();

  const [basemap, setBasemap] = useState('osm');
  const [center] = useState<[number, number]>([-126.5, 54.5]);
  const [zoom] = useState(5);
  
  // State for the list of available fire numbers
  const [fireNumbers, setFireNumbers] = useState<string[]>([]);
  // State for the currently selected fire number
  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
  // State for the currently selected fire year
  const currentYear = String(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedDbYear, setSelectedDbYear] = useState<string | null>(null);
  // State for the currently selected documents
  const [ documents, setDocuments ] = useState<Document[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isRightPanelVisible, setRightPanelVisible ] = useState(true);
  const toggleRightPanel = () => {
  setRightPanelVisible(!isRightPanelVisible);
  };
  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
  };
  //get fire years on load
  useEffect(() => {
    console.log("Attempting to fetch years...");
    getFireYears()
      .then((years) => {
        console.log("Years fetched successfully:", years);
        setAvailableYears(years);
      })
      .catch((err) => {
        console.error("Critical error fetching years:", err);
      });
  }, []);


  // Fetch the list of fire numbers when a selected year changes
  useEffect(() => {
    if (!selectedDbYear) {
      setFireNumbers([]);
      return;
    }

    const fetchFireNumbers = async () => {
      try {
        const data = await getFireNumbers(selectedDbYear);
        if (data && Array.isArray(data.fire_numbers)) {
          setFireNumbers(data.fire_numbers);
        }
      } catch (error) {
        console.error('Error fetching fire numbers:', error);
      }
    };

    fetchFireNumbers();
  }, [selectedDbYear]);


  useEffect(() => {
    if (!selectedDbFire) {
      setDocuments([]);
      return;
    }
  const getDocuments = async () => {
    setIsLoading(true);
    try {
      const fetchedDocs = await getFireDocuments(selectedDbYear,selectedDbFire);
      setDocuments(fetchedDocs);
    }catch (error) {
        console.error("Failed to fetch documents:", error);
        setDocuments([]); // Clear documents on error
      } finally {
        setIsLoading(false); // Set loading to false after fetching is done
      }
  };
  getDocuments();
  }, [selectedDbFire]); // only should run if selected fire changes

  // Handler for when a year is selected from the dropdown
  const handleDbYearSelect = (year: string | null) => {
    setSelectedDbYear(year);
    setSelectedDbFire(null);   // clear fire when year changes
    setFireNumbers([]);        // avoid stale options
  };


  // Handler for when a fire is selected from the dropdown.
  const handleDbFireSelect = (fireNumber: string | null) => {
    setSelectedDbFire(fireNumber);
  };

  return (
    <div className="App">
      
      {isAuthenticated ? (
      <div className="app-layout">
        {/* Left Panel - Fire Selection */}
        <div className="left-panel">
          <h2>View Burn Severity Analysis</h2>
          <h3>Processed Burn Severity Fires</h3>
          <FireSelector_db
            fires={fireNumbers}
            availableYears={availableYears}
            onFireSelect={handleDbFireSelect}
            onYearSelect={handleDbYearSelect}
            selectedFire={selectedDbFire}
            selectedYear={selectedDbYear}
          />
          <h3>Documents</h3>
          <DocumentPanel
            selectedDbFire={ selectedDbFire }
            documents= { documents }
            isLoading= { isLoading }
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
              selectedDbYear={selectedDbYear}
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

export default BurnSeverityPage;