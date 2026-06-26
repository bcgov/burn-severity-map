import os
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError, BotoCoreError
import geopandas
import pandas as pd
import hashlib
import io
import json
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


S3_ENDPOINT = os.getenv("S3_ENDPOINT")
S3_ACCESS_ID = os.getenv("S3_ACCESS_ID")
S3_KEY = os.getenv("S3_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")
MAIN_DIR = os.getenv("MAIN_DIR")
PARQUET_FILE = os.getenv("PARQUET_FILE")
PARQUET_PATH = f'{MAIN_DIR}/{PARQUET_FILE}'
S3_SSL = True if os.getenv("S3_USE_SSL", 'true').lower() == 'true' else False

# Assert that all required environment variables are set
assert S3_ENDPOINT is not None, "Missing environment variable: S3_ENDPOINT"
assert S3_ACCESS_ID is not None, "Missing environment variable: S3_ACCESS_ID"
assert S3_KEY is not None, "Missing environment variable: S3_KEY"
assert S3_BUCKET is not None, "Missing environment variable: S3_BUCKET"
assert MAIN_DIR is not None, "Missing environment variable: MAIN_DIR"
assert PARQUET_FILE is not None, "Missing environment variable: PARQUET_FILE"

s3_config = Config(request_checksum_calculation="when_required",
                   response_checksum_validation="when_required",
                   retries={'max_attempts': 5, 'mode': 'standard'})
# establish S3 connection

s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_ACCESS_ID,
    aws_secret_access_key=S3_KEY,
    endpoint_url=S3_ENDPOINT,
    config=s3_config,
    use_ssl=S3_SSL
)

def s3_connected()->bool:
    logger.info(s3_client.list_buckets())
    try:
        s3_client.list_buckets()
        return True
    
    except (BotoCoreError, ClientError) as e:
        print(f"Connection failed: {e}")
        return False


# TODO Update to get all data vs just the keys
def s3_list_objects(bucket_name=S3_BUCKET, file_prefix="")->list:
    """Lists files in an S3-compliant bucket with an optional prefix."""
    obj_list = []
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=f"{MAIN_DIR}/{file_prefix}")
        if 'Contents' in response:
            logger.debug(f"Files in bucket '{bucket_name}' (prefix: '{file_prefix}'):")
            for obj in response['Contents']:
                # logger.info(f"- {obj['Key']} (Size: {obj['Size']} bytes)")

                # only append file that are not directories
                if not obj['Key'].endswith('$') and not obj['Key'].endswith('/') and not obj['Key'].endswith('catalogs'):
                    obj_list.append(obj)

        else:
            logger.warning(f"No files found in bucket '{bucket_name}' with prefix '{file_prefix}'.")
        return obj_list
    except Exception as e:
        logger.error(f"Error listing files: {e}")


def s3_get_presigned_url(obj, expiration_seconds=3600):

    """
        Generates a presigned URL to retrieve an S3 object.

        :param object_key: The S3 object key (path to the file).
        :param expiration_seconds: The number of seconds the URL is valid for.
        :return: The presigned URL, or None if an error occurs.
        """
    try:
        response = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': S3_BUCKET, 'Key': obj},
            ExpiresIn=expiration_seconds
        )
        return response
    except ClientError as e:
        logger.error(f"ClientError generating presigned URL for {obj}: {e}")
        return f"ClientError generating presigned URL for {obj}: {e}"
    except Exception as e:
        logger.error(f"Error generating presigned URL for {obj}: {e}")
        return f"Error generating presigned URL for {obj}: {e}"
    

def format_file_size(size: float):
    factor = 1024
    suffixes = ['B', 'KB', 'MB', 'GB', 'TB']

    for suffix in suffixes:
        if size < factor:
            return f'{size:.2f} {suffix}'
        size /= factor
    return f'{size:.2f} {suffixes[-1]}'


