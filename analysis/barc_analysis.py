
from datetime import datetime, timedelta
from argparse import ArgumentParser
import logging
import os, sys, shutil, traceback
import numpy as np
from collections import defaultdict
import rasterio
from rasterio.features import shapes
import rasterio.features
import topojson as tp
from rio_cogeo.profiles import cog_profiles
from rio_cogeo.cogeo import cog_translate

from util.environment import Environment
from util.classes import ImageMetadata, Fire
from util.wfs import WFS
from util.stac import STAC


import geopandas as gpd
import pandas as pd
import warnings
warnings.filterwarnings('ignore')



def run_app():
    fire, year, sensor, output_folder, object_storage, s_date, e_date, cloud, logger = get_input_parameters()
    burn_sev = InterimBurnSeverity(fire=fire, year=year, output_folder=output_folder, object_storage=object_storage, sensor=sensor, 
                                   start_date=s_date, end_date=e_date, cloud_cover=cloud, logger=logger)

    result = burn_sev.gather_spatial()
    if not result:
        return
    burn_sev.calculate_severity()
    burn_sev.conversion()

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
        parser.add_argument('--log_level', default='INFO', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                            help='Log level')
        parser.add_argument('--log_dir', help='Path to log directory')

        args = parser.parse_args()
        if not args.output_folder and not args.object_storage:
            raise ValueError('An output folder and/or and the object storage folder must be indicated.  Use the -f and -o flags')

        logger = Environment.setup_logger(args)

        return args.fire, args.year, args.sensor, args.output_folder, args.object_storage, args.s_date, args.e_date, args.cloud, logger

    except ValueError as v:
        logging.error(f'Value Error: Missing arguments - {v}')
        sys.exit(1)

    except Exception as e:
        logging.error(f'Unexpected exception. Program terminating: {e}')
        sys.exit(1)

