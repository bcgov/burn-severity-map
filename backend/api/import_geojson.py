"""
Import GeoJSON data into the PostgreSQL database.
This script reads a GeoJSON file and inserts all features into the database.
"""

import os
import json
import asyncio
from sqlalchemy import text, insert
from sqlalchemy.ext.asyncio import create_async_engine
from models import FireBurnSeverity
from database import Base
from shapely.geometry import shape
from geoalchemy2.shape import from_shape


POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'admin')
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'postgres')
POSTGRES_PORT = os.getenv('POSTGRES_PORT', '5432')
POSTGRES_DB = os.getenv('POSTGRES_DATABASE', 'postgres')

DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
print(f"Connecting to database: {DATABASE_URL}")

# Create the SQLAlchemy asynchronous engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,  
)

async def import_geojson(file_path):
    """
    Import GeoJSON data into the database.
    
    Args:
        file_path: Path to the GeoJSON file
    """
    
    with open(file_path, 'r') as f:
        geojson_data = json.load(f)
    
    features = geojson_data.get('features', [])
    print(f"Found {len(features)} features in the GeoJSON file")
    
   
    async with async_engine.begin() as conn:
        result = await conn.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'fire_burn_severity')"))
        table_exists = result.scalar()
        
        if not table_exists:
            print("Table 'fire_burn_severity' does not exist. Creating table...")
            await conn.run_sync(Base.metadata.create_all)
        
        for feature in features:
            properties = feature.get('properties', {})
            geometry = feature.get('geometry', {})
            
            if not geometry or not properties:
                print("Skipping feature with no geometry or properties")
                continue
                
            try:
                shapely_geom = shape(geometry)
                
                burn_severity_rating = properties.get('BURN_SEVERITY_RATING', '').upper()
                if burn_severity_rating == 'MEDIUM':
                    burn_severity_rating = 'MODERATE'
                
                if burn_severity_rating not in ('UNBURNT', 'LOW', 'MODERATE', 'HIGH'):
                    if burn_severity_rating == 'UNBURNED':
                        burn_severity_rating = 'UNBURNT'
                    else:
                        print(f"Warning: Invalid burn severity rating '{burn_severity_rating}', defaulting to 'LOW'")
                        burn_severity_rating = 'LOW'
                
                insert_data = {
                    "FIRE_NUMBER": properties.get('FIRE_NUMBER', ''),
                    "FIRE_YEAR": properties.get('FIRE_YEAR'),
                    "PRE_FIRE_IMAGE": properties.get('PRE_FIRE_IMAGE', ''),
                    "PRE_FIRE_IMAGE_DATE": properties.get('PRE_FIRE_IMAGE_DATE'),
                    "POST_FIRE_IMAGE": properties.get('POST_FIRE_IMAGE', ''),
                    "POST_FIRE_IMAGE_DATE": properties.get('POST_FIRE_IMAGE_DATE'),
                    "COMMENTS": properties.get('COMMENTS', ''),
                    "FIRE_STATUS": properties.get('FIRE_STATUS', ''),
                    "BURN_SEVERITY_RATING": burn_severity_rating,
                    "AREA_HA": properties.get('AREA_HA'),
                    "geometry": from_shape(shapely_geom, srid=4326)
                }
                
                await conn.execute(insert(FireBurnSeverity).values(**insert_data))
                print(f"Inserted feature with FIRE_NUMBER: {insert_data['FIRE_NUMBER']}, BURN_SEVERITY_RATING: {insert_data['BURN_SEVERITY_RATING']}")
            
            except Exception as e:
                print(f"Error inserting feature: {e}")
                continue
    
    print("Import completed!")

async def main():
    """
    Main function to run the import process.
    """
    import sys
    
    # Check if file path is provided as command-line argument
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        # Default path to the GeoJSON file
        file_path = "/api/K52318_interim_burn_severity_2023.geojson"
    
    print(f"Importing GeoJSON from: {file_path}")
    # Import the data
    await import_geojson(file_path)

if __name__ == "__main__":
    asyncio.run(main())
