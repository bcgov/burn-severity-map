from pystac_client import Client
from rasterio.session import AWSSession
from rasterio.warp import reproject, Resampling, calculate_default_transform
from rasterio.io import MemoryFile
from rasterio import mask
import geopandas as gpd
import numpy as np
import rasterio

class STAC:
    s2_url = 'https://earth-search.aws.element84.com/v1'
    l8_url = ''
    l9_url = ''

    s2_collection_id = 'sentinel-2-l2a'
    l8_collection_id = ''
    l9_collection_id = ''

    def __init__(self):
        pass



    # --- Helper function to search STAC API for Sentinel-2 scenes ---
    def search_stac(self, sensor: str, 
                    bbox: list, 
                    daterange: str, 
                    cloud_cover_threshold: float):

        if sensor == 'S2':
            stac_api_url = STAC.s2_url
            collection_id = STAC.s2_collection_id


        try:
            client = Client.open(stac_api_url)
            search = client.search(
                collections=[collection_id],
                bbox=bbox,
                datetime=daterange,
                query={'eo:cloud_cover': {'lt': cloud_cover_threshold}},
                sortby=[
                    {'field': 'properties.eo:cloud_cover', 'direction': 'asc'}, # Least cloudy first
                    {'field': 'properties.datetime', 'direction': 'desc'}      # Most recent within criteria
                ],
                max_items=10 # Fetch a few items to check for availability
            )
            items = list(search.items())
            if not items:
                self.logger.warning(f'No suitable Sentinel-2 scenes found for date range {daterange}, bbox {bbox}, '
                      f'and cloud cover < {cloud_cover_threshold}% in collection {collection_id}.')
                return None

            # Select the first valid item (already sorted by preference)
            # We could add more checks here if needed (e.g., data coverage)
            return items[0]
        except Exception as e:
            self.logger.error(f'Error during STAC search ({stac_api_url}): {e}')
            return None
        

    def calculate_nbr_for_item(self, item: 'pystac.Item', 
                               perimeter_gdf: gpd.GeoDataFrame, 
                               target_transform=None, 
                               target_crs=None, 
                               target_shape=None,
                               aws_requester_pays: bool = False,
                               run_type: str='pre'):
        """
        Calculates Normalized Burn Ratio (NBR) for a given STAC item, clipped to the perimeter.
        Aligns to target_transform, target_crs, and target_shape if provided.

        Args:
            item (pystac.Item): STAC item for the Sentinel-2 scene.
            perimeter_gdf (geopandas.GeoDataFrame): GeoDataFrame of the fire perimeter.
            target_transform (affine.Affine, optional): Target transform for alignment.
            target_crs (rasterio.crs.CRS, optional): Target CRS for alignment.
            target_shape (tuple, optional): Target shape (bands, height, width) for alignment.
            aws_requester_pays (bool): Set to True if accessing requester-pays S3 buckets.

        Returns:
            tuple: (nbr_array, meta, transform) or (None, None, None) if an error occurs.
                   nbr_array is a NumPy array (1, height, width).
                   meta is the raster metadata dictionary.
                   transform is the affine transform of the NBR array.
        """
        nir_asset_key = None
        swir_asset_key = None

        # Determine asset keys for NIR (B8) and SWIR (B12)
        # Common keys for Sentinel-2 L2A:
        # Element84 STAC: 'nir', 'swir22'
        # Microsoft Planetary Computer STAC: 'B08', 'B12'
        if 'nir' in item.assets and 'swir22' in item.assets:
            nir_asset_key = 'nir'
            swir_asset_key = 'swir22'
        elif 'B08' in item.assets and 'B12' in item.assets:
            nir_asset_key = 'B08'
            swir_asset_key = 'B12'
        else:
            available_keys = list(item.assets.keys())
            self.logger.info(f'Error: Could not find required NIR (B8) or SWIR (B12) band assets in STAC item \'{item.id}\'.')
            self.logger.info(f'Available asset keys: {available_keys}')
            # Try to find common alternatives if specific keys are missing
            if 'rededge1' in available_keys and 'swir16' in available_keys : # B5 and B11 (less common for NBR)
                 self.logger.info('Found \'rededge1\' and \'swir16\'. Note: NBR typically uses B8 (NIR) and B12 (SWIR2.2).')
            return None, None, None

        nir_href = item.assets[nir_asset_key].href
        swir_href = item.assets[swir_asset_key].href
        self.logger.info(f'Using NIR asset: \'{nir_asset_key}\' ({nir_href})')
        self.logger.info(f'Using SWIR asset: \'{swir_asset_key}\' ({swir_href})')

        # Use rasterio's AWS session for S3-hosted COGs
        aws_session = AWSSession(requester_pays=aws_requester_pays)
        env_settings = rasterio.Env(session=aws_session, GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tif')


        with env_settings:
            try:
                # Open NIR band to get its CRS for reprojecting the perimeter
                with rasterio.open(nir_href) as src_nir_meta_check:
                    raster_crs = src_nir_meta_check.crs
                    if not raster_crs:
                        self.logger.error(f'Error: NIR COG {nir_href} has no CRS defined.')
                        return None, None, None
                    # Ensure perimeter_gdf has a CRS, if not, assume WGS84
                    if perimeter_gdf.crs is None:
                        self.logger.warning('Perimeter GeoJSON has no CRS. Assuming EPSG:4326 (WGS84).')
                        perimeter_gdf_proj = perimeter_gdf.set_crs("EPSG:4326", allow_override=True).to_crs(raster_crs)
                    else:
                        perimeter_gdf_proj = perimeter_gdf.to_crs(raster_crs)

                clip_geom = [geom.__geo_interface__ for geom in perimeter_gdf_proj.geometry]

                with rasterio.open(nir_href) as src:
                    nir_data, nir_transform = mask.mask(src, clip_geom, crop=True, nodata=0) # S2 L2A fill is 0
                    # Scale factor for Sentinel-2 L2A surface reflectance (0-10000 to 0-1.0)
                    # Handle potential nodata values (often 0 for S2 L2A before scaling)
                    nir_data = nir_data.astype(np.float32)
                    nodata_mask_nir = (nir_data == src.nodata) | (nir_data == 0) # Consider 0 as nodata for S2 L2A before scaling
                    nir_data /= 10000.0
                    nir_data[nodata_mask_nir] = np.nan # Set actual nodata to NaN after scaling
                    meta = src.meta.copy()

                # # Read SWIR band, clipped
                # swir_align = os.path.join(self.output_folder, f'{self.fire_number}_{run_type}_swir_align.tif')

                swir_align = STAC.resample_raster_to_match(source_path=swir_href, reference_path=nir_href)
                with swir_align.open(driver='GTiff') as src:
                    
                    swir_data, swir_transform = mask.mask(src, clip_geom, crop=True, nodata=0)
                    swir_data = swir_data.astype(np.float32)
                    nodata_mask_swir = (swir_data == src.nodata) | (swir_data == 0)
                    swir_data /= 10000.0
                    swir_data[nodata_mask_swir] = np.nan
                del swir_align
            except Exception as e:
                self.logger.error(f'Error reading or clipping COG data for item {item.id}: {e}')
                return None, None, None

        # Ensure arrays have the same shape after clipping.
        # This should hold if bands are from the same S2 tile and clipped identically.
        if nir_data.shape != swir_data.shape:
            self.logger.warning(f'Warning: NIR ({nir_data.shape}) and SWIR ({swir_data.shape}) from item {item.id} '
                  'have different shapes after clipping. This may indicate an issue with data alignment '
                  'or perimeter intersection. Attempting to proceed but dNBR results may be affected.')
            # This could be a point of failure or inaccurate results.
            # A more robust solution might involve aligning them to a common grid here,
            # but the target_transform logic below should handle it if this is the 'post' image.

        current_meta_crs = meta['crs'] # CRS from the opened NIR COG
        current_transform = nir_transform # Transform from the clipped NIR data

        # If target_transform, target_crs, and target_shape are provided (e.g., from pre-fire NBR),
        # resample (reproject) the current bands to match that target grid.
        if target_transform is not None and target_crs is not None and target_shape is not None:
            self.logger.info(f'Aligning item {item.id} to target grid: CRS={target_crs}, Shape={target_shape}')

            aligned_nir_data = np.empty(target_shape, dtype=np.float32)
            reproject(
                source=nir_data,
                destination=aligned_nir_data,
                src_transform=current_transform,
                src_crs=current_meta_crs,
                dst_transform=target_transform,
                dst_crs=target_crs,
                resampling=Resampling.bilinear,
                dst_nodata=np.nan # Use NaN for areas outside source extent during reprojection
            )
            nir_data = aligned_nir_data

            aligned_swir_data = np.empty(target_shape, dtype=np.float32)
            reproject(
                source=swir_data, # SWIR data using its own transform before alignment
                destination=aligned_swir_data,
                src_transform=swir_transform, # Use SWIR's original transform
                src_crs=current_meta_crs,    # Assume SWIR has same CRS as NIR from same S2 scene
                dst_transform=target_transform,
                dst_crs=target_crs,
                resampling=Resampling.bilinear,
                dst_nodata=np.nan
            )
            swir_data = aligned_swir_data

            # Update meta and transform to reflect the target alignment
            final_transform = target_transform
            meta.update({
                "crs": target_crs,
                "transform": target_transform,
                "width": target_shape[2], # target_shape is (bands, height, width)
                "height": target_shape[1],
                "nodata": np.nan # Ensure nodata is consistently NaN
            })
        else:
            # This is the first NBR being calculated (e.g., pre-fire).
            # Its transform, CRS, and shape will become the target for subsequent NBRs.
            final_transform = current_transform
            meta.update({
                "transform": final_transform,
                "width": nir_data.shape[2],
                "height": nir_data.shape[1],
                "nodata": np.nan # Ensure nodata is consistently NaN
            })

        # Calculate NBR = (NIR - SWIR) / (NIR + SWIR)      
        numerator = nir_data - swir_data
        denominator = nir_data + swir_data

        nbr = np.full(nir_data.shape, np.nan, dtype=np.float32) # Initialize with NaNs

        # Valid mask: denominator is not zero, and neither numerator nor denominator is NaN
        valid_mask = (denominator != 0) & ~np.isnan(denominator) & ~np.isnan(numerator)
        nbr[valid_mask] = numerator[valid_mask] / denominator[valid_mask]

        nbr = np.clip(nbr, -1.0, 1.0) # NBR values are theoretically between -1 and 1
        # nbr = np.where(~shp_mask, nbr, -9999)

        # Update meta for single-band NBR output
        meta.update({
            "driver": "GTiff",
            "dtype": "float32",
            "count": 1, # Single band (NBR)
            # nodata already set to np.nan
        })

        return nbr, meta, final_transform
    

    @staticmethod
    def resample_raster_to_match(source_path, reference_path) -> MemoryFile:
        """
        Resamples a source raster to match the resolution and CRS of a reference raster.

        Args:
            source_path (str): Path to the source raster file.
            reference_path (str): Path to the reference raster file.
            output_path (str): Path to save the resampled output raster.
        """
        with rasterio.open(reference_path) as ref:
            ref_transform = ref.transform
            ref_crs = ref.crs

        with rasterio.open(source_path) as src:
            # Calculate the transformation from the source to the reference CRS
            transform, width, height = calculate_default_transform(
                src.crs, ref_crs, src.width, src.height, *src.bounds
            )

            # Update the metadata for the output raster
            out_meta = src.meta.copy()
            out_meta.update({
                "crs": ref_crs,
                "transform": ref_transform,
                "width": ref.width,
                "height": ref.height
            })


            swir_align = MemoryFile()
            

            with swir_align.open(**out_meta) as dst:
                for i in range(1, src.count + 1):
                    reproject(
                        source=rasterio.band(src, i),
                        destination=rasterio.band(dst, i),
                        src_transform=src.transform,
                        src_crs=src.crs,
                        dst_transform=ref_transform,
                        dst_crs=ref_crs,
                        resampling=Resampling.nearest  # Or another resampling method
                    )
            return swir_align