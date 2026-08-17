
from datetime import datetime, timedelta
from argparse import ArgumentParser
import logging
import os, sys, shutil, traceback
import numpy as np
from collections import defaultdict
import rasterio
from rasterio.features import shapes, sieve
from rasterio.io import MemoryFile
from rio_cogeo.profiles import cog_profiles
from rio_cogeo.cogeo import cog_translate
from io import BytesIO
from pathlib import Path
import zipfile
import tempfile

from util.environment import Environment
from util.classes import ImageMetadata, Fire
from util.wfs import WFS
from util.stac import STAC
from util.object_storage import ObjectStorage
from util.qgis_map_robot import bs_map_exporter

import geopandas as gpd
import pandas as pd
import warnings
warnings.filterwarnings('ignore')



def run_app():
    
        fire, year, sensor, output_folder, object_storage, s_date, e_date, cloud, image_ids, logger = get_input_parameters()
        burn_sev = InterimBurnSeverity(fire=fire, year=year, output_folder=output_folder, object_storage=object_storage, sensor=sensor, 
                                       start_date=s_date, end_date=e_date, cloud_cover=cloud, image_ids=image_ids, logger=logger)
        try:
            result = burn_sev.gather_spatial()
            if not result:
                return
            barc, meta = burn_sev.calculate_severity()
            burn_sev.conversion(barc=barc, meta=meta)
        except Exception as e:
            logger.error(f'Could not complete the burn severity analysis: {e} \n Traceback: {traceback.print_exc()}')
        del burn_sev


def get_input_parameters():
    """
    Function:
        Sets up parameters and the logger object
    Returns:
        tuple: user entered parameters required for tool execution
    """
    try:
        parser = ArgumentParser(description='This script is used to calculate burn severity based on Sentinel or Landsat imagery')
        parser.add_argument('fire', type=str, help='Fire Number')
        parser.add_argument('year', type=str, help='Fire Year')
        parser.add_argument('sensor', type=str, help='Sensor to use')
        parser.add_argument('-f', '--output_folder', type=str, nargs='?', help='Output local folder location')
        parser.add_argument('-o', '--object_storage', action='store_true', help='Write to object storage')
        parser.add_argument('-s', '--s_date', type=str, nargs='?', help='Optional start date for fire')
        parser.add_argument('-e', '--e_date', type=str, nargs='?', help='Optional end date for fire')
        parser.add_argument('-c', '--cloud', type=str, default='10', help='Cloud cover')
        parser.add_argument('-i', '--image_ids', type=str, nargs='?', help='Optional image ids to use for processing. Image ids should be comma separated values with pre and post values separated by a semi-colon (ie. pre_id1,pre_id2:post_id1,post_id2)')
        parser.add_argument('--log_level', default='INFO', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                            help='Log level')
        parser.add_argument('--log_dir', default='/tmp/app_logs', help='Path to log directory')

        args = parser.parse_args()
        if not args.output_folder and not args.object_storage:
            raise ValueError('An output folder and/or and the object storage folder must be indicated.  Use the -f and -o flags')
        
        if str(args.sensor) != 'S2':
            raise AttributeError('The analysis can only use Sentinel 2 imagery at this time.  Please change the parameter to \'S2\'')

        logger = Environment.setup_logger(args)

        return args.fire, args.year, args.sensor, args.output_folder, args.object_storage, args.s_date, args.e_date, args.cloud, args.image_ids, logger

    except ValueError as v:
        logging.error(f'Value Error: Missing arguments - {v}')
        sys.exit(1)

    except AttributeError as a:
        logging.error(f'Sensor Error: Incorrect Sensor - {a}')
        sys.exit(1)

    except Exception as e:
        logging.error(f'Unexpected exception. Program terminating: {e}')
        sys.exit(1)

