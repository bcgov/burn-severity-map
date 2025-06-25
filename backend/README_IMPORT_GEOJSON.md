# GeoJSON Import Script for Burn Severity Database

The import_geojson.py script imports GeoJSON data into the PostgreSQL database for the burn severity application.

## Overview

The script reads a GeoJSON file containing burn severity features and inserts them into the database

## Prerequisites

- PostgreSQL database with PostGIS extension
- Python environment with the following packages:
  - SQLAlchemy
  - asyncpg
  - shapely
  - geoalchemy2

## Usage
### Step 1: add script to the container 
```bash
podman cp burn-severity-map/backend/api/import_geojson.py fastapi-backend:/api/import_geojson.py
```


### Step 2: Copy your GeoJSON file to the container

```bash
podman cp burn-severity-map/backend/K52318_interim_burn_severity_2023.geojson fastapi-backend:/api/K52318_interim_burn_severity_2023.geojsonn
```
#### Optional; check for copied file in container 
```bash
podman exec fastapi-backend ls -la /api
```

### Step 3: Run the import script inside the container

```bash
podman exec -it fastapi-backend uv run python /api/import_geojson.py /api/K52318_interim_burn_severity_2023.geojson
```

## How It Works

1. The script connects to the PostgreSQL database using SQLAlchemy's async engine
2. It loads the GeoJSON file and reads all features
3. For each feature:
   - It extracts properties and geometry
   - Converts the geometry to PostGIS format
   - Maps properties to database columns
   - Inserts the data into the fire_burn_severity table
4. The script handles data transformations such as:
   - Converting "Medium" to "MODERATE" for burn severity ratings
   - Converting "UNBURNED" to "UNBURNT"
   - Validating geometry data

