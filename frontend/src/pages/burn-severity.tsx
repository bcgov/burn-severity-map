//src/pages/burn-severity.tsx
import React, { useState, useEffect, useMemo } from 'react';
import '../style.scss';
import './burn-severity.scss';
import OLMap from '../components/ol-maps/OLMap';
import BasemapSelector from '../components/ol-maps/BasemapSelector';
import FireSelector_db from '../components/ol-maps/FireSelector_db';
import DocumentPanel from '../components/DocumentPanel'
import { useAuth } from '../auth/AuthContext';
import { getFireYears, getFireDocuments, Document } from "../utils/apiService";
import { Accordion, AccordionGroup } from '@bcgov/design-system-react-components';
import { FireDataProvider, useFireData, FireOption } from '../components/FireDataContext';

const BurnSeverityContent: React.FC = () => {
  const { selectedYear, setSelectedYear, firePointsGeoJSON } = useFireData();
  const [basemap, setBasemap] = useState('satellite');
  const [center] = useState<[number, number]>([-126.5, 54.5]);
  const [zoom] = useState(5);

  const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const [exportDocuments, setExportDocuments] = useState<Document[]>([]);
  const [intermediateDocuments, setIntermediateDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [visibleFireNumbers, setVisibleFireNumbers] = useState<string[] | null>(null);

  useEffect(() => {
    console.log('Attempting to fetch years...');
    getFireYears()
      .then((years) => setAvailableYears(years))
      .catch((err) => console.error('Critical error fetching years:', err))
  }, []);


  const fireOptions: FireOption[] = useMemo(() => {
    if (!firePointsGeoJSON || !firePointsGeoJSON.features) return [];

    const optionsMap = new Map<string, FireOption>();

    firePointsGeoJSON.features.forEach((feature: any) => {
      const props = feature.properties || {};
      const fireNum = props.FIRE_NUMBER || props.fire_number;
      const coords = feature.geometry.coordinates;

      if (fireNum) {
        const cleanNum = String(fireNum).trim();
        optionsMap.set(cleanNum, {
          id: props.FIRE_ID.toString(),
          fireNumber: cleanNum,
          isProcessed: !!props.is_processed,
          incidentName: props.INCIDENT_NAME && props.INCIDENT_NAME !== cleanNum ? props.INCIDENT_NAME : props.GEOGRAPHIC_DESCRIPTION,
          geogDescription: props.GEOGRAPHIC_DESCRIPTION,
          ignitionDate: props.IGNITION_DATE,
          lonLat: [coords[0], coords[1]],
          year: props.FIRE_YEAR
        });
      }
    });
    return Array.from(optionsMap.values()).sort((a,b) => a.fireNumber.localeCompare(b.fireNumber));
  }, [firePointsGeoJSON]);

  const displayedFires = useMemo(() => {
    if (!visibleFireNumbers) return fireOptions;
    return fireOptions.filter(fire => visibleFireNumbers.includes(fire.fireNumber));
  }, [fireOptions, visibleFireNumbers]);

  useEffect(() => {
    if (!selectedDbFire) {
      setExportDocuments([]);
      setIntermediateDocuments([]);
      return;
    }
    const selectedOption = fireOptions.find(f => f.fireNumber === selectedDbFire);
    if (selectedOption && !selectedOption.isProcessed) {
      setExportDocuments([]);
      setIntermediateDocuments([]);
      return;
    }

    const getDocuments = async () => {
      setIsLoading(true);
      try {
        const [exportDocs, intermediateDocs] = await getFireDocuments(selectedYear, selectedDbFire);
        setExportDocuments(exportDocs);
        setIntermediateDocuments(intermediateDocs);
      }catch (error) {
          console.error("Failed to fetch documents:", error);
          setExportDocuments([]); // Clear documents on error
          setIntermediateDocuments([]);
        } finally {
          setIsLoading(false); // Set loading to false after fetching is done
        }
    };
    getDocuments();
  }, [selectedDbFire, selectedYear, fireOptions]);

  const handleDbYearSelect = (year: string | null) => {
    if (year) {
      setSelectedYear(year);
    }
    setSelectedDbFire(null);
  };

  const handleDbFireSelect = (fireNumber: string | null) => {
    setSelectedDbFire(fireNumber);
  };

  return (
    <div className="app-layout">
        {/* Left Panel - Fire Selection */}
        <div className="left-panel">
          <h2>View Burn Severity Analysis</h2>
          <h3>Processed Burn Severity Fires</h3>
          <FireSelector_db
            fires={displayedFires}
            availableYears={availableYears}
            onFireSelect={handleDbFireSelect}
            onYearSelect={handleDbYearSelect}
            selectedFire={selectedDbFire}
            selectedYear={selectedYear}
          />
          <AccordionGroup title='Files' allowsMultipleExpanded defaultExpandedKeys={['1']}>
            <Accordion id='1' label='Main Outputs'>
            <DocumentPanel
              selectedDbFire={ selectedDbFire }
              documents= { exportDocuments }
              isLoading= { isLoading }
             />
            </Accordion>
            <Accordion id='2' label='Intermediate'>
              <DocumentPanel
                selectedDbFire={ selectedDbFire }
                documents= { intermediateDocuments }
                isLoading= { isLoading }
               />
            </Accordion>
          </AccordionGroup>
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
              selectedDbYear={selectedYear}
              onVisibleFiresChange={setVisibleFireNumbers}
            />
          </div>
          
          <div className="bcgov-basemap-selector">
            <BasemapSelector selectedBasemap={basemap} onBasemapChange={(newBasemap) => setBasemap(newBasemap)} />
          </div>
        </div>
      </div>
  );
};

const BurnSeverityPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className='App'>
      {isAuthenticated ? (
        <FireDataProvider>
          <BurnSeverityContent />
        </FireDataProvider>
      ) : (
        <div>
          <p> Please log in to access the application.</p>
        </div>
      )}
    </div>
  );
};

export default BurnSeverityPage;
