import duckdb
import os

# Optional: Load environment variables for S3 credentials
S3_ENDPOINT = os.getenv("S3_ENDPOINT").replace("https://","").replace(":443","")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

PARQUET_KEY = os.getenv("PARQUET_PATH")
PARQUET_PATH = f's3://{S3_BUCKET_NAME}/{PARQUET_KEY}'

DUCKDB_EXTENSION_PATH = os.getenv("EXTENSION_DIRECTORY","/tmp/duckdb_extensions")
# Initialize DuckDB connection
con = duckdb.connect(database=':memory:')
con.execute(f"SET extension_directory = '{DUCKDB_EXTENSION_PATH}';")
con.execute("INSTALL httpfs; LOAD httpfs;")
con.execute("INSTALL spatial; LOAD spatial;")

# Configure S3 access
con.execute(f"SET s3_access_key_id='{S3_ACCESS_KEY}';")
con.execute(f"SET s3_secret_access_key='{S3_SECRET_KEY}';")
con.execute(f"SET s3_endpoint='{S3_ENDPOINT}';")
con.execute("SET s3_url_style='path';")

def get_unique_fire_numbers():
    query = f"""
        SELECT DISTINCT FIRE_NUMBER
        FROM '{PARQUET_PATH}'
        ORDER BY FIRE_NUMBER
    """
    return [row[0] for row in con.execute(query).fetchall()]

def get_fire_features(fire_number: str):
    query = f"""
        SELECT ST_AsGeoJSON(geometry) AS geometry, *
        FROM '{PARQUET_PATH}'
        WHERE FIRE_NUMBER = ?
    """
    return con.execute(query, [fire_number]).fetchdf()