class InterimBurnSeverity:
    def __init__(self, fire: str, year: str, sensor: str='S2', output_folder: str=None, object_storage: bool=False, start_date:str=None, end_date: str=None, 
                 cloud_cover: str='10', logger:logging.Logger=None) -> None:
        self.fire_number = fire
        self.fire_year = int(year)
        self.use_storage = object_storage
        self.out_folder = output_folder
        self.fire_folder = os.path.join(self.out_folder, f'{self.fire_year}-{self.fire_number}')
        self.output_folder = os.path.join(self.fire_folder, 'output')
        self.vector_folder = os.path.join(self.fire_folder, 'vectors')
        self.export_folder = os.path.join(self.fire_folder, 'export')
        self.barc_folder = os.path.join(self.output_folder, 'barc')
        self.out_gdb = os.path.join(self.export_folder, f'interim_burn_severity_temp.gdb')
        self.start_date = None if not start_date else datetime.strptime(str(start_date).split(' ')[0], '%Y-%m-%d')
        self.end_date = None if not end_date else datetime.strptime(str(end_date).split(' ')[0], '%Y-%m-%d')
        self.cloud_cover = float(cloud_cover)
        self.logger = logger
        self.fire_status = ''
        self.sensor = sensor

        self.S3_ENDPOINT = os.getenv('S3_ENDPOINT')
        self.S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
        self.S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')
        self.S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

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

        for fld in [self.output_folder, self.export_folder]:
            if os.path.exists(fld):
                shutil.rmtree(fld)
            os.makedirs(fld)
        if not os.path.exists(self.vector_folder):
            os.makedirs(self.vector_folder)

        if not os.path.exists(self.barc_folder):
            os.makedirs(self.barc_folder)


    def __del__(self) -> None:
        pass

    def get_fire(self, ds_poly: str, ds_point:str, fire_sql: str, poly_fields: list, point_fields) -> tuple:
        fires = WFS.get_data(dataset=ds_poly, query=fire_sql, fields=poly_fields)
        gdf_fires = gpd.GeoDataFrame.from_features(features=fires, crs=3005)
        gdf_fires.drop(columns=gdf_fires.columns.difference(poly_fields + ['geometry']), axis=1, inplace=True)
        
        int_fire_count = gdf_fires.shape[0]
        if int_fire_count != 0:

            fire_points = WFS.get_data(dataset=ds_point, query=fire_sql, fields=point_fields)
            gdf_points = gpd.GeoDataFrame.from_features(features=fire_points, crs=3005)
            gdf_points.drop(columns=gdf_points.columns.difference(self.lst_fire_point_fields), axis=1, inplace=True)
            gdf_points[self.fld_fire_ign_date] = pd.to_datetime(gdf_points[self.fld_fire_ign_date], format='%Y-%m-%dZ')
            gdf_points[self.fld_fire_out_date] = pd.to_datetime(gdf_points[self.fld_fire_out_date], format='%Y-%m-%dZ')
            gdf_fires = gdf_fires.merge(gdf_points, on=self.fld_fire_num)

            if int_fire_count > 1:
                gdf_fires = gdf_fires.dissolve()
                int_fire_count = gdf_fires.shape[0]
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
            if not self.end_date:
                if not self.bl_historical:
                    self.fire_status = self.gdf_fires.at[i, self.fld_fire_status]
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

        self.logger.info(f'Fire {self.fire_number} ignited on {str_ign_date} and was extinguished on {str_out_date}')

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


    def conversion(self):

        barc_path = self.barc_folder
        i = self.getfiles(barc_path,'.tif', self.fire_number)[0]
        out_name = os.path.basename(i)
        out_cog_name = os.path.splitext(os.path.basename(i))[0] + '_cog.tif'
        barc_tif = os.path.join(self.export_folder, out_name)
        out_cog = os.path.join(self.export_folder, out_cog_name)

        del_barc = self.getfiles(self.export_folder,'.tif', self.fire_number)
        if del_barc:
            for b in del_barc:
                os.remove(b)

        self.barc_filter(i,barc_tif)

        cog_profile = cog_profiles.get("deflate")

        # Translate the input GeoTIFF to a COG
        cog_translate(
            barc_tif,  # Input GeoTIFF file path
            out_cog,  # Output COG file path
            cog_profile,  # COG profile to use
            overview_resampling="nearest", # Resampling method for overviews
            overview_level=5, # Number of overview levels to generate
            quiet=True
        )


        lst_dfs = []
    
        barc_name = os.path.basename(barc_tif)
        self.logger.info(f'converting {barc_name} to polygon')
        fire_number = barc_name.rsplit('_')[1]
        pre_img = barc_name.rsplit('_')[2]
        post_img = barc_name.rsplit('_')[3]
        
        with rasterio.Env():
            with rasterio.open(barc_tif) as src:
                image = src.read(1)
                crs = src.crs
                results = (
                    {'properties': {'raster_val': v}, 'geometry': s}
                    for i, (s, v) in enumerate(shapes(image, mask=None, transform=src.transform))
                )
        geoms = list(results)
        gdf = gpd.GeoDataFrame.from_features(geoms, crs=crs)
        gdf = gdf.drop(gdf[gdf.raster_val > 4].index)
        gdf = gdf.rename({'raster_val': 'gridcode'}, axis=1)
        #FIRE_NUMBER
        f = 'FIRE_NUMBER'
        gdf[f] = fire_number
        self.logger.info('    - added fire number to feature class')
        #FIRE_YEAR
        f = 'FIRE_YEAR'
        gdf[f] = self.fire_year
        self.logger.info('    - added fire_year to feature class')
        #PRE_FIRE_IMAGE
        f = 'PRE_FIRE_IMAGE'
        # pre_fire_image_list = data_dict['pre_scenes']
        pre_fire_image = ','.join(self.dict_fires[self.fire_number].lst_pre_image)
        gdf[f] = pre_fire_image
        self.logger.info('    - added pre img to feature class')
        #PRE_FIRE_IMAGE_DATE
        f = "PRE_FIRE_IMAGE_DATE"
        pre_img_date_str = pre_img[0:4] + '-' + pre_img[4:6] + '-' + pre_img[6:8]
        gdf[f] = pre_img_date_str
        self.logger.info('    - added pre img date to feature class')
        #POST_FIRE_IMAGE
        f = 'POST_FIRE_IMAGE'
        # post_fire_image_list = data_dict['post_scenes']
        post_fire_image = ','.join(self.dict_fires[self.fire_number].lst_post_image)
        gdf[f] = post_fire_image
        self.logger.info('    - added post img to feature class')
        #POST_FIRE_IMAGE_DATE
        f = "POST_FIRE_IMAGE_DATE"
        post_img_date_str = post_img[0:4] + '-' + post_img[4:6] + '-' + post_img[6:8]
        gdf[f] = post_img_date_str
        self.logger.info('    - added post img date to feature class')
        #COMMENTS
        f = "COMMENTS"
        gdf[f] = ''
        gdf[self.fld_fire_status] = self.fire_status
        lst_dfs.append(gdf)

        f_gdf = gpd.GeoDataFrame(pd.concat(lst_dfs, ignore_index=True), crs=lst_dfs[0].crs)


        f_gdf['BURN_SEVERITY_RATING'] = f_gdf.apply(lambda x: self.classify_severity(x), axis=1)
        f_gdf = f_gdf.drop(['gridcode'], axis=1)


        #recalculate AREA_HA field
        self.logger.info('Creating final geodatabase')

        #copy final layer to a new database
        gdb_name_final = f'interim_burn_severity_{self.fire_year}'

        #create fgdb to hold outputs:
        output_gdb_final = self.out_gdb.replace('_temp','')

        topo = tp.Topology(f_gdf, prequantize=True)
        s_gdf = topo.toposimplify(1).to_gdf().to_crs('EPSG:3005')
        clip_gdf = gpd.clip(s_gdf, self.gdf_fires[self.gdf_fires[self.fld_fire_num] == fire_number])

        gpdf_singlepoly = clip_gdf.explode()

        gpdf_singlepoly['AREA_HA'] = gpdf_singlepoly.geometry.area/10000
        gpdf_singlepoly['FEATURE_AREA_SQM'] = gpdf_singlepoly.geometry.area
        gpdf_singlepoly['FEATURE_LENGTH_M'] = gpdf_singlepoly.geometry.length

        gpdf_4326 = gpdf_singlepoly.to_crs(4326)
        gpdf_4326.to_file(os.path.join(self.export_folder, f'{self.fire_number}_{gdb_name_final}.json'), 'GeoJSON')
        gpdf_singlepoly.to_file(os.path.join(self.export_folder, f'{self.fire_number}_{gdb_name_final}.shp'))

        try:
            final_gdf = gpd.read_file(filename=output_gdb_final, layer=gdb_name_final, driver='OpenFileGDB')
            final_gdf = final_gdf.explode()
            if (final_gdf == self.fire_number).any().any():
                self.logger.info(f'{self.fire_number} exists in the database already, removing')
                final_gdf = final_gdf[final_gdf[self.fld_fire_num] != self.fire_number]
            final_gdf = pd.concat([final_gdf, gpdf_singlepoly])
            final_gdf.to_file(filename=output_gdb_final, layer=gdb_name_final, driver="OpenFileGDB")
        except Exception as e:
            gpdf_singlepoly.to_file(filename=output_gdb_final, layer=gdb_name_final, driver="OpenFileGDB")

        self.logger.info('Processing complete')

    
    def calculate_severity(self):

        lst_fires = self.gdf_fires[self.fld_fire_num].tolist()
        for fire_number in lst_fires:
            try:
                #Load in shapefile
                perimeter_gdf = self.gdf_fires[self.gdf_fires[self.fld_fire_num] == fire_number]
                output_pre_nbr_path = os.path.join(self.output_folder, fire_number +'_pre_nbr.tif')
                output_post_nbr_path = os.path.join(self.output_folder, fire_number +'_post_nbr.tif')
                output_dnbr_path = os.path.join(self.output_folder, fire_number +'_dnbr.tif')
                output_scaled_dnbr_path = os.path.join(self.output_folder, fire_number +'_scaled_dnbr.tif')
                perimeter_gdf['geometry'] = perimeter_gdf.geometry.buffer(500)

                pre_fire_date = ''
                post_fire_date = ''

                pre_fire_item = STAC.search_stac(self, sensor=self.sensor, bbox=perimeter_gdf.to_crs('EPSG:4326').total_bounds, daterange=self.dict_fires[self.fire_number].get_pre_date_range(),cloud_cover_threshold=self.cloud_cover)
                if not pre_fire_item:
                    self.logger.error('Could not find suitable pre-fire imagery. Try adjusting date range or cloud cover threshold.')
                    return None
                self.dict_fires[self.fire_number].lst_pre_image.append(pre_fire_item.id)
                self.logger.info(f"Found PRE-FIRE scene: {pre_fire_item.id} (Date: {pre_fire_item.datetime}, Cloud: {pre_fire_item.properties.get('eo:cloud_cover', 'N/A'):.2f}%)")
                pre_fire_date = pre_fire_item.datetime.strftime('%Y%m%d')

                post_fire_item = STAC.search_stac(self, sensor=self.sensor, bbox=perimeter_gdf.to_crs('EPSG:4326').total_bounds, daterange=self.dict_fires[self.fire_number].get_post_date_range(),cloud_cover_threshold=self.cloud_cover)
                if not post_fire_item:
                    self.logger.error('Could not find suitable post-fire imagery. Try adjusting date range or cloud cover threshold.')
                    return None
                self.dict_fires[self.fire_number].lst_post_image.append(post_fire_item.id)
                self.logger.info(f"Found POST-FIRE scene: {post_fire_item.id} (Date: {post_fire_item.datetime}, Cloud: {post_fire_item.properties.get('eo:cloud_cover', 'N/A'):.2f}%)")
                post_fire_date = post_fire_item.datetime.strftime('%Y%m%d')

                self.logger.info(f'Calculating PRE-FIRE NBR for scene {pre_fire_item.id}')
                pre_nbr, pre_meta, pre_transform = STAC.calculate_nbr_for_item(self, pre_fire_item, perimeter_gdf, aws_requester_pays=False, target_crs=perimeter_gdf.crs, run_type='pre')
                if pre_nbr is None:
                    self.logger.error('Failed to calculate pre-fire NBR.')
                    return None
                self.logger.info('Pre-fire NBR calculation successful.')
                # Save Pre-fire NBR if path provided
                if output_pre_nbr_path:
                    try:
                        with rasterio.open(output_pre_nbr_path, 'w', **pre_meta) as dst:
                            dst.write(pre_nbr.astype(np.float32))
                        self.logger.info(f'Pre-fire NBR saved to: {output_pre_nbr_path}')
                    except Exception as e:
                        self.logger.error(f'Error saving Pre-fire NBR GeoTIFF: {e}')

                # 6. Calculate Post-fire NBR, aligning to the pre-fire grid
                self.logger.info(f'Calculating POST-FIRE NBR for scene {post_fire_item.id} (aligning to pre-fire grid)')
                target_shape_for_post = pre_nbr.shape # (1, height, width)
                target_crs_for_post = pre_meta['crs']
                target_transform_for_post = pre_transform

                post_nbr, post_meta, _ = STAC.calculate_nbr_for_item(self,
                    post_fire_item, 
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
                # Save Pre-fire NBR if path provided
                if output_post_nbr_path:
                    try:
                        with rasterio.open(output_post_nbr_path, 'w', **post_meta) as dst:
                            dst.write(post_nbr.astype(np.float32))
                        self.logger.info(f'Post-fire NBR saved to: {output_post_nbr_path}')
                    except Exception as e:
                        self.logger.error(f'Error saving Post-fire NBR GeoTIFF: {e}')

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

                try:
                    with rasterio.open(output_dnbr_path, 'w', **dnbr_meta) as dst:
                        dst.write(dnbr.astype(np.float32)) # dnbr is (1, height, width)
                    self.logger.info(f'dNBR GeoTIFF successfully saved to: {output_dnbr_path}')
                    # return output_dnbr_path
                except Exception as e:
                    self.logger.error(f'Error saving dNBR GeoTIFF to \'{output_dnbr_path}\': {e}')
                    return None
                
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

                try:
                    with rasterio.open(output_scaled_dnbr_path, 'w', **s_dnbr_meta) as dst:
                        dst.write(scaled_dnbr.astype(np.float32)) # dnbr is (1, height, width)
                    self.logger.info(f'dNBR scaled GeoTIFF successfully saved to: {output_scaled_dnbr_path}')
                    # return output_dnbr_path
                except Exception as e:
                    self.logger.error(f'Error saving dNBR scaled GeoTIFF to \'{output_scaled_dnbr_path}\': {e}')
                    return None

                high_sev = np.where(scaled_dnbr >= 187, 4, 0)
                med_sev = np.where((scaled_dnbr >= 110) & (scaled_dnbr < 187), 3, 0)
                low_sev = np.where((scaled_dnbr >= 76) & (scaled_dnbr < 110), 2, 0)
                no_sev = np.where(scaled_dnbr < 76, 1, 0)
                classes = no_sev + low_sev + med_sev + high_sev

                s_class_meta = post_meta.copy() # post_meta already reflects the aligned grid
                s_class_meta.update({
                    "driver": "GTiff",
                    "dtype": "uint8", # dNBR is float
                    "count": 1,
                    "nodata": 0 # Ensure nodata is consistent
                })

                try:
                    out_barc_file = 'BARC_' + fire_number + '_' + pre_fire_date + '_' + post_fire_date + '_S2.tif'
                    output_classified_dnbr_path = os.path.join(self.barc_folder, out_barc_file)
                    with rasterio.open(output_classified_dnbr_path, 'w', **s_class_meta) as dst:
                        dst.write(classes.astype(np.uint8)) # dnbr is (1, height, width)
                    self.logger.info(f'dNBR classified GeoTIFF successfully saved to: {output_classified_dnbr_path}')
                    return output_classified_dnbr_path
                except Exception as e:
                    self.logger.error(f'Error saving classified dNBR GeoTIFF to \'{output_classified_dnbr_path}\': {e}')
                    return None

    
            except Exception as e:
                # failed.append(firenumber)
                traceback.print_exc()
                err = ''.join(traceback.format_exc())
                params = os.path.join(self.output_folder,'errors.txt')
                with open(params, 'w') as f:
                     f.write(f'\n{err}')


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
       

    @staticmethod
    def barc_filter(reclassed_raster,out_raster):

        src_ds = rasterio.open(reclassed_raster, dtype=rasterio.uint8)
        out_ds = None
        out_ds = rasterio.features.sieve(source=src_ds, size=10)

        kwargs = src_ds.meta
        kwargs.update(
            dtype=rasterio.uint8,
            count=1,
            compress='lzw'
        )

        with rasterio.open(out_raster, 'w', **kwargs) as dst:
            dst.write_band(1, out_ds.astype(rasterio.uint8))


    @staticmethod
    def getfiles(d, ext, fire):
        paths = []
        for file in os.listdir(d):
            #if file.endswith(ext) and not file.endswith('_clip.tif'):
            if file.endswith(ext) and fire in file and 'raw' not in file and 'scale' not in file:
                paths.append(os.path.join(d, file))
        return(paths)    
        

if __name__ == '__main__':
    run_app()
