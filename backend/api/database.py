import duckdb
import os

# Optional: Load environment variables for S3 credentials
S3_ENDPOINT = os.getenv("S3_ENDPOINT").replace("https://","").replace(":443","").replace("http://","")
S3_ACCESS_ID = os.getenv("S3_ACCESS_ID")
S3_KEY = os.getenv("S3_KEY")
S3_BUCKET = os.getenv("S3_BUCKET")
MAIN_DIR = os.getenv("MAIN_DIR")
S3_SSL = os.getenv("S3_USE_SSL", "true").lower()

PARQUET_FILE = os.getenv("PARQUET_FILE")
PARQUET_PATH = f's3://{S3_BUCKET}/{MAIN_DIR}/{PARQUET_FILE}'

DUCKDB_EXTENSION_PATH = os.getenv("EXT_DIR","/tmp/duckdb_extensions")
os.makedirs(DUCKDB_EXTENSION_PATH, exist_ok=True)

# Initialize DuckDB connection
con = duckdb.connect(database=':memory:')
con.execute(f"SET extension_directory = '{DUCKDB_EXTENSION_PATH}';")
con.execute("INSTALL httpfs; LOAD httpfs;")
con.execute("INSTALL spatial; LOAD spatial;")

# Configure S3 access
con.execute(f"SET s3_access_key_id='{S3_ACCESS_ID}';")
con.execute(f"SET s3_secret_access_key='{S3_KEY}';")
con.execute(f"SET s3_endpoint='{S3_ENDPOINT}';")
con.execute("SET s3_url_style='path';")
if S3_SSL == 'false':
    con.execute('SET s3_use_ssl=false;')
else:
    con.execute('SET s3_use_ssl=true;')

def check_connection():
    """
    Checks if the object storage connection to the parquet file is working.
    Returns True if the connection is successful, False otherwise.
    """
    try:
        # Perform a quick query to test the connection without fetching all data
        query = f"SELECT count(*) FROM '{PARQUET_PATH}' LIMIT 1"
        con.execute(query).fetchone()
        return True
    except duckdb.duckdb.InvalidInputException as e:
        print(f"Connection failed: {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return False

def get_unique_fire_numbers(year:str=None):
    try:
        if year:
            query = f"""
                SELECT DISTINCT FIRE_NUMBER
                FROM '{PARQUET_PATH}' WHERE FIRE_YEAR=?
                ORDER BY FIRE_NUMBER
            """
            return [row[0] for row in con.execute(query,[year]).fetchall()]
        else:
            query = f"""
                SELECT DISTINCT FIRE_NUMBER
                FROM '{PARQUET_PATH}'
                ORDER BY FIRE_NUMBER
            """
            return [row[0] for row in con.execute(query).fetchall()]
    except Exception as e:
        if "404" in str(e) or "Not Found" in str(e):
            return []

def get_fire_features(year: str, fire_number: str):
    query = f"""
        SELECT ST_AsGeoJSON(geometry) AS geometry, *
        FROM '{PARQUET_PATH}'
        WHERE FIRE_YEAR=? and FIRE_NUMBER = ?
    """
    return con.execute(query, [year, fire_number]).fetchdf()

def get_years_with_features():
    query = f"""
        SELECT DISTINCT FIRE_YEAR
        FROM '{PARQUET_PATH}'
        ORDER BY FIRE_YEAR
    """
    return [row[0] for row in con.execute(query).fetchall()]