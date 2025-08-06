# 🔥Burn Severity Analysis Tool (BARC)

This project, **BARC (Burned Area Reflectance Classification) Analysis**, is a Python-based tool for calculating burn severity using Sentinel or Landsat imagery. It analyzes satellite data to assess the impact of fires on the landscape.

## Description

The `barc_analysis.py` script is the core of this project. It takes a fire number, year, and sensor type as input to identify and analyze the affected area. The script fetches fire perimeter data from WFS (Web Feature Service) and satellite imagery from a STAC (SpatioTemporal Asset Catalog) API. It then calculates the Normalized Burn Ratio (NBR) and the difference in NBR (dNBR) between pre- and post-fire images to determine burn severity. The final output is a classified burn severity map in various formats, including GeoJSON and Shapefile, which can be saved locally or to an object storage service.

## Technologies
* rasterio
* geopandas
* STAC and Cloud Optimized GeoTif (COG)
* WFS

## 📂 Outputs
Depending on the configuration, the tool generates:

* RGB mosaics (.jpg)
* NBR and dNBR rasters (.tif)
* Scaled dNBR and BARC rasters (.tif)
* Filtered BARC raster (.tif)
* GeoJSON and Shapefile vector outputs
* File Geodatabase (.gdb) with burn severity polygons

## 🧠 Features
* FAutomatically fetches fire perimeters and points from WFS services
* FDynamically adjusts date ranges based on fire ignition and extinguishment
* Filters imagery based on cloud cover
* FAligns pre- and post-fire imagery for accurate dNBR calculation
* FClassifies burn severity into categories: Unburned, Low, Medium, High
* FSupports both local and cloud-based storage

## 🛠️ Developement Notes

* Logging is handled via a custom Environment.setup_logger() method
* Raster writing uses Cloud Optimized GeoTIFF (COG) profiles
* Vector simplification uses topojson for efficient geometry handling

## Installation

To run this project install the dependencies using uv

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bcgov/burn-severity-map
    cd burn-severity-map
    ```

2.  **Install the required packages using uv :**
    ```bash
    cd analysis
    uv sync
    ```

    Alternatively, if you are using `uv`, you can install the dependencies from the `pyproject.toml` and `uv.lock` files.

## 🚀Usage

You can run the analysis from the command line, providing the fire number, year, and sensor as arguments.

### Command-Line Arguments

* `fire`: The fire number (e.g., C12345).
* `year`: The year of the fire.
* `sensor`: The satellite sensor to use ('S2' for Sentinel-2 or 'L8' for Landsat 8).
* `-f`, `--output_folder`: (Optional) The local folder to save the output files.
* `-o`, `--object_storage`: (Optional) A flag to indicate that the output should be written to object storage.
* `-s`, `--s_date`: (Optional) The start date for the fire in 'YYYY-MM-DD' format.
* `-e`, `--e_date`: (Optional) The end date for the fire in 'YYYY-MM-DD' format.
* `-c`, `--cloud`: (Optional) The maximum cloud cover percentage (default is 10).
* `--log_level`: (Optional) The logging level (DEBUG, INFO, WARNING, ERROR).
* `--log_dir`: (Optional) The directory to save log files.

### Example

```bash
python barc_analysis.py C12345 2023 S2 -f /path/to/output -o