class InterimBurnSeverity:
    def __init__(self, fire: str, year: str, sensor: str='S2', output_folder: str=None, object_storage: bool=False, start_date:str=None, end_date: str=None, 
                 cloud_cover: str='10', image_ids:str=None, logger:logging.Logger=None) -> None:
        self.fire_number = fire
        self.fire_year = int(year)
        self.use_storage = object_storage
        self.use_folder = True if output_folder else False
        

        self.start_date = None if not start_date else datetime.strptime(str(start_date).split(' ')[0], '%Y-%m-%d')
        self.end_date = None if not end_date else datetime.strptime(str(end_date).split(' ')[0], '%Y-%m-%d')
        self.str_image_ids = None if not image_ids else image_ids.replace(' ','')
        self.pre_image_ids = []
        self.post_image_ids = []
        if self.str_image_ids:
            if self.str_image_ids.endswith(':'):
                self.pre_image_ids = self.str_image_ids[:-1].split(',')
            elif self.str_image_ids.startswith(':'):
                self.post_image_ids = self.str_image_ids[1:].split(',')
            elif ':' in self.str_image_ids:
                self.pre_image_ids = self.str_image_ids.split(':')[0].split(',')
                self.post_image_ids = self.str_image_ids.split(':')[1].split(',')
            else:
                self.pre_image_ids = self.str_image_ids.split(',')

        self.cloud_cover = float(cloud_cover)
        self.logger = logger
        self.fire_status = ''
        self.sensor = sensor
        self.out_folder = output_folder
        self.fire_folder = None
        self.output_folder = None
        self.export_folder = None
        self.os_fire_folder = None
        self.os_output_folder = None
        self.os_export_folder = None

        if self.use_folder:
            self.fire_folder = os.path.join(self.out_folder, f'{self.fire_year}-{self.fire_number}')
            self.output_folder = os.path.join(self.fire_folder, 'output')
            self.export_folder = os.path.join(self.fire_folder, 'export')
            self.out_gdb = os.path.join(self.export_folder, f'interim_burn_severity_temp.gdb')

            for fld in [self.output_folder, self.export_folder]:
                if os.path.exists(fld):
                    shutil.rmtree(fld)
                os.makedirs(fld)

        if self.use_storage:
            self.os_fire_folder = f'{self.fire_year}-{self.fire_number}'
            self.os_output_folder = f'{self.os_fire_folder}/output'
            self.os_export_folder = f'{self.os_fire_folder}/export'
            self.logger.info('Creating connection to object storage')
            try:
                self.obj_storage = ObjectStorage()
            except Exception as e:
                self.logger.error(f'ERROR: Could not create the object storage connection: {e}')
                return 


        self.fld_fire_num = 'FIRE_NUMBER'
        self.fld_fire_year = 'FIRE_YEAR'
        self.fld_fire_status = 'FIRE_STATUS'
        self.fld_fire_ign_date = 'IGNITION_DATE'
        self.fld_fire_out_date = 'FIRE_OUT_DATE'
        self.fld_burn_sev = 'BURN_SEVERITY_RATING'
        self.fld_pre_fire_image = 'PRE_FIRE_IMAGE'
        self.fld_pre_fire_date = 'PRE_FIRE_IMAGE_DATE'
        self.fld_post_fire_image = 'POST_FIRE_IMAGE'
        self.fld_post_fire_date = 'POST_FIRE_IMAGE_DATE'
        self.fld_comments = 'COMMENTS'
        self.fld_area_ha = 'AREA_HA'
        self.fld_fire_size = 'FIRE_SIZE_HECTARES'
        self.fld_o_geom = 'SHAPE'

        self.__current_perimeters = 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP'
        self.__current_points ='WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP'
        self.__historic_perimeters = 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_HISTORICAL_FIRE_POLYS_SP'
        self.__historic_points = 'WHSE_LAND_AND_NATURAL_RESOURCE.PROT_HISTORICAL_INCIDENTS_SP'
        

        self.dict_pre_fire = defaultdict(ImageMetadata)
        self.dict_post_fire = defaultdict(ImageMetadata)
        self.dict_fires = defaultdict(Fire)
        self.lst_delete_datasets = []

        self.lst_fire_fields = [self.fld_fire_num, self.fld_fire_status, self.fld_fire_year, self.fld_fire_size, self.fld_o_geom]
        self.lst_fire_point_fields = [self.fld_fire_num, self.fld_fire_ign_date, self.fld_fire_out_date]

        self.bl_historical = False
        self.int_date_offset = 30

        self.gdf_fires = None
        self.fire_boundary = None

    def __del__(self) -> None:
        pass

    def get_fire(self, ds_poly: str, ds_point:str, fire_sql: str, poly_fields: list, point_fields) -> tuple:
        try:
            self.logger.info(f'Pulling polygons from {ds_poly}')
            fires = WFS.get_data(dataset=ds_poly, query=fire_sql, fields=poly_fields)
            if not fires:
                return None, 0
            gdf_fires = gpd.GeoDataFrame.from_features(features=fires, crs=3005)
            gdf_fires.drop(columns=gdf_fires.columns.difference(poly_fields + ['geometry']), inplace=True)
            int_fire_count = gdf_fires.shape[0]
            if int_fire_count != 0:
                self.logger.info(f'Pulling points from {ds_point}')
                fire_points = WFS.get_data(dataset=ds_point, query=fire_sql, fields=point_fields)
                gdf_points = gpd.GeoDataFrame.from_features(features=fire_points, crs=3005)
                gdf_points.drop(columns=gdf_points.columns.difference(self.lst_fire_point_fields), inplace=True)
                gdf_points[self.fld_fire_ign_date] = pd.to_datetime(gdf_points[self.fld_fire_ign_date], format='%Y-%m-%dZ')
                gdf_points[self.fld_fire_out_date] = pd.to_datetime(gdf_points[self.fld_fire_out_date], format='%Y-%m-%dZ')
                gdf_fires = gdf_fires.merge(gdf_points, on=self.fld_fire_num)
                print('Merging points to polygons')

                if int_fire_count > 1:
                    gdf_fires = gdf_fires.dissolve()
                    int_fire_count = gdf_fires.shape[0]
        except Exception as e:
            self.logger.error(f'Error in gathering fires: {e} \n Traceback: {traceback.print_exc()}')
            return
        return gdf_fires, int_fire_count

    def gather_spatial(self) -> None:
        self.logger.info(f'Extracting {self.fire_number} from current fire layer')

        self.dict_pre_fire[self.fire_number] = ImageMetadata(fire_number=self.fire_number, fire_year=self.fire_year)
        self.dict_post_fire[self.fire_number] = ImageMetadata(fire_number=self.fire_number, fire_year=self.fire_year)

        int_fire_count = 0
        fire_sql = f'FIRE_YEAR = {self.fire_year} AND FIRE_NUMBER =\'{self.fire_number}\''

        if self.fire_year in [datetime.now().year, datetime.now().year - 1]:
            self.gdf_fires, int_fire_count = self.get_fire(ds_poly=self.__current_perimeters, ds_point=self.__current_points, fire_sql=fire_sql, 
                                                           poly_fields=self.lst_fire_fields, point_fields=self.lst_fire_point_fields)
            if int_fire_count == 0:
                self.logger.info('Nothing found in current fire layer')
        
        if int_fire_count == 0:
            self.logger.info('Checking in historical fire layer')
            self.bl_historical = True
            self.gdf_fires, int_fire_count = self.get_fire(ds_poly=self.__historic_perimeters, ds_point=self.__historic_points, fire_sql=fire_sql, 
                                                           poly_fields=[fld for fld in self.lst_fire_fields if fld != self.fld_fire_status], 
                                                           point_fields=self.lst_fire_point_fields)
            self.fire_status = 'Out'
            if int_fire_count == 0:
                self.logger.error(f'The year and fire number combination of {self.fire_year} and {self.fire_number} does not exist in the current or historical datasets.  Please try a different combination')
                return False
        

        # self.lst_delete_datasets.extend([self.fc_fire_point, self.fc_fire_perimeter])


        for i, row in self.gdf_fires.iterrows():
            if not self.start_date:
                ign_date = self.gdf_fires.at[i, self.fld_fire_ign_date]
            else:
                ign_date = self.start_date
                self.gdf_fires.at[i, self.fld_fire_ign_date] = self.start_date

            if not self.bl_historical:
                self.fire_status = self.gdf_fires.at[i, self.fld_fire_status]
            
            if not self.end_date:
                if self.fire_status == 'Out' or self.bl_historical:
                    out_date = self.gdf_fires.at[i, self.fld_fire_out_date]
                else:
                    self.logger.warning(f'{self.fire_number} is not yet extinguished, calculating based on today\'s date instead')
                    out_date = datetime.now() - timedelta(days=7)
                    self.gdf_fires.at[i, self.fld_fire_out_date] = out_date
            else:
                out_date = self.end_date
                self.gdf_fires.at[i, self.fld_fire_out_date] = self.end_date


        str_ign_date = ign_date.strftime('%Y-%m-%d')
        str_out_date = out_date.strftime('%Y-%m-%d')

        self.logger.info(f'Fire {self.fire_number} with status {self.fire_status} ignited on {str_ign_date} and was extinguished on {str_out_date}')

        ign_date = ign_date - timedelta(days=1)
        out_date = out_date

        extract_date = ign_date

        if extract_date <= datetime(year=extract_date.year, month=5, day=1):
            self.logger.warning('The ignition date occurs during a time of year with a greater potential for snow, checking for imagery in the previous year')
            extract_date = datetime(year=extract_date.year - 1, month=9, day=30)
        pre_end_date = extract_date
        pre_start_date = pre_end_date - timedelta(days=self.int_date_offset)
        if pre_start_date < datetime(year=pre_start_date.year, month=5, day=1):
            pre_start_date = datetime(year=pre_start_date.year, month=5, day=1)

        post_start_date = out_date
        post_end_date = post_start_date + timedelta(days=self.int_date_offset)


        self.dict_fires[self.fire_number] = Fire(fire_num=self.fire_number, fire_year=self.fire_year, pre_start_date=pre_start_date, pre_end_date=pre_end_date, 
                                                 post_start_date=post_start_date, post_end_date=post_end_date)

        return True

    def calculate_severity(self):

        stac = STAC(date_offset=self.int_date_offset, logger=self.logger)
        lst_fires = self.gdf_fires[self.fld_fire_num].tolist()
        for fire_number in lst_fires:
            try:
                #Load in shapefile
                perimeter_gdf = self.gdf_fires[self.gdf_fires[self.fld_fire_num] == fire_number]
               
                perimeter_gdf['geometry'] = perimeter_gdf.geometry.buffer(500)

                pre_fire_date = ''
                post_fire_date = ''
                temp_pre_fire_date = None
                temp_post_fire_date = None

                self.logger.info('Searching for pre-fire imagery')
                pre_fire_items = stac.search_stac(sensor=self.sensor, perimeter_gdf=perimeter_gdf.to_crs('EPSG:4326'), daterange=self.dict_fires[self.fire_number].get_pre_date_range(), cloud_cover_threshold=self.cloud_cover, image_ids=self.pre_image_ids)
                if not pre_fire_items:
                    self.logger.error('Could not find suitable pre-fire imagery. Try adjusting date range or cloud cover threshold.')
                    return None
                for item in pre_fire_items:
                    self.dict_fires[self.fire_number].lst_pre_image.append(item.id)
                    self.dict_fires[self.fire_number].lst_pre_dates.append(item.datetime.strftime('%Y-%m-%d'))
                    if not temp_pre_fire_date:
                        temp_pre_fire_date = item.datetime
                    elif item.datetime < temp_pre_fire_date:
                        temp_pre_fire_date = item.datetime
                pre_fire_date = temp_pre_fire_date.strftime('%Y%m%d')

                self.logger.info('Searching for post-fire imagery')
                post_fire_items = stac.search_stac(sensor=self.sensor, perimeter_gdf=perimeter_gdf.to_crs('EPSG:4326'), daterange=self.dict_fires[self.fire_number].get_post_date_range(), cloud_cover_threshold=self.cloud_cover, image_ids=self.post_image_ids)
                if not post_fire_items:
                    self.logger.error('Could not find suitable post-fire imagery. Try adjusting date range or cloud cover threshold.')
                    raise Exception
                for item in post_fire_items:
                    self.dict_fires[self.fire_number].lst_post_image.append(item.id)
                    self.dict_fires[self.fire_number].lst_post_dates.append(item.datetime.strftime('%Y-%m-%d'))
                    if not temp_post_fire_date:
                        temp_post_fire_date = item.datetime
                    elif item.datetime > temp_post_fire_date:
                        temp_post_fire_date = item.datetime
                post_fire_date = temp_post_fire_date.strftime('%Y%m%d')


                output_pre = f'{self.fire_year}-{fire_number}_pre_nbr.tif'
                output_post = f'{self.fire_year}-{fire_number}_post_nbr.tif'
                output_pre_rgb = f'{self.fire_year}-{fire_number}_pre_rgb.tif'
                output_post_rgb = f'{self.fire_year}-{fire_number}_post_rgb.tif'
                output_dnbr = f'{self.fire_year}-{fire_number}_dnbr.tif'
                output_scaled = f'{self.fire_year}-{fire_number}_scaled_dnbr.tif'
                output_barc = f'{self.fire_year}-{fire_number}_{pre_fire_date}_{post_fire_date}_{self.sensor}_barc.tif'
                output_filtered = f'{self.fire_year}-{fire_number}_{pre_fire_date}_{post_fire_date}_{self.sensor}_barc_filtered.tif'

                output_pre_nbr_path = os.path.join(self.output_folder, output_pre) if self.use_folder else None
                output_post_nbr_path = os.path.join(self.output_folder, output_post) if self.use_folder else None
                output_pre_rgb_path = os.path.join(self.export_folder, output_pre_rgb) if self.use_folder else None
                output_post_rgb_path = os.path.join(self.export_folder, output_post_rgb) if self.use_folder else None
                output_dnbr_path = os.path.join(self.output_folder, output_dnbr) if self.use_folder else None
                output_scaled_dnbr_path = os.path.join(self.output_folder, output_scaled) if self.use_folder else None
                output_barc_path = os.path.join(self.output_folder, output_barc) if self.use_folder else None
                output_filtered_path = os.path.join(self.export_folder, output_filtered) if self.use_folder else None
                os_pre_nbr_path = f'{self.os_output_folder}/{output_pre}' if self.use_storage else None
                os_post_nbr_path = f'{self.os_output_folder}/{output_post}' if self.use_storage else None
                os_pre_rgb_path = f'{self.os_export_folder}/{output_pre_rgb}' if self.use_storage else None
                os_post_rgb_path = f'{self.os_export_folder}/{output_post_rgb}' if self.use_storage else None
                os_dnbr_path = f'{self.os_output_folder}/{output_dnbr}' if self.use_storage else None
                os_scaled_dnbr_path = f'{self.os_output_folder}/{output_scaled}' if self.use_storage else None
                os_barc_path = f'{self.os_output_folder}/{output_barc}' if self.use_storage else None
                os_filtered_path = f'{self.os_export_folder}/{output_filtered}' if self.use_storage else None

                self.logger.info(f'Creating PRE-FIRE RGB')
                pre_rgb, pre_meta, pre_transform = stac.create_rgb_mosaic(pre_fire_items, perimeter_gdf, aws_requester_pays=False, target_crs=perimeter_gdf.crs, run_type='pre')
                if pre_rgb is None:
                    self.logger.error('Failed to create pre-fire RGB.')
                    return None
                self.logger.info('Pre-fire RGB creation successful.')

                self.logger.info('Writing pre-fire rgb to file')
                self.write_raster(data=pre_rgb, meta=pre_meta, folder_path=output_pre_rgb_path, os_path=os_pre_rgb_path)
                
                self.logger.info(f'Creating POST-FIRE RGB')
                post_rgb, post_meta, post_transform = stac.create_rgb_mosaic(post_fire_items, perimeter_gdf, aws_requester_pays=False, target_crs=perimeter_gdf.crs, run_type='post')
                if post_rgb is None:
                    self.logger.error('Failed to create post-fire RGB.')
                    return None
                self.logger.info('Post-fire RGB creation successful.')

                self.logger.info('Writing post-fire rgb to file')
                self.write_raster(data=post_rgb, meta=post_meta, folder_path=output_post_rgb_path, os_path=os_post_rgb_path)

                self.logger.info(f'Calculating PRE-FIRE NBR')
                pre_nbr, pre_meta, pre_transform = stac.create_nbr_mosaic(pre_fire_items, perimeter_gdf, aws_requester_pays=False, target_crs=perimeter_gdf.crs, run_type='pre')
                if pre_nbr is None:
                    self.logger.error('Failed to calculate pre-fire NBR.')
                    return None
                self.logger.info('Pre-fire NBR calculation successful.')

                self.logger.info('Writing pre-fire nbr to file')
                self.write_raster(data=pre_nbr, meta=pre_meta, folder_path=output_pre_nbr_path, os_path=os_pre_nbr_path)


                # 6. Calculate Post-fire NBR, aligning to the pre-fire grid
                self.logger.info(f'Calculating POST-FIRE NBR')
                target_shape_for_post = pre_nbr.shape # (1, height, width)
                target_crs_for_post = pre_meta['crs']
                target_transform_for_post = pre_transform

                post_nbr, post_meta, _ = stac.create_nbr_mosaic(
                    post_fire_items, 
                    perimeter_gdf,
                    target_transform=target_transform_for_post,
                    target_crs=target_crs_for_post,
                    target_shape=target_shape_for_post,
                    aws_requester_pays=False,
                    run_type='post'
                )
                if post_nbr is None:
                    self.logger.error('Failed to calculate post-fire NBR.')
                    return None
                self.logger.info('Post-fire NBR calculation successful.')

                self.logger.info('Writing post-fire nbr to file')
                self.write_raster(data=post_nbr, meta=post_meta, folder_path=output_post_nbr_path, os_path=os_post_nbr_path)

                # Ensure alignment before dNBR (should be guaranteed by calculate_nbr_for_item logic)
                if pre_nbr.shape != post_nbr.shape:
                    self.logger.error(f'CRITICAL ERROR: Pre-fire NBR shape {pre_nbr.shape} and Post-fire NBR shape {post_nbr.shape} '
                          'do not match despite alignment efforts. Cannot proceed with dNBR calculation.')
                    return None

                # 7. Calculate dNBR
                self.logger.info('Calculating dNBR (Pre-NBR - Post-NBR)')
                # dNBR = NBR_prefire - NBR_postfire. Values typically range from -2 to +2.
                # Often scaled by 1000 for easier interpretation in some contexts, but raw float is fine.
                dnbr = pre_nbr - post_nbr
                self.logger.info('dNBR calculation successful.')

                # 8. Save dNBR raster
                # The metadata for dNBR (transform, CRS, dimensions) should match the aligned NBRs (e.g., post_meta)
                dnbr_meta = post_meta.copy() # post_meta already reflects the aligned grid
                dnbr_meta.update({
                    "driver": "GTiff",
                    "dtype": "float32", # dNBR is float
                    "count": 1,
                    "nodata": np.nan # Ensure nodata is consistent
                })

                self.logger.info('Writing dnbr to file')
                self.write_raster(data=dnbr, meta=dnbr_meta, folder_path=output_dnbr_path, os_path=os_dnbr_path)

                
                # 8. Calculate scaled dNBR
                self.logger.info('Calculating scaled dNBR ((dNBR * 1000 + 275)/5)')
                # dNBR = NBR_prefire - NBR_postfire. Values typically range from -2 to +2.
                # Often scaled by 1000 for easier interpretation in some contexts, but raw float is fine.
                scaled_dnbr = (dnbr*1000 + 275)/5
                self.logger.info('** scaled dNBR calculation successful')

                s_dnbr_meta = post_meta.copy() # post_meta already reflects the aligned grid
                s_dnbr_meta.update({
                    "driver": "GTiff",
                    "dtype": "float32", # dNBR is float
                    "count": 1,
                    "nodata": np.nan # Ensure nodata is consistent
                })

                self.logger.info('Writing scaled dnbr to file')
                self.write_raster(data=scaled_dnbr, meta=s_dnbr_meta, folder_path=output_scaled_dnbr_path, os_path=os_scaled_dnbr_path)


                high_sev = np.where(scaled_dnbr >= 187, 4, 0)
                med_sev = np.where((scaled_dnbr >= 110) & (scaled_dnbr < 187), 3, 0)
                low_sev = np.where((scaled_dnbr >= 76) & (scaled_dnbr < 110), 2, 0)
                no_sev = np.where(scaled_dnbr < 76, 1, 0)
                barc = no_sev + low_sev + med_sev + high_sev

                s_class_meta = post_meta.copy() # post_meta already reflects the aligned grid
                s_class_meta.update({
                    "driver": "GTiff",
                    "dtype": "uint8", # dNBR is float
                    "count": 1,
                    "nodata": 0 # Ensure nodata is consistent
                })

                # try:
                self.logger.info('Writing barc to file')
                self.write_raster(data=barc.astype(np.uint8), meta=s_class_meta, folder_path=output_barc_path, os_path=os_barc_path)

                self.logger.info('Filtering barc to remove fragments less than 10 m2')
                barc_filter = sieve(source=barc.astype(np.uint8), size=10)

                filter_meta = s_class_meta.copy()
                filter_meta.update(
                    dtype=rasterio.uint8,
                    count=1,
                    compress='lzw'
                )


                self.logger.info('Writing filtered barc to file')
                self.write_raster(data=barc_filter.astype(np.uint8), meta=filter_meta, folder_path=output_filtered_path, os_path=os_filtered_path)

                return barc_filter, s_class_meta

    
            except Exception as e:
                # failed.append(firenumber)
                traceback.print_exc()
                err = ''.join(traceback.format_exc())
                params = os.path.join(self.output_folder,'errors.txt')
                with open(params, 'w') as f:
                     f.write(f'\n{err}')

    def conversion(self, barc, meta):
        try:
            lst_dfs = []

            # barc_name = os.path.basename(barc_tif)
            self.logger.info('Converting to polygon')

            results = ({'properties': {'raster_val': v}, 'geometry': s}
                        for i, (s, v) in enumerate(shapes(barc, mask=None, transform=meta['transform'])))

            geoms = list(results)
            gdf = gpd.GeoDataFrame.from_features(geoms, crs=meta['crs'])
            gdf = gdf.drop(gdf[gdf.raster_val > 4].index)
            gdf = gdf.rename({'raster_val': 'gridcode'}, axis=1)
            #FIRE_NUMBER
            f = 'FIRE_NUMBER'
            self.logger.info(f'    - adding {self.fire_number} to {f}')
            gdf[f] = self.fire_number
            self.logger.info('    - added fire number to feature class')
            #FIRE_YEAR
            f = 'FIRE_YEAR'
            self.logger.info(f'    - adding {self.fire_year} to {f}')
            gdf[f] = self.fire_year
            self.logger.info('    - added fire_year to feature class')
            #PRE_FIRE_IMAGE
            f = 'PRE_FIRE_IMAGE'
            # pre_fire_image_list = data_dict['pre_scenes']
            pre_fire_image = ','.join(self.dict_fires[self.fire_number].lst_pre_image)
            self.logger.info(f'    - adding {pre_fire_image} to {f}')
            gdf[f] = pre_fire_image
            self.logger.info('    - added pre img to feature class')
            #PRE_FIRE_IMAGE_DATE
            f = "PRE_FIRE_IMAGE_DATE"
            pre_img_date_str = ','.join([dt for dt in list(set(self.dict_fires[self.fire_number].lst_pre_dates))])
            self.logger.info(f'    - adding {pre_img_date_str} to {f}')
            gdf[f] = pre_img_date_str
            self.logger.info('    - added pre img date to feature class')
            #POST_FIRE_IMAGE
            f = 'POST_FIRE_IMAGE'
            # post_fire_image_list = data_dict['post_scenes']
            post_fire_image = ','.join(self.dict_fires[self.fire_number].lst_post_image)
            self.logger.info(f'    - adding {post_fire_image} to {f}')
            gdf[f] = post_fire_image
            self.logger.info('    - added post img to feature class')
            #POST_FIRE_IMAGE_DATE
            f = "POST_FIRE_IMAGE_DATE"
            post_img_date_str = ','.join([dt for dt in list(set(self.dict_fires[self.fire_number].lst_post_dates))])
            self.logger.info(f'    - adding {post_img_date_str} to {f}')
            gdf[f] = post_img_date_str
            self.logger.info('    - added post img date to feature class')
            #COMMENTS
            f = "COMMENTS"
            gdf[f] = ''
            gdf[self.fld_fire_status] = self.fire_status
            lst_dfs.append(gdf)

            f_gdf = gpd.GeoDataFrame(pd.concat(lst_dfs, ignore_index=True), crs=lst_dfs[0].crs)

            self.logger.info('    - Classifying severity')
            f_gdf['BURN_SEVERITY_RATING'] = f_gdf.apply(lambda x: self.classify_severity(x), axis=1)
            f_gdf = f_gdf.drop(['gridcode'], axis=1)

            self.logger.info('    - Dissolving geometries by severity rating')
            f_gdf =  f_gdf.dissolve(by=self.fld_burn_sev, as_index=False)
            s_gdf = f_gdf.to_crs('EPSG:3005')

            self.logger.info('    - Clipping to fire boundary')
            clip_gdf = gpd.clip(s_gdf, self.gdf_fires[self.gdf_fires[self.fld_fire_num] == self.fire_number])

            self.logger.info('    - Exploding to singlepart')
            gpdf_singlepoly = clip_gdf.explode()

            gpdf_singlepoly['AREA_HA'] = gpdf_singlepoly.geometry.area/10000
            gpdf_singlepoly['FEATURE_AREA_SQM'] = gpdf_singlepoly.geometry.area
            gpdf_singlepoly['FEATURE_LENGTH_M'] = gpdf_singlepoly.geometry.length

            self.logger.info('    - Projecting')
            gpdf_4326 = gpdf_singlepoly.to_crs(4326)
            # gpdf_4326.to_file(os.path.join(self.export_folder, f'{self.fire_number}_{gdb_name_final}.json'), 'GeoJSON')
            self.write_json(data=gpdf_4326, folder_path=self.export_folder, os_path=self.os_export_folder, file_name=f'{self.fire_year}-{self.fire_number}_interim_burn_severity.json')
            self.write_shapefile(data=gpdf_singlepoly, folder_path=self.export_folder, os_path=self.os_export_folder, file_name=f'{self.fire_year}-{self.fire_number}_interim_burn_severity.shp')
            self.write_pdf_map(bs_data=gpdf_singlepoly, perim_data=self.gdf_fires[self.gdf_fires[self.fld_fire_num] == self.fire_number], folder_path=self.export_folder,os_path=self.os_export_folder,file_name=f'{self.fire_year}-{self.fire_number}_interim_burn_severity.pdf')
            # gpdf_singlepoly.to_file(os.path.join(self.export_folder, f'{self.fire_number}_{gdb_name_final}.shp'))

            if self.use_folder:
                try:
                    #recalculate AREA_HA field
                    self.logger.info('Creating final geodatabase')

                    #copy final layer to a new database
                    gdb_name_final = f'interim_burn_severity_{self.fire_year}'

                    #create fgdb to hold outputs:
                    output_gdb_final = self.out_gdb.replace('_temp','')
                    final_gdf = gpd.read_file(filename=output_gdb_final, layer=gdb_name_final, driver='OpenFileGDB')
                    final_gdf = final_gdf.explode()
                    if (final_gdf == self.fire_number).any().any():
                        self.logger.info(f'{self.fire_number} exists in the database already, removing')
                        final_gdf = final_gdf[final_gdf[self.fld_fire_num] != self.fire_number]
                    final_gdf = pd.concat([final_gdf, gpdf_singlepoly])
                    final_gdf.to_file(filename=output_gdb_final, layer=gdb_name_final, driver="OpenFileGDB")
                except Exception as e:
                    gpdf_singlepoly.to_file(filename=output_gdb_final, layer=gdb_name_final, driver="OpenFileGDB")
        except Exception as e:
            self.logger.error(f'Error in conversion: {e} \n Traceback: {traceback.print_exc()}')
            return

        self.logger.info('Processing complete')

    def write_json(self, data: gpd.geodataframe, folder_path: str=None, os_path: str=None, file_name: str=None):
        self.logger.info('Writing GeoJSON')
        if folder_path and self.use_folder:
            try:
                data.to_file(os.path.join(folder_path, file_name), 'GeoJSON')
            except Exception as e:
                self.logger.error(f'Error writing local json file {os.path.join(folder_path, file_name)}: {e}')

       
        if self.use_storage and os_path:
            try:
                geojson_string = data.to_json()
                geojson_bytes = geojson_string.encode('utf-8')
                self.obj_storage.write_json(file_path=f'{os_path}/{file_name}', geo_json=geojson_bytes)
            except Exception as e:
                self.logger.error(f'Error writing object storage file {os_path}: {e}')    

    def write_shapefile(self, data: gpd.GeoDataFrame, folder_path: str=None, os_path: str=None, file_name: str=None):
        self.logger.info('Writing shapefile')
        temp_dir = None
        if folder_path and self.use_folder:
            out_path = os.path.join(folder_path, 'shapefile')
            if not os.path.exists(out_path):
                os.makedirs(out_path)
        else:
            temp_dir = tempfile.TemporaryDirectory()
            out_path = temp_dir.name

        data.to_file(os.path.join(out_path, file_name), driver='ESRI Shapefile')

        zip_buffer = BytesIO()

        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, _, files in os.walk(out_path):
                for f in files:
                    file_path = os.path.join(root, f)
                    arcname = os.path.relpath(file_path, out_path)
                    zf.write(file_path, arcname)

        if self.use_storage and os_path:
            try:
                zip_buffer.seek(0)
                self.obj_storage.write_shape(file_path=f'{os_path}/{file_name.replace(".shp", ".zip")}', zip_buffer=zip_buffer)

            except Exception as e:
                self.logger.error(f'Error writing object storage file {os_path}: {e}')
        if temp_dir:
            temp_dir.cleanup()

    def write_raster(self, data: np.ndarray, meta, folder_path: str=None, os_path: str=None):

        cog_profile = cog_profiles.get('deflate')
        try:
            with MemoryFile() as mem_src:
                with mem_src.open(**meta) as src_dataset:
                    try:
                        src_dataset.write(data)
                    except:
                        src_dataset.write_band(1, data.astype(rasterio.uint8))


                with MemoryFile() as mem_dst_cog:
                    cog_translate(mem_src, mem_dst_cog.name, cog_profile, in_memory=True, quiet=True)
                
                    mem_dst_cog.seek(0)
                    cog_bytes = mem_dst_cog.read()

                    try:
                        if self.use_folder and folder_path:
                            with open(folder_path, 'wb') as local_file:
                                local_file.write(cog_bytes)
                            self.logger.info(f'    - File written to local at {folder_path}')
                    except Exception as e:
                        self.logger.error(f'Error writing local file {folder_path}: {e}')

                    try:
                        if self.use_storage and os_path:
                            mem_dst_cog.seek(0)
                            self.obj_storage.write_image(file_path=os_path, raster=mem_dst_cog)
                            self.logger.info(f'    - File written to object storage at {os_path}')
                    except Exception as e:
                        self.logger.error(f'Error writing object storage file {os_path}: {e}')

        except Exception as e:
            self.logger.error(f'An unexpected error occured during COG creation: {e}')

    def write_pdf_map(self, bs_data: gpd.GeoDataFrame, perim_data: gpd.GeoDataFrame, folder_path: str=None, os_path: str=None,file_name: str=None, qgis_project: str='resources/bs-map.qgz') -> bool:
        '''
        writes pdf map to file or object storage

        '''
        self.logger.info('Writing pdf map')
        temp_folder = Path(os.getenv('TMPDIR','/tmp'))
        bs_file='fire_bs.geojson'
        perim_file='fire_perim.geojson'

        # setup paths 
        # TODO: Fix this logic to fit combinations of local and object storage exports
        if folder_path and self.use_folder:
            folder_path = Path(folder_path)
            output_geojson = folder_path.joinpath(bs_file)
            output_perim = folder_path.joinpath(perim_file)
            temp_pdf = temp_folder.joinpath(file_name)
        elif self.use_storage and os_path:
            output_geojson = temp_folder.joinpath(bs_file)
            output_perim = temp_folder.joinpath(perim_file)
            temp_pdf = temp_folder.joinpath(file_name)

        # export geojson for map layer new datasource
        bs_data.to_file(output_geojson, 'GeoJSON')
        assert os.path.exists(output_geojson), f'Failed to find exported burn severity geojson: {output_geojson}'

        perim_data.to_file(output_perim, 'GeoJSON')
        assert os.path.exists(output_perim), f'Failed to find exported fire perimeter geojson: {output_perim}'
     
        # create pdf map using qgis template
        result = bs_map_exporter(qgis_project=qgis_project,burn_severity_geojson=str(output_geojson), fire_perimeter_geojson=str(output_perim), 
                                 output=str(temp_pdf),layer_name='Burn Severity',layout_name='burnmap')
        
        # write bs pdf to objectstore
        if self.use_storage:
            with open(result, 'rb') as f:
                pdf_bytes = f.read()
            pdf_bites = BytesIO(pdf_bytes)
            obj_store_path = f'{os_path}/{file_name}'
            self.obj_storage.write_pdf(file_path=obj_store_path, pdf_buffer=pdf_bites)          
            self.logger.info(f'Exported pdf to object storage {obj_store_path}')
        else:
            self.logger.info(f'Exported pdf to {temp_pdf}')
        # cleanup
        if os.path.exists(output_geojson):
            os.remove(output_geojson)
        if os.path.exists(temp_pdf):
            os.remove(temp_pdf)
        return True


    @staticmethod
    def classify_severity(x):
        if x['gridcode'] == 0:
            return 'Unknown'
        elif x['gridcode'] == 1:
            return 'Unburned'
        elif x['gridcode'] == 2:
            return 'Low'
        elif x['gridcode'] == 3:
            return 'Medium'
        elif x['gridcode'] == 4:
            return 'High'
        

if __name__ == '__main__':
    run_app()
