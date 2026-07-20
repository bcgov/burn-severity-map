

# main.py - A fastapi backend to support burn severity document management
# TODO: deal with year eg 2025-N75432 is the prefix for documents and the remaining app works on the fire number unique id

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.concurrency import run_in_threadpool
from contextlib import asynccontextmanager
import os
import json
import re
import logging
from oidc.oidcAuthorize import verify_token
from utils import s3_get_presigned_url, s3_list_objects, append_geojson_to_geoparquet_s3, s3_connected, geoparquet_on_s3, format_file_size
from database import get_unique_fire_numbers, get_fire_features,check_connection
from models import FireNumberList, FeatureCollection, Feature, Geometry, FeatureProperties
from utils import s3_get_presigned_url, s3_list_objects, append_geojson_to_geoparquet_s3, s3_connected, geoparquet_on_s3
from database import get_unique_fire_numbers, get_fire_features,check_connection,get_years_with_features
from models import FireNumberList, FeatureCollection, Feature, Geometry, FeatureProperties, FireYearsList
from routers import fires

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup initiate geoparquet file if it doesn't exists
    # update geoparquet if new burn severity classifications exist
    try:
        logger.info('API Startup -- reconciling bs')
        if s3_connected():
            obj_list = s3_list_objects()
            geojson_pattern = re.compile(r'.*/20\d{2}-[A-Z]\d{5}.*\.json$')
            fire_jsons = [doc['Key'] for doc in obj_list if geojson_pattern.match(doc['Key'])]
            # application has never been run
            if not geoparquet_on_s3() and len(fire_jsons)==0:
                logger.warning('No fires on objectstore to initialize application')
            elif not geoparquet_on_s3() and len(fire_jsons)>0:
                # initiate 
                logger.info(f'Initializing geoparquet with {len(fire_jsons)} fires')
                for fire_key in fire_jsons:
                    await run_in_threadpool(append_geojson_to_geoparquet_s3, fire_key)
            elif geoparquet_on_s3() and len(fire_jsons)>0:
                # update geoparque
                fire_list = get_unique_fire_numbers(year=None)
                for fire_json in fire_jsons:
                    year = fire_json.split('/')[-1].split('-')[0]
                    fire = fire_json.split('/')[-1].split('-')[1][:6]
                    if fire not in fire_list:
                        logger.info(f'Loading new bs to application {year}-{fire}')
                        #await run_in_threadpool(append_geojson_to_geoparquet_s3, fire_json)
        else:
            logger.error('Connection to object storage failed')
            raise ConnectionError('Connection to object storage failed') 
    except Exception as e:
        logger.error(f"Startup error: {e}")
    yield
    logger.info('API Shutdown')


app = FastAPI(title="Burn Severity API", version="1.0",lifespan=lifespan)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.include_router(fires.router)

