# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Assuming your models.py defines FireBurnSeverity
import models
# Assuming your schemas.py defines FireBurnSeverityCreate and FireBurnSeverityResponse
import schemas
from database import get_async_db, create_db_and_tables # Import from database.py

# For Geometry processing (if you accept WKT in your schema)
from geoalchemy2.shape import from_shape
from shapely import wkt # You'll need to install shapely: pip install shapely

app = FastAPI(
    title="Fire Burn Severity API",
    description="API for managing fire burn severity records with geospatial data.",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """
    On application startup, create all database tables if they don't exist.
    """
    await create_db_and_tables()
    print("Database tables checked/created during startup.")

@app.post(
    "/burn-records/",
    response_model=schemas.FireBurnSeverityResponse, # Ensure this schema exists
    status_code=status.HTTP_201_CREATED,
    summary="Create a new burn severity record",
    tags=["Burn Records"]
)
async def create_burn_record(
    record_data: schemas.FireBurnSeverityCreate, # Ensure this schema exists and matches expected input
    db: AsyncSession = Depends(get_async_db)
):
    """
    Creates a new burn severity record in the database.
    Assumes `record_data` (an instance of `schemas.FireBurnSeverityCreate`) has attributes like:
    - `fire_number`
    - `pre_image_date`
    - `post_image_date`
    - `severity_class`
    - `geom_wkt` (a WKT string for the geometry, if applicable)
    """
    # --- Geometry Handling ---
    # If your `schemas.FireBurnSeverityCreate` includes a WKT string for geometry (e.g., `geom_wkt`)
    # you'll need to convert it to a WKBElement for GeoAlchemy2.
    geometry_to_save = None
    if hasattr(record_data, 'geom_wkt') and record_data.geom_wkt:
        try:
            shapely_geom = wkt.loads(record_data.geom_wkt)
            # Convert Shapely geometry to WKBElement, ensure SRID matches your column
            geometry_to_save = from_shape(shapely_geom, srid=4326)
        except Exception as e:
            # Handle invalid WKT string
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid WKT string for geometry: {e}"
            )


    # Correctly instantiate the SQLAlchemy model using attribute names from models.py
    db_record = models.FireBurnSeverity(
        fire_number=record_data.fire_number,         # Use lowercase 'fire_number'
        pre_image_date=record_data.pre_image_date, # Use 'pre_image_date'
        post_image_date=record_data.post_image_date, # Use 'post_image_date'
        severity_class=record_data.severity_class,   # Use 'severity_class'
        geom=geometry_to_save                        # Assign the processed geometry
    )
    db.add(db_record)

    try:
        await db.commit()
        await db.refresh(db_record)
    except Exception as e: # Consider catching more specific SQLAlchemy exceptions (e.g., IntegrityError)
        await db.rollback()
        # Log the error e
        print(f"Database error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while saving the record: {str(e)}"
        )
    return db_record

@app.get(
    "/burn-records/",
    response_model=List[schemas.FireBurnSeverityResponse], # Ensure this schema exists
    summary="Read all burn severity records",
    tags=["Burn Records"]
)
async def read_all_burn_records(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves a list of all burn severity records from the database, with pagination.
    """
    stmt = select(models.FireBurnSeverity).offset(skip).limit(limit)
    result = await db.execute(stmt)
    records = result.scalars().all()
    return records

@app.get(
    "/burn-records/{record_id}",
    response_model=schemas.FireBurnSeverityResponse, # Ensure this schema exists
    summary="Read a specific burn severity record by its ID",
    tags=["Burn Records"]
)
async def read_burn_record_by_id(
    record_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves a specific burn severity record by its unique ID.
    """
    stmt = select(models.FireBurnSeverity).where(models.FireBurnSeverity.id == record_id)
    result = await db.execute(stmt)
    record = result.scalars().first()
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Burn record with ID {record_id} not found."
        )
    return record