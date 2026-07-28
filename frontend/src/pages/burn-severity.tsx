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
  const [basemap, setBasemap] = useState('osm');
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
          incidentName: props.INCIDENT_NAME,
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

// const BurnSeverityPage: React.FC = () => {
//   const { user, login, isAuthenticated, isLoadingAuth } = useAuth();

//   const [basemap, setBasemap] = useState('osm');
//   const [center] = useState<[number, number]>([-126.5, 54.5]);
//   const [zoom] = useState(5);
  
//   // State for the list of available fire numbers
//   const [fireOptions, setFireOptions] = useState<FireOption[]>([]);
//   // State for the currently selected fire number
//   const [selectedDbFire, setSelectedDbFire] = useState<string | null>(null);
//   // State for the currently selected fire year
//   const currentYear = String(new Date().getFullYear());
//   const [availableYears, setAvailableYears] = useState<string[]>([]);
//   const [selectedDbYear, setSelectedDbYear] = useState<string | null>(null);
//   // State for the currently selected documents
//   const [ exportDocuments, setExportDocuments ] = useState<Document[]>([]);
//   const [ intermediateDocuments, setIntermediateDocuments ] = useState<Document[]>([]);
//   const [ isLoading, setIsLoading ] = useState<boolean>(false);
//   const [ isRightPanelVisible, setRightPanelVisible ] = useState(true);
//   const toggleRightPanel = () => {
//   setRightPanelVisible(!isRightPanelVisible);
//   };
//   const handleBasemapChange = (newBasemap: string) => {
//     setBasemap(newBasemap);
//   };
//   //get fire years on load
//   useEffect(() => {
//     if (!isAuthenticated) return;
//     console.log("Attempting to fetch years...");
//     getFireYears()
//       .then((years) => setAvailableYears(years))
//       .catch((err) => console.error("Critical error fetching years:", err));
//   }, [isAuthenticated]);


//   useEffect(() => {
//     if (!selectedDbYear) {
//       setFireOptions([]);
//       return;
//     }

//     const fetchCombinedFires = async () => {
//       try {
//         const [processedData, wfsFires] = await Promise.all([
//           getFireNumbers(selectedDbYear).catch(() => ({ fire_numbers: [] })),
//           getWfsFiresByYear(selectedDbYear).catch(() => [])
//         ]);

//         const processedSet = new Set(
//           Array.isArray(processedData?.fire_numbers)
//             ? processedData.fire_numbers.map((n: string) => n.trim())
//             : []
//         );

//         const allUniqueFires = new Set([...processedSet, ...wfsFires]);

//         const combinedOptions: FireOption[] = Array.from(allUniqueFires).map(fireNum => ({
//           fireNumber: fireNum,
//           isProcessed: processedSet.has(fireNum)
//         }));

//         setFireOptions(combinedOptions)
//       } catch (error) {
//         console.error('Error fetching combined fire numbers:', error);
//       }
//     };
//     fetchCombinedFires();
//   }, [selectedDbYear]);


//   // Fetch the list of fire numbers when a selected year changes
//   // useEffect(() => {
//   //   if (!selectedDbYear) {
//   //     setFireNumbers([]);
//   //     return;
//   //   }

//   //   const fetchFireNumbers = async () => {
//   //     try {
//   //       const data = await getFireNumbers(selectedDbYear);
//   //       if (data && Array.isArray(data.fire_numbers)) {
//   //         setFireNumbers(data.fire_numbers);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching fire numbers:', error);
//   //     }
//   //   };

//   //   fetchFireNumbers();
//   // }, [selectedDbYear]);


//   useEffect(() => {
//     if (!selectedDbFire) {
//       setExportDocuments([]);
//       setIntermediateDocuments([]);
//       return;
//     }
//     const selectedOption = fireOptions.find(f => f.fireNumber === selectedDbFire);
//     if (selectedOption && !selectedOption.isProcessed) {
//       setExportDocuments([]);
//       setIntermediateDocuments([]);
//       return;
//     }

//     const getDocuments = async () => {
//       setIsLoading(true);
//       try {
//         const [exportDocs, intermediateDocs] = await getFireDocuments(selectedDbYear, selectedDbFire);
//         setExportDocuments(exportDocs);
//         setIntermediateDocuments(intermediateDocs);
//       }catch (error) {
//           console.error("Failed to fetch documents:", error);
//           setExportDocuments([]); // Clear documents on error
//           setIntermediateDocuments([]);
//         } finally {
//           setIsLoading(false); // Set loading to false after fetching is done
//         }
//     };
//     getDocuments();
//   }, [selectedDbFire, selectedDbYear, fireOptions]); // only should run if selected fire changes

//   // Handler for when a year is selected from the dropdown
//   const handleDbYearSelect = (year: string | null) => {
//     setSelectedDbYear(year);
//     setSelectedDbFire(null);   // clear fire when year changes
//     setFireOptions([]);        // avoid stale options
//   };


//   // Handler for when a fire is selected from the dropdown.
//   const handleDbFireSelect = (fireNumber: string | null) => {
//     setSelectedDbFire(fireNumber);
//   };

//   return (
//     <div className="App">
      
//       {isAuthenticated ? (
//       <FireDataProvider>
//       <div className="app-layout">
//         {/* Left Panel - Fire Selection */}
//         <div className="left-panel">
//           <h2>View Burn Severity Analysis</h2>
//           <h3>Processed Burn Severity Fires</h3>
//           <FireSelector_db
//             fires={fireOptions}
//             availableYears={availableYears}
//             onFireSelect={handleDbFireSelect}
//             onYearSelect={handleDbYearSelect}
//             selectedFire={selectedDbFire}
//             selectedYear={selectedDbYear}
//           />
//           <AccordionGroup title='Files' allowsMultipleExpanded defaultExpandedKeys={['1']}>
//             <Accordion id='1' label='Main Outputs'>
//             <DocumentPanel
//               selectedDbFire={ selectedDbFire }
//               documents= { exportDocuments }
//               isLoading= { isLoading }
//              />
//             </Accordion>
//             <Accordion id='2' label='Intermediate'>
//               <DocumentPanel
//                 selectedDbFire={ selectedDbFire }
//                 documents= { intermediateDocuments }
//                 isLoading= { isLoading }
//                />
//             </Accordion>
//           </AccordionGroup>
//         </div>

//         {/* Center Panel - Map */}
//         <div className="center-panel">
//           <div className="map-container">
//             {/* The OLMap component now only needs the selected fire number */}
//             <OLMap 
//               center={center} 
//               zoom={zoom} 
//               basemap={basemap}
//               selectedDbFire={selectedDbFire}
//               selectedDbYear={selectedDbYear}
//             />
//           </div>
          
//           <div className="bcgov-basemap-selector">
//             <BasemapSelector selectedBasemap={basemap} onBasemapChange={handleBasemapChange} />
//           </div>
//         </div>

//       </div>
//       </FireDataProvider>
//       ):(
//       <div>
//         <p> Please log in to access the application.</p>
//       </div>  
//         )
      
//       }
//     </div>
//   );
// };

// export default BurnSeverityPage;