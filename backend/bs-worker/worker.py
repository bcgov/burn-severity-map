import boto3
from botocore.config import Config
import geopandas
import pandas as pd
import os
import sys
import io
import json
import hashlib


S3_ENDPOINT = os.getenv("S3_ENDPOINT")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# Assert that all required environment variables are set
assert S3_ENDPOINT is not None, "Missing environment variable: S3_ENDPOINT"
assert S3_ACCESS_KEY is not None, "Missing environment variable: S3_ACCESS_KEY"
assert S3_SECRET_KEY is not None, "Missing environment variable: S3_SECRET_KEY"
assert S3_BUCKET_NAME is not None, "Missing environment variable: S3_BUCKET_NAME"

def append_geojson_to_geoparquet_s3(
    bucket_name: str,
    key: str,
    new_geojson_data: dict, # Can be a Feature or a FeatureCollection
    s3_endpoint_url: str = None, # For S3-compatible storage like MinIO, Ceph, etc.
    s3_access_key_id: str = None,
    s3_secret_access_key: str = None,
    s3_session_token: str = None
):
    """
    Appends new GeoJSON data (Feature or FeatureCollection) to an existing
    GeoParquet file in S3-compatible storage.

    Args:
        bucket_name (str): The name of the S3 bucket.
        key (str): The key (path) to the GeoParquet file in the bucket.
        new_geojson_data (dict): The GeoJSON data (FeatureCollection or Feature) to append.
        s3_endpoint_url (str, optional): The endpoint URL for S3-compatible storage.
                                         Defaults to None (uses AWS S3 default).
        S3_ACCESS_KEY_id (str, optional): AWS access key ID.
        aws_secret_access_key (str, optional): AWS secret access key.
        aws_session_token (str, optional): AWS session token.
    """

    s3_client = boto3.client(
        's3',
        endpoint_url=s3_endpoint_url,
        aws_access_key_id=s3_access_key_id,
        aws_secret_access_key=s3_secret_access_key,
    )

    existing_parquet_bytes = None
    existing_gdf = None # Initialize to None

    # 1. Download the existing GeoParquet file
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=key)
        existing_parquet_bytes = response['Body'].read()
        existing_gdf = geopandas.read_parquet(io.BytesIO(existing_parquet_bytes))
        print(f"Downloaded existing GeoParquet file: s3://{bucket_name}/{key}")
    except s3_client.exceptions.NoSuchKey:
        print(f"File s3://{bucket_name}/{key} does not exist. Creating a new one.")
        existing_parquet_bytes = None
    except Exception as e:
        print(f"Error downloading file: {e}")
        return

    # Convert new GeoJSON data to GeoDataFrame
    # If new_geojson_data is a single Feature, wrap it in a FeatureCollection
    if new_geojson_data.get("type") == "Feature":
        features_list = [new_geojson_data]
    elif new_geojson_data.get("type") == "FeatureCollection":
        features_list = new_geojson_data.get("features", [])
    else:
        print("Error: Invalid GeoJSON data. Must be a Feature or FeatureCollection.")
        return
        
    new_gdf = geopandas.GeoDataFrame.from_features(features_list)

    # 2. Append new data to existing data (or create new if no existing file)
    if existing_gdf is not None:
        # Read existing GeoParquet into a GeoDataFrame
        existing_gdf = geopandas.read_parquet(io.BytesIO(existing_parquet_bytes))
        
        # people might export the geojson to 3005
        if existing_gdf.crs and new_gdf.crs and existing_gdf.crs != new_gdf.crs:
            print(f"Warning: CRS mismatch. Existing: {existing_gdf.crs}, New: {new_gdf.crs}")
            print("Attempting to reproject new data to match existing CRS.")
            new_gdf = new_gdf.to_crs(existing_gdf.crs)
        elif existing_gdf.crs is None and new_gdf.crs:
            print("Warning: Existing data has no CRS, new data has one. Assigning new data CRS to combined.")
            # This case might need careful handling depending on expected behavior
            # For now, new_gdf will retain its CRS which will be picked up by to_parquet
        elif existing_gdf.crs and new_gdf.crs is None:
            print("Warning: Existing data has CRS, new data has none. Assigning existing CRS to new data for consistency.")
            new_gdf.crs = existing_gdf.crs

        # Concatenate new data
        combined_gdf = pd.concat([existing_gdf, new_gdf], ignore_index=True)
        print("Appended new GeoJSON data to existing GeoParquet data.")
    else:
        combined_gdf = new_gdf
        print("Creating new GeoParquet data from provided GeoJSON.")

    # 3. Convert combined GeoDataFrame back to Parquet bytes
    output_buffer = io.BytesIO()
    combined_gdf.to_parquet(output_buffer, index=False)
    output_buffer.seek(0)
    hasher = hashlib.sha256()
    hasher.update(output_buffer.getvalue())
    output_buffer.seek(0) # Reset again after reading
    local_sha256 = hasher.hexdigest()
    print(f"Local SHA256 of data to be uploaded: {local_sha256}")
    # 4. Upload the combined (and overwritten) Parquet file back to S3
    try:
        response = s3_client.put_object(
            Bucket=bucket_name,
            Key=key,
            Body=output_buffer,
            ContentType='application/x-parquet',
            ChecksumAlgorithm='SHA256',
            ChecksumSHA256=local_sha256
        )
        print(f"Successfully uploaded updated GeoParquet file to s3://{bucket_name}/{key}")
    except Exception as e:
        print(f"Error uploading file: {e}")

