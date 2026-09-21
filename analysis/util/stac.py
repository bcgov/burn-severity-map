from pystac_client import Client
from rasterio.session import AWSSession
from rasterio.warp import reproject, Resampling, calculate_default_transform
from rasterio.io import MemoryFile
from rasterio.transform import array_bounds
from rasterio import mask
from rasterio.windows import from_bounds
from rasterio.features import geometry_mask
import geopandas as gpd
import numpy as np
import rasterio
from rasterio import merge
from shapely.geometry import shape, box
from datetime import timedelta
from scipy.ndimage import binary_dilation
import logging
import planetary_computer
import gc
import tempfile
import os, traceback

class STAC:
    s2_stac_url = 'https://earth-search.aws.element84.com/v1'
    ls_stac_url = 'https://planetarycomputer.microsoft.com/api/stac/v1'


    s2_collection_id = 'sentinel-2-l2a'
    ls89_collection_id = 'hls2-l30'
    ls57_collection_id = 'landsat-c2-l2'

    

    def __init__(self, date_offset: int, logger: logging.Logger):
        self.logger = logger
        self.date_offset = date_offset

        self.dict_sensors = {
            'sentinel-2a': 'S2',
            'sentinel-2b': 'S2',
            'sentinel-2c': 'S2',
            'landsat-5': 'L5',
            'landsat-7': 'L7',
            'landsat-8': 'L8',
            'landsat-9': 'L9'
        }

    def search_stac(self, sensor: str, 
                    perimeter_gdf: gpd.GeoDataFrame, 
                    daterange: str, 
                    cloud_cover_threshold: float,
                    image_ids: list) -> list:

        if sensor == 'S2':
            stac_api_url = STAC.s2_stac_url
            collection_id = STAC.s2_collection_id
        elif sensor in ['LS_5_7']:
            stac_api_url = STAC.ls_stac_url
            collection_id = STAC.ls57_collection_id
        elif sensor in ['LS_8_9']:
            stac_api_url = STAC.ls_stac_url
            collection_id = STAC.ls89_collection_id


        try:
            client = Client.open(stac_api_url)

            uncovered_geom = perimeter_gdf.union_all()
            selected_items = []
            searched_item_ids = set()

            if image_ids:
                self.logger.info(f'    - Fetching specified images: {image_ids}')
                search = client.search(
                    collections=[collection_id],
                    ids=image_ids
                )

                for item in search.items():
                    if sensor.startswith('LS'):
                        item = planetary_computer.sign(item)
                    self.logger.info(f'    - Found specified tile: {item.id}')
                    selected_items.append(item)
                    searched_item_ids.add(item.id)
                    item_geom = shape(item.geometry)
                    uncovered_geom = uncovered_geom.difference(item_geom)

                if not uncovered_geom.is_empty and selected_items:
                    dates = [item.datetime for item in selected_items]
                    min_date = min(dates) - timedelta(days=self.date_offset/2)
                    max_date = max(dates) + timedelta(days=self.date_offset/2)

                    daterange = f"{min_date.strftime('%Y-%m-%dT00:00:00Z')}/{max_date.strftime('%Y-%m-%dT23:59:59Z')}"
                    self.logger.warning(f'    - Coverage incomplete. Calculated new search window from items: {daterange}')

            if not uncovered_geom.is_empty:
                self.logger.info(f'    - Starting iterative search for full coverage: sensor:{sensor} collection:{collection_id} date range: {daterange} max cloud: {cloud_cover_threshold} ')

                # Limit iterations to prevent infinite loops
                max_iterations = 20
                for i in range(max_iterations):
                    if uncovered_geom.is_empty:
                        self.logger.info('    - Perimeter is fully covered')
                        break

                    self.logger.info(f'    - Iteration {i+1}: Area left to cover: {uncovered_geom.area:.4f} degrees^2')

                    # Search for the best tile covering the remaining area
                    search = client.search(
                        collections=[collection_id],
                        intersects=uncovered_geom,
                        datetime=daterange,
                        query={'eo:cloud_cover': {'lt': cloud_cover_threshold}},
                        sortby=[
                            {'field': 'properties.eo:cloud_cover', 'direction': 'asc'}, # Least cloudy first
                            {'field': 'properties.datetime', 'direction': 'desc'}      # Most recent within criteria
                        ],
                        max_items=100  # Fetch a batch of candidates
                    )

                    best_item_found = None
                    for item in search.items():
                        if item.id in searched_item_ids:
                            continue  # Skip if we've already selected or processed this tile

                        # Check for intersection again, as 'intersects' with bbox can be broad
                        item_geom = shape(item.geometry)
                        if item_geom.intersects(uncovered_geom):
                            best_item_found = item
                            break # Found the best available candidate for this iteration
                        
                    if best_item_found:
                        if sensor.startswith('LS'):
                            best_item_found = planetary_computer.sign(best_item_found)
                        item_id = best_item_found.id
                        item_date = best_item_found.datetime.date()
                        cloud_cover = best_item_found.properties.get('eo:cloud_cover', 0)
                        self.logger.info(f'    -> Selected tile {item_id} (Date: {item_date}, Cloud: {cloud_cover}%)')

                        selected_items.append(best_item_found)
                        searched_item_ids.add(item_id)

                        # Update the uncovered area if cloud coverage is cloud free
                        item_geom = shape(best_item_found.geometry)
                        uncovered_geom = uncovered_geom.difference(item_geom)
                    else:
                        self.logger.info('    - No more suitable intersecting tiles found in STAC')
                        if not selected_items:
                            self.logger.warning('    - Warning: could not find any tiles for the given criteria')
                        else:
                            self.logger.warning(f'    - Warning: Could not cover the entire perimeter. Proceeding with {len(selected_items)} tiles')
                            break
                else:
                    self.logger.warning(f'    - Warning: Reached max iterations ({max_iterations}). Proceeding with partial coverage if any')
            
            if selected_items:
                dates_used = {item.datetime.date() for item in selected_items}
                if len(dates_used) > 1:
                    self.logger.warning('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                    self.logger.warning('!!! WARNING: Tiles from multiple dates were used to create this mosaic     !!!')
                    self.logger.warning(f'!!! Dates: {sorted(list(dates_used))}')
                    self.logger.warning('!!! This can introduce inconsistencies due to varying atmospheric conditions !!!')
                    self.logger.warning('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

            return selected_items
        
        except Exception as e:
            self.logger.error(f'Error during STAC search for full coverage ({stac_api_url}): {e}')
            return []


    def create_nbr_mosaic(self, stac_items: list,
                          perimeter_gdf: gpd.GeoDataFrame, 
                          target_transform=None, 
                          target_crs=None, 
                          target_shape=None,
                          aws_requester_pays: bool = False):
        # nbr_datasets = []
        # mask_datasets = []
        # memfiles_to_close = []
        nbr_filepaths = []
        mask_filepaths = []
        self.logger.info(f'    - Processing {len(stac_items)} tiles to create an NBR mosaic')

        

        for item in stac_items:
            nbr_array, mask, meta = self.__calculate_nbr_for_item(item=item, perimeter_gdf=perimeter_gdf, aws_requester_pays=aws_requester_pays, target_transform=target_transform, target_crs=target_crs, target_shape=target_shape)
            if nbr_array is not None and nbr_array.size > 0:
                fd_nbr, path_nbr = tempfile.mkstemp(suffix='.tif')
                os.close(fd_nbr)
                with rasterio.open(path_nbr, 'w', **meta) as ds:
                    ds.write(nbr_array)
                nbr_filepaths.append(path_nbr)

                if mask is not None and mask.size > 0:
                    fd_mask, path_mask = tempfile.mkstemp(suffix='.tif')
                    os.close(fd_mask)
                    with rasterio.open(path_mask, 'w', **meta) as ds:
                        ds.write(mask)
                    mask_filepaths.append(path_mask)

                del nbr_array, mask
                gc.collect()
            else:
                self.logger.info(f'    - Skipping empty or invalid NBR result for item {item.id}')
            

        if not nbr_filepaths:
            self.logger.warning('    - No valid datasets could be processed for the NBR mosaic')
            return None, None, None, None

        self.logger.info(f'    - Merging {len(nbr_filepaths)} processed tiles into a single NBR mosaic')

        datasets_to_merge = [rasterio.open(path) for path in nbr_filepaths]
        try:
            mosaic_nbr, out_trans = merge.merge(datasets_to_merge)
            out_meta = datasets_to_merge[0].meta.copy()
        except Exception as e:
            self.logger.error(f'    - Error during rasterio.merge for NBR mosaic: {e}')
            return None, None, None, None
        finally:
            for ds in datasets_to_merge:
                ds.close()

        gc.collect()

        mask_datasets_to_merge = [rasterio.open(path) for path in mask_filepaths]
        try:
            mosaic_mask, _ = merge.merge(mask_datasets_to_merge)
        except Exception as e:
            self.logger.error(f'    - Error during rasterio.merge for NBR mosaic: {e}')
            return None, None, None, None
        finally:
            for ds in mask_datasets_to_merge:
                ds.close()

        for path in nbr_filepaths + mask_filepaths:
            if os.path.exists(path):
                os.remove(path)

        gc.collect()
        # try:
        #     mosaic_nbr, out_trans = merge.merge(datasets_to_merge)
        #     mosaic_mask, _ = merge.merge(mask_datasets_to_merge)

        #     out_meta = datasets_to_merge[0].meta.copy()
        #     out_meta.update({'height': mosaic_nbr.shape[1], 'width': mosaic_nbr.shape[2], 'transform': out_trans, 'crs': target_crs})
        # except Exception as e:
        #     self.logger.error(f'    - Error during rasterio.merge for NBR mosaic: {e}')
        #     return None, None, None, None
        # finally:
        #     for ds in datasets_to_merge + mask_datasets_to_merge:
        #         ds.close()

            

        self.logger.info('    - NBR Mosaic created successfully')
        return mosaic_nbr, mosaic_mask, out_meta, out_trans


    def create_rgb_mosaic(self, stac_items: list,
                          perimeter_gdf: gpd.GeoDataFrame, 
                          target_transform=None, 
                          target_crs=None, 
                          target_shape=None,
                          aws_requester_pays: bool = False):
        rgb_filepaths = []
        self.logger.info(f'    - Processing {len(stac_items)} tiles to create an RGB mosaic')

        for item in stac_items:
            rgb_array, meta = self.__calculate_rgb_for_item(item=item, perimeter_gdf=perimeter_gdf, aws_requester_pays=aws_requester_pays, target_transform=target_transform, target_crs=target_crs, target_shape=target_shape)
            if rgb_array is not None and rgb_array.size > 0:

                fd_rgb, path_rgb = tempfile.mkstemp(suffix='.tif')
                os.close(fd_rgb)

                with rasterio.open(path_rgb, 'w', **meta) as ds:
                    ds.write(rgb_array)
                rgb_filepaths.append(path_rgb)

                del rgb_array
                gc.collect()

            else:
                self.logger.info(f'    - Skipping empty or invalid RGB result for item {item.id}')
        if not rgb_filepaths:
            self.logger.warning('    - No valid datasets could be processed for the RGB mosaic')
            return None, None, None

        self.logger.info(f'    - Merging {len(rgb_filepaths)} processed tiles into a single RGB mosaic')

        datasets_to_merge = [rasterio.open(path) for path in rgb_filepaths]

        try:
            mosaic, out_trans = merge.merge(datasets_to_merge)
            out_meta = datasets_to_merge[0].meta.copy()
            out_meta.update({'height': mosaic.shape[1], 'width': mosaic.shape[2], 'transform': out_trans, 'crs': target_crs})
        except Exception as e:
            self.logger.error(f'    - Error during rasterio.merge for RGB mosaic: {e}')
            return None, None, None
        finally:
            for ds in datasets_to_merge:
                ds.close()

            for path in rgb_filepaths:
                if os.path.exists(path):
                    os.remove(path)


        self.logger.info('    - RGB Mosaic created successfully')
        return mosaic, out_meta, out_trans


    def __calculate_nbr_for_item(self, item: 'pystac.Item', 
                               perimeter_gdf: gpd.GeoDataFrame, 
                               target_transform=None, 
                               target_crs=None, 
                               target_shape=None,
                               aws_requester_pays: bool = False):
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

        sensor = self.dict_sensors[item.properties['platform']]

        # Determine asset keys for NIR (B8) and SWIR (B12)
        # Common keys for Sentinel-2 L2A:
        # Element84 STAC: 'nir', 'swir22'
        # Microsoft Planetary Computer STAC: 'B08', 'B12'
        if 'nir' in item.assets and 'swir22' in item.assets:
            nir_asset_key = 'nir'
            swir_asset_key = 'swir22'
        elif 'nir08' in item.assets and 'swir22' in item.assets:
            nir_asset_key = 'nir08'
            swir_asset_key = 'swir22'
        elif 'B08' in item.assets and 'B12' in item.assets:
            nir_asset_key = 'B08'
            swir_asset_key = 'B12'
        elif 'SR_B5' in item.assets and 'SR_B7' in item.assets:
            nir_asset_key = 'SR_B5'
            swir_asset_key = 'SR_B7'
        elif 'SR_B4' in item.assets and 'SR_B7' in item.assets:
            nir_asset_key = 'SR_B4'
            swir_asset_key = 'SR_B7'
        elif 'B05' in item.assets and 'B07' in item.assets:
            nir_asset_key = 'B05'
            swir_asset_key = 'B07'
        else:
            available_keys = list(item.assets.keys())
            self.logger.info(f'Error: Could not find required NIR (B8) or SWIR (B12) band assets in STAC item \'{item.id}\'.')
            self.logger.info(f'Available asset keys: {available_keys}')
            # Try to find common alternatives if specific keys are missing
            if 'rededge1' in available_keys and 'swir16' in available_keys : # B5 and B11 (less common for NBR)
                 self.logger.info('Found \'rededge1\' and \'swir16\'. Note: NBR typically uses B8 (NIR) and B12 (SWIR2.2).')
            return None, None

        nir_href = item.assets[nir_asset_key].href
        swir_href = item.assets[swir_asset_key].href
        self.logger.info(f'Using NIR asset: \'{nir_asset_key}\' ({nir_href})')
        self.logger.info(f'Using SWIR asset: \'{swir_asset_key}\' ({swir_href})')

        self.logger.info('Connecting to aws session')
        # Use rasterio's AWS session for S3-hosted COGs
        aws_session = AWSSession(requester_pays=aws_requester_pays)
        env_settings = rasterio.Env(session=aws_session, GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tif')
        self.logger.info('Successfully connected to aws session')

        with env_settings:
            try:
                self.logger.info('Opening nir')
                with rasterio.open(nir_href) as src_nir:
                    src_crs = src_nir.crs
                    nodata_val_nir = src_nir.nodata or 0

                    if perimeter_gdf.crs is None:
                        perimeter_src_crs = perimeter_gdf.set_crs('EPSG:4326', allow_override=True).to_crs(src_crs)
                    else:
                        perimeter_src_crs = perimeter_gdf.to_crs(src_crs)

                    src_window_nir = from_bounds(*perimeter_src_crs.total_bounds, transform=src_nir.transform)
                    src_window_nir = src_window_nir.round_offsets().round_lengths()
                    window_transform_nir = src_nir.window_transform(src_window_nir)
                    src_bounds_nir = rasterio.windows.bounds(src_window_nir, src_nir.transform)

                    nir_subset = src_nir.read(1, window=src_window_nir, boundless=True).astype(np.float32)

                self.logger.info('Opening swir')
                with rasterio.open(swir_href) as src_swir:
                    nodata_val_swir = src_swir.nodata or 0

                    src_window_swir = from_bounds(*perimeter_src_crs.total_bounds, transform=src_swir.transform)
                    src_window_swir = src_window_swir.round_offsets().round_lengths()
                    window_transform_swir = src_swir.window_transform(src_window_swir)

                    swir_subset = src_swir.read(1, window=src_window_swir, boundless=True).astype(np.float32)

                dst_crs = target_crs if target_crs else src_crs

                target_res = self.__get_target_resolution(sensor=sensor, perimeter_gdf=perimeter_gdf)


                out_transform, out_width, out_height = calculate_default_transform(src_crs, dst_crs, src_window_nir.width, src_window_nir.height, *src_bounds_nir, resolution=target_res)

                self.logger.info('Reprojecting nir')
                nir_reprojected = np.empty((1, out_height, out_width), dtype=np.float32)
                reproject(
                    source=nir_subset,
                    destination=nir_reprojected,
                    src_transform=window_transform_nir,
                    src_crs=src_crs,
                    dst_transform=out_transform,
                    dst_crs=dst_crs,
                    resampling=Resampling.bilinear,
                    src_nodata=nodata_val_nir,
                    dst_nodata=np.nan
                )
                nir_data = nir_reprojected[0].copy()
                del nir_reprojected
                gc.collect()

                nodata_mask_nir = (nir_data == nodata_val_nir) | (nir_data == 0)
                nir_data = self.process_reflectance(data=nir_data, band='NIR', sensor=sensor)
                nir_data[nodata_mask_nir] = np.nan

                self.logger.info('Reprojecting swir')
                swir_reprojected = np.empty((1, out_height, out_width), dtype=np.float32)
                reproject(
                    source=swir_subset,
                    destination=swir_reprojected,
                    src_transform=window_transform_swir,
                    src_crs=src_crs,
                    dst_transform=out_transform,
                    dst_crs=dst_crs,
                    resampling=Resampling.bilinear,
                    src_nodata=nodata_val_swir,
                    dst_nodata=np.nan
                )

                swir_data = swir_reprojected[0].copy()
                del swir_reprojected
                gc.collect()

                nodata_mask_swir = np.isnan(swir_data) | (swir_data == 0)
                swir_data = self.process_reflectance(data=swir_data, band='SWIR2', sensor=sensor)
                swir_data[nodata_mask_swir] = np.nan

            except Exception as e:
                self.logger.error(f'Error reading/reprojecting COG data for item {item.id}: {e}\n Traceback: {traceback.print_exc()}')
                return None, None, None
        
        try:
            self.logger.info('Calculating nbr')
            # Calculate NBR on the reprojected and aligned data
            # numerator = nir_data - swir_data
            # denominator = nir_data + swir_data
            # nbr = np.full(nir_data.shape, np.nan, dtype=np.float32)
            # valid_mask = (denominator != 0) & ~np.isnan(denominator) & ~np.isnan(numerator)
            # nbr[valid_mask] = numerator[valid_mask] / denominator[valid_mask]
            # nbr = np.clip(nbr, -1.0, 1.0)

            denominator = nir_data + swir_data
            valid_mask = (denominator != 0) & ~np.isnan(denominator) & ~np.isnan(nir_data) & ~np.isnan(swir_data)
            nbr = np.full(nir_data.shape, np.nan, dtype=np.float32)
            nbr[valid_mask] = (nir_data[valid_mask] - swir_data[valid_mask]) / denominator[valid_mask]
            nbr = np.clip(nbr, -1.0, 1.0)

            del denominator, valid_mask
            gc.collect()

            self.logger.info('Getting masks')
            is_cloud, is_shadow, is_snow = self.__extract_masks_for_item(item, out_transform=out_transform, out_height=out_height, out_width=out_width, target_crs=target_crs, nir_data=nir_data)

            all_masks = np.zeros(nbr.shape, dtype=np.uint8)
            all_masks[is_cloud | is_shadow | is_snow] = 1

            del nir_data, swir_data, is_cloud, is_shadow, is_snow
            gc.collect()

            self.logger.info('Gathering clip geometry')
            perimeter_gdf_proj = perimeter_gdf.to_crs(dst_crs)
            clip_geom = [geom.__geo_interface__ for geom in perimeter_gdf_proj.geometry]

            # Create a temporary in-memory dataset to apply the mask
            # This dataset will have the correct CRS and transform of our target
            temp_meta = {
                "driver": "GTiff",
                "height": nbr.shape[0],
                "width": nbr.shape[1],
                "count": 1,
                "dtype": nbr.dtype,
                "crs": target_crs, # Set the CRS to target_crs
                "transform": out_transform,
                "nodata": np.nan
            }

            self.logger.info('Clipping nbr and mask')
            minx, miny, maxx, maxy = perimeter_gdf_proj.total_bounds
            crop_window = rasterio.windows.from_bounds(minx, miny, maxx, maxy, transform=out_transform).round_offsets().round_lengths()

            col_off, row_off = int(crop_window.col_off), int(crop_window.row_off)
            width, height = int(crop_window.width), int(crop_window.height)

            clipped_transform = rasterio.windows.transform(crop_window, out_transform)

            clipped_nbr_array = nbr[row_off:row_off + height, col_off:col_off + width]
            clipped_mask = all_masks[row_off:row_off + height, col_off:col_off + width]

            geom_mask = geometry_mask(clip_geom, out_shape=(height, width), transform=clipped_transform, invert=True)
            clipped_nbr_array[~geom_mask] = np.nan
            clipped_mask[~geom_mask] = 0

            clipped_nbr_array = np.expand_dims(clipped_nbr_array, axis=0)
            clipped_mask = np.expand_dims(clipped_mask, axis=0)

            # Update metadata for the final clipped output
            meta = temp_meta.copy()
            meta.update({
                "transform": clipped_transform,
                "width": clipped_nbr_array.shape[2],
                "height": clipped_nbr_array.shape[1],
                "crs": target_crs # Ensure CRS is explicitly set here as well
            })
        except Exception as e:
            self.logger.error(f'Error in calculating and clipping: {e}\n Traceback {traceback.print_exc()}')
            return None, None

        return clipped_nbr_array, clipped_mask, meta
    

    def __calculate_rgb_for_item(self, item: 'pystac.Item', 
                               perimeter_gdf: gpd.GeoDataFrame, 
                               target_transform=None, 
                               target_crs=None, 
                               target_shape=None,
                               aws_requester_pays: bool = False,
                               run_type: str='pre'):
        """
        Internal helper to create a 3-band RGB array for one STAC item, clipped to the perimeter's BOUNDING BOX.
        If target_crs is provided, the tile is reprojected.
        """
        platform = item.properties.get('platform', '').lower()
        if platform in ['landsat-4', 'landsat-5', 'landsat-7']: # landsat 4/5/7
            band_keys = {'red': ('SR_B3', 'red'), 'green': ('SR_B2', 'green'), 'blue': ('SR_B1', 'blue')}
        elif 'landsat' in platform: # landsat 8/9
            band_keys = {'red': ('SR_B4', 'B04', 'red'), 'green': ('SR_B3', 'B03', 'green'), 'blue': ('SR_B2', 'B02', 'blue')}
        else: # sentinel
            band_keys = {'red': ('B04', 'red'), 'green': ('B03', 'green'), 'blue': ('B02', 'blue')}
        assets = {}
        self.logger.info(list(item.assets.keys()))
        for band, keys in band_keys.items():
            found_key = next((k for k in keys if k in item.assets), None)
            if not found_key:
                self.logger.warning(f'Warning: Could not find {band.capitalize()} band asset in STAC item \'{item.id}\'. Skipping this tile for RGB.')
                return None, None
            assets[band] = item.assets[found_key].href
        aws_session = AWSSession(requester_pays=aws_requester_pays)
        env_settings = rasterio.Env(session=aws_session, GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif")
        rgb_bands_data = []
        with env_settings:
            try:
                with rasterio.open(assets['red']) as src_meta_check:
                    src_crs = src_meta_check.crs
                    nodata_val = src_meta_check.nodata or 0
                    resolution = src_meta_check.res[0]

                    if perimeter_gdf.crs is None:
                        perimeter_src_crs = perimeter_gdf.set_crs("EPSG:4326", allow_override=True).to_crs(src_crs)
                    else:
                        perimeter_src_crs = perimeter_gdf.to_crs(src_crs)

                    src_window = from_bounds(*perimeter_src_crs.total_bounds, transform=src_meta_check.transform)
                    src_window = src_window.round_offsets().round_lengths()
                    window_transform = src_meta_check.window_transform(src_window)

                # for band_name in ['red', 'green', 'blue']:
                #     with rasterio.open(assets[band_name]) as src:
                #         band_subset = src.read(1, window=src_window).astype(np.uint16)
                #         rgb_bands_data.append(band_subset)

                rgb_array = np.empty((3, int(src_window.height), int(src_window.width)), dtype=np.uint16)
                for idx, band_name in enumerate(['red', 'green', 'blue']):
                    with rasterio.open(assets[band_name]) as src:
                        src.read(1, window=src_window, out=rgb_array[idx], boundless=True)

                if perimeter_gdf.crs is None:
                    perimeter_target_crs = perimeter_gdf.set_crs("EPSG:4326", allow_override=True).to_crs(target_crs)
                else:
                    perimeter_target_crs = perimeter_gdf.to_crs(target_crs)

                left, bottom, right, top = perimeter_target_crs.total_bounds
                out_width = int((right - left) / resolution)
                out_height = int((top - bottom) / resolution)
                out_transform = rasterio.transform.from_bounds(left, bottom, right, top, out_width, out_height)
                
            except Exception as e:
                self.logger.warning(f'Warning: Error reading/clipping RGB COG for item {item.id}. Skipping. Error: {e}')
                return None, None

        # rgb_array = np.stack(rgb_bands_data, axis=0)

        del rgb_bands_data
        gc.collect()


        if target_crs:
            try:
                destination = np.empty((3, out_height, out_width), dtype=np.uint16)

                reproject(
                    source=rgb_array,
                    destination=destination,
                    src_transform=window_transform,
                    src_crs=src_crs,
                    dst_transform=out_transform,
                    dst_crs=target_crs,
                    resampling=Resampling.bilinear,
                    src_nodata=nodata_val,
                    dst_nodata=0
                )

                del rgb_array
                gc.collect()

                dst_meta = {
                    "driver": "GTiff", 
                    "dtype": "uint16", 
                    "count": 3, 
                    "nodata": 0, 
                    "crs": target_crs,
                    "transform": out_transform,
                    "width": out_width, 
                    "height": out_height
                }
                return destination, dst_meta
            except Exception as e:
                self.logger.error(f'Error: Failed to reproject tile {item.id}. Skipping. Error: {e}')
                return None, None
        else:
            meta = {
                "driver": "GTiff", 
                "dtype": "uint16", 
                "count": 3, 
                "nodata": nodata_val, 
                "crs": src_crs,
                "transform": window_transform, 
                "width": src_window.width, 
                "height": src_window.height
            }
            return rgb_array, meta

    def __extract_masks_for_item(self, item: 'pystac.Item', out_transform, out_height, out_width, target_crs, nir_data=None):
        is_cloud = np.zeros((out_height, out_width), dtype=bool)
        is_shadow = np.zeros((out_height, out_width), dtype=bool)
        is_snow = np.zeros((out_height, out_width), dtype=bool)

        qa_key = next((k for k in ['scl', 'SCL', 'qa_pixel', 'QA_PIXEL', 'fmask', 'Fmask', 'FMASK'] if k in item.assets), None)
        if not qa_key:
            return is_cloud, is_shadow, is_snow

        try:
            with rasterio.open(item.assets[qa_key].href) as src_qa:
                qa_reprojected = np.empty((1, out_height, out_width), dtype=np.uint16)
                reproject(
                    source=rasterio.band(src_qa, 1),
                    destination=qa_reprojected,
                    src_transform=src_qa.transform,
                    src_crs=src_qa.crs,
                    dst_transform=out_transform,
                    dst_crs=target_crs,
                    resampling=Resampling.nearest,
                    src_nodata=src_qa.nodata,
                    dst_nodata=0
                )
                qa_data = qa_reprojected[0]

                if qa_key.lower() == 'scl':
                    # Sentinel-2 cloud values
                    # 3: Cloud Shadow, 8: Cloud Medium Probability, 9: Cloud High Probability, 10: Thin Cirrus
                    is_shadow = (qa_data == 3 )
                    is_cloud = np.isin(qa_data, [8, 9, 10])
                    is_snow = (qa_data == 11)
                    int_iterations = 3
                elif qa_key.lower() == 'fmask':
                    # Landsat 8/9 bitmask checks
                    # 0: Cirrus, 1: Cloud, 2: Adj Cloud Shadow, 3: Cloud Shadow
                    is_shadow = ((qa_data & (1 << 3)) != 0)
                    is_cloud = ((qa_data & (1 << 1)) != 0)
                    is_snow = ((qa_data & (1 << 4)) != 0)
                    int_iterations = 1
                else:
                    # Landsat 5/7 bitmask checks
                    # 2: Dilated Cloud, 3: Cloud, 4: Cloud Shadow
                    is_shadow = ((qa_data & (1 << 4)) != 0)
                    is_cloud = ((qa_data & (1 << 3)) != 0)
                    is_snow = ((qa_data & (1 << 5)) != 0)
                    int_iterations = 1

                if nir_data is not None:
                    nir_shadow_threshold = 0.08
                    is_shadow = is_shadow & (nir_data < nir_shadow_threshold)

                is_cloud = binary_dilation(is_cloud, iterations=int_iterations)
        
        except Exception as e:
            self.logger.warning(f' Could not process qa mask for item {item.id}: {e}')

        return is_cloud, is_shadow, is_snow


    def __get_target_resolution(self, sensor: str, perimeter_gdf: gpd.GeoDataFrame, threshold_ha: float = 10000.0) -> float:
        if sensor != 'S2':
            return 30.0

        if perimeter_gdf.crs is None or perimeter_gdf.crs.is_geographic:
            gdf_metric = perimeter_gdf.to_crs(epsg=3005)
        else:
            gdf_metric = perimeter_gdf

        fire_area_ha = gdf_metric.geometry.area.sum() /10000.0

        if fire_area_ha >= threshold_ha:
            return 20.0
        return 10.0

    @staticmethod
    def resample_raster_to_match(source_path, ref_transform, ref_crs, ref_width, ref_height) -> MemoryFile:
        """
        Resamples a source raster to match the resolution and CRS of a reference raster.

        Args:
            source_path (str): Path to the source raster file.
            reference_path (str): Path to the reference raster file.
            output_path (str): Path to save the resampled output raster.
        """

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
                "width": ref_width,
                "height": ref_height
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

    @staticmethod
    def process_reflectance(data: np.ndarray, band: str, sensor: str) -> np.ndarray:

        if sensor in ['S2', 'L8', 'L9']:
            refl = data / 10000.0
        elif sensor in ['L5', 'L7']: #, 'L8', 'L9']:
            refl = (data * 0.0000275) - 0.2
        else:
            return data

        # Harmonize L5/L7 to the L8/L9 OLI baseline
        if sensor in ['L5', 'L7']:
            if band == 'NIR':
                refl = (refl * 0.8462) + 0.0412
            elif band == 'SWIR2':
                refl = (refl * 0.9071) + 0.0172

        if sensor in ['L5', 'L7']: #, 'L8', 'L9']:
            if band == 'NIR':
                refl = (refl * 0.9983) - 0.0001
            elif band == 'SWIR2':
                refl = (refl * 1.0030) - 0.0012

        return refl
