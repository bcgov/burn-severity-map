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
from geoalchemy2.shape import from_shape, to_shape
from shapely.geometry import shape, mapping

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
    "/burn-severity/",
    response_model=schemas.FireBurnSeverityResponse, # Ensure this schema exists
    status_code=status.HTTP_201_CREATED,
    summary="Create a new burn severity record",
    tags=["Burn Records"]
)
async def create_burn_severity_record(
    record_data: schemas.FireBurnSeverityCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Creates a new burn severity record in the database from a GeoJSON FeatureCollection.
    Geometry is required for each feature.
    """
    if not record_data.features:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="FeatureCollection must contain at least one feature."
        )
    print (record_data.features[0])
    first_feature = record_data.features[0] # Assuming processing the first feature

    # --- Geometry Handling ---
    geometry_to_save = None
    if first_feature.geometry:
        try:
            # Convert the geojson_pydantic Polygon object to a Shapely geometry
            shapely_geom = shape(first_feature.geometry)
            
            # This stores the geometry in a projected CRS, so area/length will be in meters
            geometry_to_save = from_shape(shapely_geom, srid=4326)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid GeoJSON geometry in feature: {e}"
            )
    else:
        # If geometry is required but not provided in the input feature
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geometry is a required field for each feature."
        )

    # --- Properties Handling ---
    feature_props = first_feature.properties

    # IMPORTANT: Removed FEATURE_AREA_SQM and FEATURE_LENGTH_M from db_record instantiation
    # as they are not defined as columns in models.py
    db_record = models.FireBurnSeverity(
        FIRE_NUMBER=feature_props.FIRE_NUMBER,
        FIRE_YEAR=feature_props.FIRE_YEAR,
        PRE_FIRE_IMAGE=feature_props.PRE_FIRE_IMAGE,
        PRE_FIRE_IMAGE_DATE=feature_props.PRE_FIRE_IMAGE_DATE,
        POST_FIRE_IMAGE=feature_props.POST_FIRE_IMAGE,
        POST_FIRE_IMAGE_DATE=feature_props.POST_FIRE_IMAGE_DATE,
        COMMENTS=feature_props.COMMENTS,
        FIRE_STATUS=feature_props.FIRE_STATUS,
        BURN_SEVERITY_RATING=feature_props.BURN_SEVERITY_RATING,
        AREA_HA=feature_props.AREA_HA,
        geometry=geometry_to_save
    )
    
    db.add(db_record)

    try:
        await db.commit()
        await db.refresh(db_record)
    except Exception as e:
        await db.rollback()
        print(f"Database error during record creation: {e}") 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while saving the record: {str(e)}"
        )
    
    # --- Construct the response according to schemas.FireBurnSeverityResponse ---
    # 1. Convert WKBElement geometry from db_record back to Shapely geometry
    shapely_geom_out = to_shape(db_record.geometry)
    # 2. Convert Shapely geometry to GeoJSON dict
    geojson_geometry_out = mapping(shapely_geom_out)

    # 3. Calculate FEATURE_AREA_SQM and FEATURE_LENGTH_M from the Shapely geometry
    calculated_area_sq_m = shapely_geom_out.area
    calculated_length_m = shapely_geom_out.length

    # 4. Create BurnSeverityProps instance from db_record and calculated values
    response_props = schemas.BurnSeverityProps(
        FIRE_NUMBER=db_record.FIRE_NUMBER,
        FIRE_YEAR=db_record.FIRE_YEAR,
        PRE_FIRE_IMAGE=db_record.PRE_FIRE_IMAGE,
        PRE_FIRE_IMAGE_DATE=db_record.PRE_FIRE_IMAGE_DATE,
        POST_FIRE_IMAGE=db_record.POST_FIRE_IMAGE,
        POST_FIRE_IMAGE_DATE=db_record.POST_FIRE_IMAGE_DATE,
        COMMENTS=db_record.COMMENTS,
        FIRE_STATUS=db_record.FIRE_STATUS,
        BURN_SEVERITY_RATING=db_record.BURN_SEVERITY_RATING,
        AREA_HA=db_record.AREA_HA,
        FEATURE_AREA_SQM=calculated_area_sq_m, # Calculated here
        FEATURE_LENGTH_M=calculated_length_m,   # Calculated here
    )

    # 5. Create FireBurnSeverityFeature instance
    fire_feature_response = schemas.FireBurnSeverityFeature(
        type="Feature",
        geometry=geojson_geometry_out,
        properties=response_props
    )

    # 6. Create FireBurnSeverityResponse instance (FeatureCollection)
    # Use the CRS from the incoming request data
    final_response = schemas.FireBurnSeverityResponse(
        type="FeatureCollection",
        crs=record_data.crs, # Use the CRS from the input request
        features=[fire_feature_response]
    )

    return final_response # Return the structured response

@app.get(
    "/burn-severity/",
    response_model=List[schemas.FireBurnSeverityResponse], # Ensure this schema exists
    summary="Read all burn severity records",
    tags=["Burn severity"]
)
async def read_burn_severity(
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

    # Transform each db_record into FireBurnSeverityResponse format
    response_list = []
    # Define a default CRS for retrieved data if not stored in the database
    # Assuming EPSG:3005 as it's used for storage
    dummy_crs = schemas.CRS(type="name", properties=schemas.CRSProperties(name="urn:ogc:def:crs:EPSG::4326"))

    for record in records:
        # Convert WKBElement geometry from db_record back to Shapely geometry
        shapely_geom_out = to_shape(record.geometry)
        # Convert Shapely geometry to GeoJSON dict
        geojson_geometry_out = mapping(shapely_geom_out)

        # Calculate FEATURE_AREA_SQM and FEATURE_LENGTH_M
        calculated_area_sq_m = shapely_geom_out.area
        calculated_length_m = shapely_geom_out.length

        response_props = schemas.BurnSeverityProps(
            FIRE_NUMBER=record.FIRE_NUMBER,
            FIRE_YEAR=record.FIRE_YEAR,
            PRE_FIRE_IMAGE=record.PRE_FIRE_IMAGE,
            PRE_FIRE_IMAGE_DATE=record.PRE_FIRE_IMAGE_DATE,
            POST_FIRE_IMAGE=record.POST_FIRE_IMAGE,
            POST_FIRE_IMAGE_DATE=record.POST_FIRE_IMAGE_DATE,
            COMMENTS=record.COMMENTS,
            FIRE_STATUS=record.FIRE_STATUS,
            BURN_SEVERITY_RATING=record.BURN_SEVERITY_RATING,
            AREA_HA=record.AREA_HA,
            FEATURE_AREA_SQM=calculated_area_sq_m,
            FEATURE_LENGTH_M=calculated_length_m,
        )

        fire_feature_response = schemas.FireBurnSeverityFeature(
            type="Feature",
            geometry=geojson_geometry_out,
            properties=response_props
        )
        
        response_list.append(schemas.FireBurnSeverityResponse(
            type="FeatureCollection",
            crs=dummy_crs, # Use the predefined dummy CRS
            features=[fire_feature_response]
        ))
    return response_list


@app.get(
    "/burn-severity/{fire_number}",
    response_model=schemas.FireBurnSeverityResponse, # Ensure this schema exists
    summary="Read burn severity Fire Number",
    tags=["Burn severity"]
)
async def read_burn_severity_by_fire(
    fire_number: str,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves a specific burn severity record by its unique ID.
    """
    stmt = select(models.FireBurnSeverity).where(models.FireBurnSeverity.FIRE_NUMBER == fire_number)
    result = await db.execute(stmt)
    record = result.scalars().first()
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Burn record with ID {fire_number} not found."
        )
    
    # --- Transform the single db_record into schemas.FireBurnSeverityResponse ---
    # 1. Convert WKBElement geometry from db_record back to Shapely geometry
    shapely_geom_out = to_shape(record.geometry)
    # 2. Convert Shapely geometry to GeoJSON dict
    geojson_geometry_out = mapping(shapely_geom_out)

    # 3. Calculate FEATURE_AREA_SQM and FEATURE_LENGTH_M
    calculated_area_sq_m = shapely_geom_out.area
    calculated_length_m = shapely_geom_out.length

    # 4. Create BurnSeverityProps instance from db_record and calculated values
    response_props = schemas.BurnSeverityProps(
        FIRE_NUMBER=record.FIRE_NUMBER,
        FIRE_YEAR=record.FIRE_YEAR,
        PRE_FIRE_IMAGE=record.PRE_FIRE_IMAGE,
        PRE_FIRE_IMAGE_DATE=record.PRE_FIRE_IMAGE_DATE,
        POST_FIRE_IMAGE=record.POST_FIRE_IMAGE,
        POST_FIRE_IMAGE_DATE=record.POST_FIRE_IMAGE_DATE,
        COMMENTS=record.COMMENTS,
        FIRE_STATUS=record.FIRE_STATUS,
        BURN_SEVERITY_RATING=record.BURN_SEVERITY_RATING,
        AREA_HA=record.AREA_HA,
        FEATURE_AREA_SQM=calculated_area_sq_m,
        FEATURE_LENGTH_M=calculated_length_m,
    )

    # 5. Create FireBurnSeverityFeature instance
    fire_feature_response = schemas.FireBurnSeverityFeature(
        type="Feature",
        geometry=geojson_geometry_out,
        properties=response_props
    )

    # 6. Create FireBurnSeverityResponse instance (FeatureCollection)
    # Use the predefined dummy CRS for consistency
    dummy_crs = schemas.CRS(type="name", properties=schemas.CRSProperties(name="urn:ogc:def:crs:EPSG::3005"))

    final_response = schemas.FireBurnSeverityResponse(
        type="FeatureCollection",
        crs=dummy_crs, # Use the predefined dummy CRS
        features=[fire_feature_response]
    )

    return final_response # Return the structured response