def load_source_data():
    """Lists files in an S3-compliant bucket with an optional prefix."""
    obj_list = []
    bucket_name = S3_BUCKET_NAME
    file_prefix= "burn-severity/source/"
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=S3_ACCESS_KEY,
            aws_secret_access_key=S3_SECRET_KEY,
            endpoint_url=S3_ENDPOINT,
            #config=Config(signature_version='s3v4')
        )

        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix="burn-severity/source/")
        if 'Contents' in response:
            for obj in response['Contents']:

                # only append file that are not directories
                if not obj['Key'].endswith('$') and not obj['Key'].endswith('/') and not obj['Key'].endswith('catalogs') and obj['Key'].endswith('.geojson'):
                    obj_list.append(obj['Key'])

        else:
            print(f"No files found in bucket '{bucket_name}' with prefix '{file_prefix}'.")
    except Exception as e:
        print(f"Error listing files: {e}")
    try:

        for obj in obj_list:
            response = s3_client.get_object(Bucket=bucket_name, Key=obj)
            geojson_bytes = response['Body'].read() # not sure if we need it in chuncks or not
            fc = json.loads(geojson_bytes)
            append_geojson_to_geoparquet_s3(
                bucket_name=S3_BUCKET_NAME,
                key=FILE_KEY,
                new_geojson_data=fc,
                s3_endpoint_url=S3_ENDPOINT,
                s3_access_key_id=S3_ACCESS_KEY,
                s3_secret_access_key=S3_SECRET_KEY
            )
        return FILE_KEY
    except Exception as e:
        print(f"Error loading files: {e}")

if __name__ == "__main__":
    # Configure your S3-compatible storage details
    # For AWS S3, you can omit s3_endpoint_url and rely on environment variables/IAM roles
    # For local MinIO, it might look like:

    #BUCKET = S3_BUCKET_NAME
    FILE_KEY = "burn-severity/bs.parquet"
    
    # geojson = sys.argv[1]


    # future humans might want to load geojson from object storage

    '''
    s3_client_get_geojson = boto3.client(
        's3',
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_ACCESS_KEY
    )
    
    response = s3_client_get_geojson.get_object(Bucket=BUCKET, Key=geojson)
    geojson_bytes = response['Body'].read() # not sure if we need it in chuncks or not
    fc = json.loads(geojson_bytes)
    '''
    
    # # current human just wants to test this with a file system geojson
    # assert os.path.exists(geojson)
    # with open(geojson) as f:
    #     fc = json.load(f)

    # append_geojson_to_geoparquet_s3(
    #     bucket_name=S3_BUCKET_NAME,
    #     key=FILE_KEY,
    #     new_geojson_data=fc,
    #     s3_endpoint_url=S3_ENDPOINT,
    #     s3_access_key_id=S3_ACCESS_KEY,
    #     s3_secret_access_key=S3_SECRET_KEY
    # )
    
    # load all source data to geoparquet
    load_source_data()

