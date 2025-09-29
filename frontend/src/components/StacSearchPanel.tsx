import React, { useState, useContext, useEffect } from 'react';
import { MapContext } from './MapContext';
import { Extent } from 'ol/extent';
import { toLonLat } from 'ol/proj';
import { getBottomLeft, getTopRight } from 'ol/extent';
import { Accordion, AccordionGroup, Button, Switch } from '@bcgov/design-system-react-components';
import Fire from './FireSelector';


interface StacSearchCriteria {
  collection: string | null;
  bbox: Extent | null;
  preOffset: number;
  postOffset: number;
  cloudCover: number | null;
}

interface AnalysisConfig {
  fire_number: string | null;
  year: number | null;
  sensor: string | null;
  preImageDate: string | null;
  postImageDate: string | null;
  preImageCloud: number | null;
  postImageCloud: number | null;
  cloudCover: number | null;
}

const StacSearchPanel: React.FC = () => {
  const { bounds, addPreviewLayer, selectedFire } = useContext(MapContext);

  const [searchCriteria, setSearchCriteria] = useState<StacSearchCriteria>({
    collection: 'sentinel-2-l2a',
    bbox: null,
    preOffset: 1,
    postOffset: 1,
    cloudCover: 30,
  });
  const [ analysisConfig, setAnalysisConfig ]= useState<AnalysisConfig>({
    fire_number: null,
    year: 2025,
    sensor: 'S2',
    preImageDate: null,
    postImageDate: null,
    preImageCloud: 0,
    postImageCloud: 0,
    cloudCover: 0,
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreImageId, setSelectedPreImageId] = useState<string | null>(null);
  const [selectedPostImageId, setSelectedPostImageId] = useState<string | null>(null);
  const [analysisReady, setAnalysisReady] = useState<boolean>(false);

  useEffect(() => {
    if (!bounds) return;
    setSearchCriteria(prev => ({ ...prev, bbox: bounds }));
  }, [bounds]);

  useEffect(() => {
    if (!selectedFire) return;
    setAnalysisConfig(prev => ({ ...prev,fire_number:selectedFire.fireNumber}));
  }, [selectedFire]);
  // is analysis config ready
  useEffect(() => {
    console.log("Analysis config: ", analysisConfig);
    const { fire_number, year, sensor, postImageDate, cloudCover } = analysisConfig;
    const isReady =
      fire_number !== null &&
      year !== null &&
      sensor !== null &&
      postImageDate !== null;
    console.log("Analysis config2: ", fire_number, year, sensor, postImageDate);
    console.log("Analysis ready: ",isReady);
    setAnalysisReady(isReady);
  }, [analysisConfig]);


  const computeDatesFromOffsets = () => {
    if (!selectedFire) return { preDate: null, postDate: null };
    const ignitionDate = new Date(selectedFire.ignitionDate);
    const preDate = new Date(ignitionDate);
    preDate.setMonth(ignitionDate.getMonth() - searchCriteria.preOffset);
    const postDate = new Date(ignitionDate);
    postDate.setMonth(ignitionDate.getMonth() + searchCriteria.postOffset);
    return { preDate, postDate };
  };

  const handlePreOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria(prev => ({ ...prev, preOffset: Number(e.target.value) }));
  };

  const handlePostOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria(prev => ({ ...prev, postOffset: Number(e.target.value) }));
  };

  const handleCloudCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCriteria(prev => ({
      ...prev,
      cloudCover: value === '' ? null : Number(value),
    }));
  };
  const handlePreImageSelection = (cloud_cover: number, preImageDate: string, id:string) => {
    console.log("Changing preimage to: ",preImageDate);
    setSelectedPreImageId(id); // <-- Track selected image
    setAnalysisConfig(prev => ({
      ...prev,
      preImageDate: preImageDate === '' ? null: String(preImageDate),
      preImageCloud: cloud_cover,
    }));
  }
  const handlePostImageSelection = (cloud_cover: number, postImageDate: string, id: string) => {
    console.log("Changing postimage to: ",postImageDate);

    setSelectedPostImageId(id); // <-- Track selected image
    setAnalysisConfig(prev => ({
      ...prev,
      postImageDate: postImageDate === '' ? null: String(postImageDate),
      postImageCloud: cloud_cover,
    }));
  }

  const handleSearch = async () => {
    const { bbox, cloudCover, collection } = searchCriteria;
    const { preDate, postDate } = computeDatesFromOffsets();

    if (!bbox || !preDate || !postDate || !collection) {
      setError("Please select both pre and post fire offsets.");
      return;
    }

    setLoading(true);
    setError(null);

    const bottomLeft = toLonLat(getBottomLeft(bbox));
    const topRight = toLonLat(getTopRight(bbox));

    const body = {
      collections: [collection],
      bbox: [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]],
      query: {
        "eo:cloud_cover": { lte: cloudCover !== null ? cloudCover : 30 },
      },
      datetime: `${preDate.toISOString().split('T')[0]}T00:00:00Z/${postDate.toISOString().split('T')[0]}T23:59:59Z`,
      sortby: [{ field: "properties.datetime", direction: 'desc' }],
      limit: 100
    };

    try {
      const response = await fetch('https://earth-search.aws.element84.com/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.features || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch STAC items.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewClick = (url: string) => {
    if (!url) return;
    addPreviewLayer(url);
  };

  const ignitionDate = selectedFire ? new Date(selectedFire.ignitionDate) : null;
  const preIgnitionResults = ignitionDate
    ? searchResults.filter(item => new Date(item.properties.datetime) < ignitionDate)
    : [];
  const postIgnitionResults = ignitionDate
    ? searchResults.filter(item => new Date(item.properties.datetime) >= ignitionDate)
    : [];
  return (
    <div className="StacSearchPanel">
      <h3>Configuration Settings</h3>
      {analysisConfig.fire_number && (
        <div>
          <p>fire: {analysisConfig.fire_number}</p>
          <p>year: {String(new Date().getFullYear())}</p>
          <p>sensor: {analysisConfig.sensor}</p>
          <p>s_date: {analysisConfig.preImageDate}</p>
          <p>e_date: {analysisConfig.postImageDate}</p>
          <p>
            cloud:{' '}
            {Math.max(
              analysisConfig.preImageCloud ?? 0,
              analysisConfig.postImageCloud ?? 0
            )}
          </p>
        </div>
      )}

      <h3>Bounding Box (from map)</h3>
      {searchCriteria.bbox ? (
        <div>
          <p>NE: {toLonLat(getTopRight(searchCriteria.bbox))[0].toFixed(4)}, {toLonLat(getTopRight(searchCriteria.bbox))[1].toFixed(4)}</p>
          <p>SW: {toLonLat(getBottomLeft(searchCriteria.bbox))[0].toFixed(4)}, {toLonLat(getBottomLeft(searchCriteria.bbox))[1].toFixed(4)}</p>
        </div>
      ) : (
        <p>Loading bounds...</p>
      )}

      <h3>Image Search</h3>      

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5em', 
  marginBottom: '2em', marginRight: '2em', marginLeft: '2em' }}>
  {/* Pre-fire slider */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Pre-fire Offset</h4>
    <input
      type="range"
      min="1"
      max="12"
      value={13 - searchCriteria.preOffset}
      onChange={(e) =>
        setSearchCriteria(prev => ({
          ...prev,
          preOffset: 13 - Number(e.target.value)
        }))
      }
    />
    <div style={{ marginTop: '0.5em' }}>{searchCriteria.preOffset} month(s)</div>
  </div>

  {/* Fire emoji */}
  <div style={{ fontSize: '2em' }}>🔥</div>

  {/* Post-fire slider */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Post-fire Offset</h4>
    <input
      type="range"
      min="1"
      max="12"
      value={searchCriteria.postOffset}
      onChange={(e) =>
        setSearchCriteria(prev => ({
          ...prev,
          postOffset: Number(e.target.value)
        }))
      }
    />
    <div style={{ marginTop: '0.5em' }}>{searchCriteria.postOffset} month(s)</div>
  </div>
</div>

      <label> Max allowed cloud (%) :
      <input
        type="number"
        value={searchCriteria.cloudCover !== null ? searchCriteria.cloudCover : ''}
        onChange={handleCloudCoverChange}
        min="0"
        max="100"
        placeholder="0-100"
      />
      </label>

      <div style={{marginTop:'2em'}}>
        <Button onPress={handleSearch} isDisabled={loading}>
          {loading ? 'Searching...' : 'Load images'}
        </Button>
        <Button style= {{marginLeft:'0.5em'}} isDisabled={!analysisReady}>
          Start Analysis
        </Button>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {searchResults.length > 0 && (
          <div>
            <AccordionGroup title='Pre ignition images' allowsMultipleExpanded>
              {preIgnitionResults.map(item => (
                <Accordion id={item.id} label={new Date(item.properties.datetime).toLocaleDateString()}>
                  <div>
                    <strong>ID: </strong> {item.id} <br />
                    <strong>Cloud: </strong>{item.properties["eo:cloud_cover"].toFixed(0)}%<br />
                    <div style={{marginTop: '0.5em'}}>
                    <Switch style= {{marginTop: '0.5em',marginBottom: '0.5em'}} 
                      children="Select as pre fire image"
                      isSelected={selectedPreImageId === item.id}
                      onChange={() => handlePreImageSelection(item.properties["eo:cloud_cover"].toFixed(0),
                        new Date(item.properties.datetime).toLocaleDateString(), 
                        item.id
                      )}
                    ></Switch>
                    <Button size='small' onPress={() => handlePreviewClick(item.assets.visual.href)}>Preview</Button>
                    </div>
                  </div>
                </Accordion>
              ))}
            </AccordionGroup>
            <AccordionGroup title='Post ignition images' allowsMultipleExpanded>
              {postIgnitionResults.map(item => (
                <Accordion id={item.id} label={new Date(item.properties.datetime).toLocaleDateString()}>
                  <div>
                    <strong>ID: </strong> {item.id} <br />
                    <strong>Cloud: </strong>{item.properties["eo:cloud_cover"].toFixed(0)}%<br />
                    <div style={{marginTop: '0.5em'}}>
                    <Switch style= {{marginTop: '0.5em',marginBottom: '0.5em'}} 
                      children="Select as post fire image"
                      isSelected={selectedPostImageId === item.id}
                      onChange={() => handlePostImageSelection(item.properties["eo:cloud_cover"].toFixed(0),
                        new Date(item.properties.datetime).toLocaleDateString(),
                        item.id
                      )}
                    ></Switch>
                    <Button size='small' onPress={() => handlePreviewClick(item.assets.visual.href)}>Preview</Button>
                  </div>
                  </div>
                </Accordion>
              ))}
            </AccordionGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default StacSearchPanel;