# Allow your frontend origin
origins = [
    "http://localhost:8080",    # frontend dev server
    "http://127.0.0.1:8080",    # optional
]
if os.getenv('FRONTEND_URL'):
    origins.append(os.getenv('FRONTEND_URL'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
        
@app.get("/burn-severity/{year}", response_model=FireNumberList)
# def list_fire_numbers(token_payload: dict = Depends(verify_token)): #use this if you want to protect the route
def list_fire_numbers(year: str, token_payload: dict = Depends(verify_token)):
    # protected route
    try:
        fire_numbers = get_unique_fire_numbers(year=year)
        return {"fire_numbers": fire_numbers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/burn-severity/{year}/{fire_number}", response_model=FeatureCollection)
def get_fire_by_number(year: str, fire_number: str, token_payload: dict = Depends(verify_token)):
    # Protected route
    # eg. 2025, N71148
    try:
        df = get_fire_features(year,fire_number)
        features = []

        if not df is None:
            for _, row in df.iterrows():
                geometry = json.loads(row.pop("geometry"))
                properties = FeatureProperties(**row.to_dict())
                feature = Feature(geometry=Geometry(**geometry), properties=properties)
                features.append(feature)

        return FeatureCollection(features=features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sync-burn-severity/{year}/{fire_number}")
async def sync_burn_severity(year:str, fire_number: str):
    try:
        logger.info(f'Sync BS for {year}-{fire_number}')
        obj_list = s3_list_objects(file_prefix=f'{year}-{fire_number}')
        pattern = re.compile(r'.*/20\d{2}-[A-Z]\d{5}.*\.json$')
        fire_jsons = [doc['Key'] for doc in obj_list if pattern.match(doc['Key'])]
        logger.info(str(fire_jsons))
        if len(fire_jsons)==1:
            fire_json = fire_jsons[0]
            logger.info(f'Loading new bs to application {year}-{fire_number}')
            fire_list = get_unique_fire_numbers()
            if fire_number not in fire_list:
                await run_in_threadpool(append_geojson_to_geoparquet_s3, fire_json)
            else:
                logger.info(f'Fire {fire_number} already has a burn severity classification')
                raise HTTPException(status_code=404, detail=(f'Fire {fire_number} already has a burn severity classification'))
        else:
            logger.debug(f'{len(fire_jsons)} json files matching pattern. Expecting 1')
            raise HTTPException(status_code=500, detail=(f'{len(fire_jsons)} json files matching pattern. Expecting 1'))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return True

@app.get("/years", response_model=FireYearsList)
def get_years(token_payload: dict = Depends(verify_token)):
    try:
        yearsList = get_years_with_features()
        return {"fire_years": yearsList}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# @app.get(
#     "/docs/list/{year}/{fire_number}",
#     summary="get list of documents related to fire_number"
# )
# async def get_docs(year:str,fire_number:str, token_payload: dict = Depends(verify_token)):
#     # Protected route
#     return HTTPException(status_code=404, detail="This route is not built")

@app.get(
    "/docs/download/{year}/{fire_number}"
)
async def download_file(year:str, fire_number:str, token_payload: dict = Depends(verify_token)):
    # Protected route
    """
    Returns a presigned URL for a file in S3-compliant storage.
    Client will make a direct GET request to this URL.
    """

    # get list of s3 objects with the given prefix within the export folder
    export_obj_list = s3_list_objects(file_prefix=f'{year}-{fire_number}/export')
    if not export_obj_list:
        raise HTTPException(status_code=404, detail="No files found for the given prefix.")
    
    # get list of s3 objects with the given prefix within the output folder
    intermediate_obj_list = s3_list_objects(file_prefix=f'{year}-{fire_number}/output')

    export_files = [
        # create a dictionary with the object key and its presigned URL
        {
            "key": obj['Key'],
            "filename": obj['Key'].split("/")[-1],
            "url": s3_get_presigned_url(obj['Key'], expiration_seconds=3600),
            "size": format_file_size(float(obj['Size'])),
            "createdDate": obj['LastModified'].strftime('%Y-%m-%d')
        }
        for obj in export_obj_list
    ]

    if not export_files:
        raise HTTPException(status_code=404, detail="No files found for the given prefix.")
    
    intermediate_files = [
        # create a dictionary with the object key and its presigned URL
        {
            "key": obj['Key'],
            "filename": obj['Key'].split("/")[-1],
            "url": s3_get_presigned_url(obj['Key'], expiration_seconds=3600),
            "size": format_file_size(float(obj['Size'])),
            "createdDate": obj['LastModified'].strftime('%Y-%m-%d')
        }
        for obj in intermediate_obj_list
    ]
    
    return JSONResponse({"export_files": export_files, "intermediate_files": intermediate_files})

@app.get("/health", summary="Health Check", tags=["Monitoring"])
async def health_check():
    db_status = check_connection()

    status = {
        "status":"ok" if db_status else "degraded",
        "object_storage": "connected" if db_status else "unreachable"
    }
    return JSONResponse(content=status, status_code=200 if db_status else 503)


@app.get("/health/api")
def api_health():
    version= os.getenv('APP_VERSION', 'dev')

    return {'status': 'ok',
            'version': version}

@app.get("/health/storage")
def storage_health():
    if s3_connected():
        return {'status': 'connected'}
    else:
        return {'status': 'unreachable'}
    
@app.get("/health/data")
def data_health():
    lst_fires = get_unique_fire_numbers()
    if lst_fires == None:
        return {
            'status': 'unreachable',
            'fire_count': None,
            'error': 'Unable to read parquet file'
        }
    elif lst_fires == []:
        return {
            'status': 'not created',
            'fire_count': 0,
            'message': 'Parquet file does not exist yet'
        }
    else:
        return {
            'status': 'ok',
            'fire_count': len(lst_fires),
            'message': 'Data loaded successfully'
        }
    
@app.get('/config')
def get_oidc_config():
    return {
        'oidc_client_id': os.getenv('OIDC_CLIENT_ID'),
        'oidc_authority': os.getenv('OIDC_AUTHORITY')
    }