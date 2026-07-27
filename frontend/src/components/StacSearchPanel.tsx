import React, { useState, useContext, useEffect, CSSProperties } from 'react';
import { useAuth } from '../auth/AuthContext';
import { MapContext } from './MapContext';
import { Extent } from 'ol/extent';
import { toLonLat } from 'ol/proj';
import { getBottomLeft, getTopRight } from 'ol/extent';
import { Accordion, AccordionGroup, Button, Switch } from '@bcgov/design-system-react-components';
// import Fire from './FireSelector';
import { PuffLoader } from 'react-spinners';
import { syncFireResults } from '../utils/apiService';
import './StacSearchPanel.scss'
import { runBurnSeverityAnalysis, AnalysisRequest } from '../utils/apiService';

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
  preImageID: string | null;
  postImageID: string | null;
  imageIDs: string | null;
  preImageCloud: number | null;
  postImageCloud: number | null;
  cloudCover: number | null;
}

const StacSearchPanel: React.FC = () => {
  const { getAccessToken } = useAuth();
  const { bounds, addPreviewLayer, removePreviewLayer, selectedFire, setAnalysisFire } = useContext(MapContext);
  const [previewLayerId, setPreviewLayerId] = useState<string | null>(null);

  const [searchCriteria, setSearchCriteria] = useState<StacSearchCriteria>({
    collection: 'sentinel-2-l2a',
    bbox: null,
    preOffset: 1,
    postOffset: 1,
    cloudCover: 30,
  });
  const [ analysisConfig, setAnalysisConfig ]= useState<AnalysisConfig>({
    fire_number: null,
    year: null,
    sensor: 'S2',
    preImageDate: null,
    postImageDate: null,
    preImageID: null,
    postImageID: null,
    imageIDs: null,
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
  const [analysisRunning, setAnalysisRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!bounds) return;
    setSearchCriteria(prev => ({ ...prev, bbox: bounds }));
  }, [bounds]);

  useEffect(() => {
    if (!selectedFire) return;
    setAnalysisConfig(prev => ({ ...prev,fire_number:selectedFire.fireNumber,year:selectedFire.year}));
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

  const handleStartAnalysis = async () => {
    const url = "/analysis/run-analysis";
    const defaultCloud = "10";
    const currentYear = new Date().getFullYear();
    const thisYear = analysisConfig.year ?? new Date().getFullYear();
    const sCloud = analysisConfig.preImageCloud ?? defaultCloud;
    const eCloud = analysisConfig.postImageCloud ?? defaultCloud;
    const cloud =  Math.max(Number(sCloud)+1, Number(eCloud)+1);
    const imageIDs = analysisConfig.preImageID + ':' + analysisConfig.postImageID;
    setAnalysisRunning(true);

    const payload: AnalysisRequest = {
      fire: analysisConfig.fire_number,
      year: thisYear,
      sensor: "S2",
      cloud: cloud,
      object_storage: true,
      s_date: analysisConfig.preImageDate || undefined,
      e_date: analysisConfig.postImageDate || undefined,
      image_ids: imageIDs,
    };

    try {
      const result = await runBurnSeverityAnalysis(payload);

      console.log("Analysis result:", result);
      if (analysisConfig.fire_number){
        await syncFireResults(String(thisYear),analysisConfig.fire_number)
        setAnalysisFire(analysisConfig.fire_number);
      }
    } catch (error) {
        setAnalysisRunning(false);
        let errorMessage = 'Failed to start analysis.';
        if (error instanceof Error){
          errorMessage = error.message;
        }
        console.error("Error running analysis:", errorMessage);
        alert(errorMessage);
    } finally {
      setAnalysisRunning(false);
    }
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
      preImageID: id === '' ? null: String(id),
      preImageCloud: cloud_cover,
    }));
  }
  const handlePostImageSelection = (cloud_cover: number, postImageDate: string, id: string) => {
    console.log("Changing postimage to: ",postImageDate);

    setSelectedPostImageId(id); // <-- Track selected image
    setAnalysisConfig(prev => ({
      ...prev,
      postImageDate: postImageDate === '' ? null: String(postImageDate),
      postImageID: id === '' ? null: String(id),
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
        <div className="panel-box">
          <h4>Attributes</h4>
          <p><span>Fire:</span> {String(new Date().getFullYear())}-{analysisConfig.fire_number}</p>
          <p><span>Start Date:</span> {analysisConfig.preImageDate}</p>
          <p><span>Start ID:</span> {analysisConfig.preImageID}</p>
          <p><span>End Date:</span> {analysisConfig.postImageDate}</p>
          <p><span>End ID:</span> {analysisConfig.postImageID}</p>
          <p>
            <span>Cloud Cover:</span>{' '}
            {Math.max(
              analysisConfig.preImageCloud ?? 0,
              analysisConfig.postImageCloud ?? 0
            )}%
          </p>
        </div>
      )}

      <div className="panel-box">
        <h4>Bounding Box (from map)</h4>
        {searchCriteria.bbox ? (
          <div>
            <p><span>NE:</span> {toLonLat(getTopRight(searchCriteria.bbox))[0].toFixed(4)}, {toLonLat(getTopRight(searchCriteria.bbox))[1].toFixed(4)}</p>
            <p><span>SW:</span> {toLonLat(getBottomLeft(searchCriteria.bbox))[0].toFixed(4)}, {toLonLat(getBottomLeft(searchCriteria.bbox))[1].toFixed(4)}</p>
          </div>
        ) : (
          <p>Loading bounds...</p>
        )}
      </div>

      <div className="panel-box">
        <h4>Image Search</h4>      

        <div className="image-search-options">
          {/* Pre-fire slider */}
          <div className="slider-box">
            <h5>Pre-fire Offset</h5>
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
            <div className="slider-month-text">{searchCriteria.preOffset} month(s)</div>
          </div>

          {/* Fire emoji */}
          <div className="fire-emoji">🔥</div>

          {/* Post-fire slider */}
          <div className="slider-box">
            <h5>Post-fire Offset</h5>
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
            <div className="slider-month-text">{searchCriteria.postOffset} month(s)</div>
          </div>
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

      <div className="stac-interaction-box">

        <div className="button-group-container">
          {/* Conditionally render the PuffLoader 
          
          */}

          {loading || analysisRunning && (
          <div className='analysis-spinner'>
            <PuffLoader color="#003366" size={50}/>
          </div>
          )}
          <div className="button-box">
            <Button onPress={handleSearch} isDisabled={loading}>
              {loading ? 'Searching...' : 'Load images'}
            </Button>
            <Button onPress={handleStartAnalysis} isDisabled={!analysisReady || analysisRunning}>
              Start Analysis
            </Button>
          </div>
        

          {error && <p className="error-text">Error: {error}</p>}
        </div>
        {searchResults.length > 0 && (
          <div>
            <AccordionGroup title='Pre ignition images' allowsMultipleExpanded>
              {preIgnitionResults.map(item => (
                <Accordion id={item.id} label={new Date(item.properties.datetime).toLocaleDateString('en-CA')}>
                  <div>
                    <strong>ID: </strong> {item.id} <br />
                    <strong>Cloud: </strong>{item.properties["eo:cloud_cover"].toFixed(0)}%<br />
                    <div className="image-interaction-box">
                      <Switch
                        children="Select as pre fire image"
                        isSelected={selectedPreImageId === item.id}
                        onChange={(isSelected) => {
                          if (isSelected) {
                            handlePreImageSelection(
                              Number(item.properties["eo:cloud_cover"].toFixed(0)),
                              new Date(item.properties.datetime).toLocaleDateString('en-CA'),
                              item.id
                            );
                          } else {
                            setSelectedPreImageId(null);
                            setAnalysisConfig(prev => ({
                              ...prev,
                              preImageDate: null,
                              preImageCloud: null,
                              preImageID: null,
                            }));
                          }
                        }}
                      />
                      <Button
                        size="small"
                        onPress={() => {
                          if (previewLayerId === item.id) {
                            removePreviewLayer();
                            setPreviewLayerId(null);
                          } else {
                            addPreviewLayer(item.assets.visual.href);
                            setPreviewLayerId(item.id);
                          }
                        }}
                      >
                        {previewLayerId === item.id ? 'Remove preview' : 'Preview'}
                      </Button>
                    </div>
                  </div>
                </Accordion>
              ))}
            </AccordionGroup>
            <AccordionGroup title='Post ignition images' allowsMultipleExpanded>
              {postIgnitionResults.map(item => (
                <Accordion id={item.id} label={new Date(item.properties.datetime).toLocaleDateString('en-CA')}>
                  <div>
                    <strong>ID: </strong> {item.id} <br />
                    <strong>Cloud: </strong>{item.properties["eo:cloud_cover"].toFixed(0)}%<br />
                    <div className="image-interaction-box">
                      <Switch
                        children="Select as post fire image"
                        isSelected={selectedPostImageId === item.id}
                        onChange={(isSelected) => {
                          if (isSelected) {
                            handlePostImageSelection(
                              Number(item.properties["eo:cloud_cover"].toFixed(0)),
                              new Date(item.properties.datetime).toLocaleDateString('en-CA'),
                              item.id
                            );
                          } else {
                            setSelectedPostImageId(null);
                            setAnalysisConfig(prev => ({
                              ...prev,
                              postImageDate: null,
                              postImageCloud: null,
                              postImageID: null,
                            }));
                          }
                        }}
                      />
                    <Button
                      size="small"
                      onPress={() => {
                        if (previewLayerId === item.id) {
                          removePreviewLayer();
                          setPreviewLayerId(null);
                        } else {
                          addPreviewLayer(item.assets.visual.href);
                          setPreviewLayerId(item.id);
                        }
                      }}
                    >
                      {previewLayerId === item.id ? 'Remove preview' : 'Preview'}
                    </Button>
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