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

# Configure S3/MinIO access globally using DuckDB Secrets
ssl_flag = 'false' if S3_SSL == 'false' else 'true'

con.execute(f"""
    CREATE OR REPLACE SECRET storage_secret (
        TYPE S3,
        KEY_ID '{S3_ACCESS_ID}',
        SECRET '{S3_KEY}',
        ENDPOINT '{S3_ENDPOINT}',
        URL_STYLE 'path',
        USE_SSL {ssl_flag}
    );
""")

def check_connection():
    """
    Checks if the object storage connection to the parquet file is working.
    Returns True if the connection is successful, False otherwise.
    """
    cursor = con.cursor()
    try:
        # Perform a quick query to test the connection without fetching all data
        query = f"SELECT count(*) FROM '{PARQUET_PATH}' LIMIT 1"
        cursor.execute(query).fetchone()
        return True
    except Exception as e:
        print(f"Connection failed: {e}")
        return False
    finally:
        cursor.close()

def get_unique_fire_numbers(year:str=None):
    cursor = con.cursor()
    try:
        if year:
            query = f"""
                SELECT DISTINCT FIRE_NUMBER
                FROM '{PARQUET_PATH}' WHERE FIRE_YEAR=?
                ORDER BY FIRE_NUMBER
            """
            return [row[0] for row in cursor.execute(query,[year]).fetchall()]
        else:
            query = f"""
                SELECT DISTINCT FIRE_NUMBER
                FROM '{PARQUET_PATH}'
                ORDER BY FIRE_NUMBER
            """
            return [row[0] for row in cursor.execute(query).fetchall()]
    except Exception as e:
        if "404" in str(e) or "Not Found" in str(e) or "NoSuchKey" in str(e):
            return []
        return None
    finally:
        cursor.close()

def get_fire_features(year: str, fire_number: str):
    cursor = con.cursor()
    query = f"""
        SELECT ST_AsGeoJSON(geometry) AS geometry, *
        FROM '{PARQUET_PATH}'
        WHERE FIRE_YEAR=? and FIRE_NUMBER = ?
    """
    try:
        return cursor.execute(query, [year, fire_number]).fetchdf()
    except Exception as e:
        print(f'Error fetching fire features: {e}')
        return None
    finally:
        cursor.close()


def get_years_with_features():
    cursor = con.cursor()
    try:
        # Added IS NOT NULL to prevent Pydantic validation failures on empty rows
        # Added DESC order so the newest years appear at the top of the dropdown
        query = f"""
            SELECT DISTINCT FIRE_YEAR
            FROM '{PARQUET_PATH}'
            WHERE FIRE_YEAR IS NOT NULL
            ORDER BY FIRE_YEAR DESC
        """
        results = cursor.execute(query).fetchall()
        
        # Explicitly cast to string to guarantee type safety for the frontend
        return [str(row[0]) for row in results]
        
    except Exception as e:
        # Gracefully handle missing files (e.g., brand new deployments)
        if "404" in str(e) or "Not Found" in str(e) or "NoSuchKey" in str(e):
            print(f"Parquet file not found when fetching years: {e}")
            return []
        return []
    finally:
        cursor.close()