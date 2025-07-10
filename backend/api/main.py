from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

# if os.path.exists('../../.env'):
#     from dotenv import load_dotenv
#     load_dotenv(dotenv_path="../../.env")

from utils import s3_get_presigned_url, s3_list_objects
from database import get_unique_fire_numbers, get_fire_features
from models import FireNumberList, FeatureCollection, Feature, Geometry, FeatureProperties

app = FastAPI(title="Burn Severity API", version="1.0")


# Allow your frontend origin
origins = [
    "http://localhost:8080",    # frontend dev server
    "http://127.0.0.1:8080",    # optional
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/burn-severity", response_model=FireNumberList)
def list_fire_numbers():
    try:
        fire_numbers = get_unique_fire_numbers()
        return {"fire_numbers": fire_numbers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/burn-severity/{fire_number}", response_model=FeatureCollection)
def get_fire_by_number(fire_number: str):
    try:
        df = get_fire_features(fire_number)
        features = []

        for _, row in df.iterrows():
            geometry = json.loads(row.pop("geometry"))
            properties = FeatureProperties(**row.to_dict())
            feature = Feature(geometry=Geometry(**geometry), properties=properties)
            features.append(feature)

        return FeatureCollection(features=features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(
    "/docs/list/{fire_number}",
    summary="get list of documents related to fire_number"
)
async def get_docs(fire_number:str):
    pass

@app.get(
    "/docs/download/{fire_number}"
)
async def download_file(prefix:str):
    """
    Returns a presigned URL for a file in S3-compliant storage.
    Client will make a direct GET request to this URL.
    """

    # get list of s3 objects with the given prefix
    obj_list = s3_list_objects(file_prefix=prefix)
    if not obj_list:
        return HTTPException(status_code=404, detail="No files found for the given prefix.")

    files = [
        # create a dictionary with the object key and its presigned URL
        {
            "key": obj,
            "filename": obj.split("/")[-1],
            "url": s3_get_presigned_url(obj, expiration_seconds=3600)
        }
        for obj in obj_list
    ]

    if not files:
        return HTTPException(status_code=404, detail="No files found for the given prefix.")
    
    return JSONResponse({"files": files})

