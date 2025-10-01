//src/FireSelector.tsx
import { useRef, useState, useContext, useEffect } from 'react';
import { MapContext } from './MapContext';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import { toLonLat } from 'ol/proj';
import { getBottomLeft, getBottomRight, getTopRight } from 'ol/extent';
import { Select } from '@bcgov/design-system-react-components';
import { transform } from 'ol/proj';


import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';


proj4.defs('EPSG:3005', '+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 ' +
  '+x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs');
register(proj4);

// Optional: get the projection object if needed
const bcAlbers = getProjection('EPSG:3005');


export interface Fire {
  id: string;
  fireNumber: string;
  geographicDesc: string;
  ignitionDate: string;
  lonLat: [number, number];
}


const FireSelector: React.FC = () => {
  const { bounds, updateMapView, addFireBoundary, setSelectedFire, selectedFire } = useContext(MapContext);
  const [fires, setFires] = useState<Fire[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFireData = async () => {
      if (!bounds) return;
      setLoading(true);
      setError(null);

      try {
        const bottomLeft = transform(getBottomLeft(bounds), 'EPSG:3857', 'EPSG:3005');
        const topRight = transform(getTopRight(bounds), 'EPSG:3857', 'EPSG:3005');
        const bbox = `${bottomLeft[0]},${bottomLeft[1]},${topRight[0]},${topRight[1]}`;
        const minimumSize = '10';
        // consider moving this query out to populate a single list of all fires
        const cql = `CURRENT_SIZE>${minimumSize} AND BBOX(SHAPE, ${bbox})`;
        const url = `https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application/json&SORTBY=FIRE_NUMBER&srsName=EPSG:3005&CQL_FILTER=${encodeURIComponent(cql)}`

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch fire points: ${response.statusText}`);
        }
        const data = await response.json();
        const fireData = data.features.map((feature: any) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          return {
            id: props.FIRE_ID.toString(),
            fireNumber: props.FIRE_NUMBER,
            geographicDesc: props.GEOGRAPHIC_DESCRIPTION,
            ignitionDate: props.IGNITION_DATE,
            lonLat: [coords[0], coords[1]],
          };
        });
        setFires(fireData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFireData();
  }, [bounds]);


  const handleFireSelect = (key: string | number | null) => { 
    if (!key) return;

    // The 'key' is used to find the fire by its 'id'.
    // Since all your Fire IDs are strings (props.FIRE_ID.toString()), 
    // you must ensure the key is a string before comparison.
    const keyAsString = String(key); 

    const fire = fires.find(f => f.id === keyAsString);
    if (fire) {
      const newFire = transform(fire.lonLat, 'EPSG:3005', 'EPSG:4326');
      updateMapView([newFire[0], newFire[1]], 14);
      setSelectedFire(fire); 
      addFireBoundary(fire.fireNumber);
    }
  }



  return (
    <div>
      <h3>Select Fire</h3>
      {loading && <p>Loading fires...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      <div style={{width: '100%'}}>
      <Select 
        style={{width: '100%'}}
        label="Fire selection from map extent"
        placeholder='Select a fire'
        isDisabled={fires.length == 0}
        items={fires.map(fire => ({
          id: fire.id, // The value returned to onSelectionChange
          label: `${fire.fireNumber} - ${fire.geographicDesc}` // The display text
          // You can omit the other properties (fireNumber, geographicDesc) if they aren't used by the Select component itself.
        }))}
        onSelectionChange={handleFireSelect} // Correct function signature (key: string | null) => void
      ></Select>
      </div>
      {selectedFire !== null && (
      <p>Ignition Date: {new Date(selectedFire.ignitionDate).toLocaleDateString()}</p>
      )}
      {fires.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-500">No fires found in current view.</p>
      )}
    </div>
  );
};

export default FireSelector;