def append_geojson_to_geoparquet_s3(
    new_geojson_s3_obj_key: str, # Can be a Feature or a FeatureCollection
    geoparquet_key: str = PARQUET_PATH
):
    """
    Appends new GeoJSON data (Feature or FeatureCollection) to an existing
    GeoParquet file in S3-compatible storage.

    Args:
        new_geojson_data (dict): The GeoJSON data (FeatureCollection or Feature) to append.
    """


    existing_parquet_bytes = None
    existing_gdf = None # Initialize to None

    # Download the existing GeoParquet file
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=geoparquet_key)
        existing_parquet_bytes = response['Body'].read()
        existing_gdf = geopandas.read_parquet(io.BytesIO(existing_parquet_bytes))
        logger.debug(f"Downloaded existing GeoParquet file: s3://{S3_BUCKET}/{geoparquet_key}")
    except s3_client.exceptions.NoSuchKey:
        logger.warning(f"File s3://{S3_BUCKET}/{geoparquet_key} does not exist. Creating a new one.")
        existing_parquet_bytes = None
    except Exception as e:
        logger.error(f"Error downloading GeoParquet {geoparquet_key}: {e}")
        return False

    # Download geojson to convert to object
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=new_geojson_s3_obj_key)
        geojson_bytes = response['Body'].read() # not sure if we need it in chuncks or not
        new_geojson_data = json.loads(geojson_bytes)
    except Exception as e:
        logger.error(f"Error reading S3 geojson {new_geojson_s3_obj_key}: {e}")
        return False
    # Convert new GeoJSON data to GeoDataFrame
    # If new_geojson_data is a single Feature, wrap it in a FeatureCollection
    if new_geojson_data.get("type") == "Feature":
        features_list = [new_geojson_data]
    elif new_geojson_data.get("type") == "FeatureCollection":
        features_list = new_geojson_data.get("features", [])
    else:
        logger.error("Error: Invalid GeoJSON data. Must be a Feature or FeatureCollection.")
        return False
        
    new_gdf = geopandas.GeoDataFrame.from_features(features_list)

    # Append new data to existing data (or create new if no existing file)
    if existing_gdf is not None:        
        # people might export the geojson to 3005
        if existing_gdf.crs and new_gdf.crs and existing_gdf.crs != new_gdf.crs:
            logger.warning(f"Warning: CRS mismatch. Existing: {existing_gdf.crs}, New: {new_gdf.crs}")
            logger.debug("Attempting to reproject new data to match existing CRS.")
            new_gdf = new_gdf.to_crs(existing_gdf.crs)
        elif existing_gdf.crs is None and new_gdf.crs:
            logger.warning("Warning: Existing data has no CRS, new data has one. Assigning new data CRS to combined.")

            # For now, new_gdf will retain its CRS which will be picked up by to_parquet
        elif existing_gdf.crs and new_gdf.crs is None:
            logger.warning("Warning: Existing data has CRS, new data has none. Assigning existing CRS to new data for consistency.")
            new_gdf.crs = existing_gdf.crs

        # Concatenate new data
        combined_gdf = pd.concat([existing_gdf, new_gdf], ignore_index=True)
        logger.debug("Appended new GeoJSON data to existing GeoParquet data.")
    else:
        combined_gdf = new_gdf
        logger.debug("Creating new GeoParquet data from provided GeoJSON.")

    # 3. Convert combined GeoDataFrame back to Parquet bytes
    output_buffer = io.BytesIO()
    combined_gdf.to_parquet(output_buffer, index=False)
    output_buffer.seek(0)
    hasher = hashlib.sha256()
    hasher.update(output_buffer.getvalue())
    output_buffer.seek(0) # Reset again after reading
    local_sha256 = hasher.hexdigest()
    logger.debug(f"Local SHA256 of data to be uploaded: {local_sha256}")
    # 4. Upload the combined (and overwritten) Parquet file back to S3
    try:
        response = s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=geoparquet_key,
            Body=output_buffer,
            ContentType='application/x-parquet',
            # ChecksumAlgorithm='SHA256',
            # ChecksumSHA256=local_sha256
        )
        logger.info(f"Successfully uploaded updated GeoParquet file to s3://{S3_BUCKET}/{geoparquet_key}")
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        return False

def geoparquet_on_s3(geoparquet_key: str=PARQUET_PATH):
    # checks if the burn severity geoparquet exiss
    obj_list = s3_list_objects()
    parquet_files = [doc for doc in obj_list if doc.endswith('.parquet')]
    if PARQUET_PATH in parquet_files:
        return True
    else:
        return False