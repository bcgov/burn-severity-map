
# map_robot.py

import os
import traceback
import math
import logging

# QGIS standalone setup for running on Docker Image
# from qgis.analysis import QgsNativeAlgorithms
# print("from qgis.analysis import QgsNativeAlgorithms... SUCCESS")
from qgis.core import QgsApplication
from qgis.core import QgsProject
from qgis.core import QgsLayoutExporter
from qgis.core import QgsCoordinateTransform
from qgis.core import QgsProcessingFeedback

from PyQt5.QtCore import *

# if processing tools are needed  
# sys.path.append('/usr/share/qgis/python/plugins')
# from processing.core.Processing import Processing
# import processing
# from processing.tools import dataobjects

# Initialize QGIS
# print("Attempting to initialize QGIS application...")
# feedback = QgsProcessingFeedback()
# QgsApplication.setPrefixPath("/usr", True)   
# qgs = QgsApplication([], False)
# qgs.initQgis()
# print("\t... Success")

# Add this if processing is required
# QgsApplication.processingRegistry().addProvider(QgsNativeAlgorithms())
# print ("Initializing processing")
# Processing.initialize()

class QGIS:
    def __init__(self, logger: logging.Logger):
        self.logger = logger

        try:
            self.logger.info('Initializing qgis application')
            self.feedback = QgsProcessingFeedback()
            QgsApplication.setPrefixPath('/usr', True)

            self.qgs = QgsApplication([], False)
            self.qgs.initQgis()
            self.qgs_project = QgsProject.instance()
            self.logger.info('Qgis initialized')
        except Exception as e:
            self.logger.error(f'Could not initialize Qgis: {e} \n Traceback: {traceback.print_exc()}')
            return None

    def __del__(self):
        try:
            self.logger.info('Shutting down Qgis')
            self.qgs.exitQgis()
        except:
            pass


    def export_map(self, qgis_project:str, burn_severity_geojson:str, fire_perimeter_geojson:str, output:str, layer_name:str = 'Burn Severity', layout_name='burnmap') -> str:


        """
        Updates a QGIS project with a new burn severity GeoJSON layer, adjusts the map extent,
        and exports the specified layout to a PDF.

        Parameters:
            qgis_project (str): Path to the QGIS project file (.qgz or .qgs).
            burn_severity_geojson (str): Path to the burn severity GeoJSON file to be used as the data source.
            output (str): Path where the exported PDF will be saved.
            layer_name (str, optional): Name of the layer to update with the new data source. Defaults to 'bs'.
            layout_name (str, optional): Name of the layout to export. Defaults to 'burnmap'.

        Returns:
            str: Path to the exported PDF file.

        Raises:
            AssertionError: If the specified layout is not found in the project.
        """
        try:
            self.logger.info(f'Opening qgs project {os.path.basename(qgis_project)}')
            self.qgs_project.read(qgis_project)

            self.logger.info('Setting fire perimeter')
            layers = self.qgs_project.mapLayersByName('Fire Perimeter')
            layers[0].setDataSource(dataSource=fire_perimeter_geojson)

            # update bs datasouce
            self.logger.info('Setting burn severity')
            layers = self.qgs_project.mapLayersByName(layer_name)
            layers[0].setDataSource(dataSource=burn_severity_geojson)

            self.logger.info('Calcualting new extent')
            # get new extent in project crs, grow by 10%    
            sourceCrs = layers[0].crs()
            destCrs = self.qgs_project.crs()
            tr = QgsCoordinateTransform(sourceCrs, destCrs, QgsProject.instance())

            # calculate new extent
            new_extent = tr.transformBoundingBox(layers[0].extent())
            growby = max([int(new_extent.height()),int(new_extent.width())])/10
            new_extent.grow(growby)

            # get layout
            self.logger.info('Setting up layout')
            manager = self.qgs_project.layoutManager()
            layout = manager.layoutByName(layout_name)
            if layout is None:
                self.logger.error(f'Layout {layout_name} is not found')
                return None

            # update map extent
            self.logger.info('Updating map extent')
            ref_map = layout.referenceMap()
            ref_map.zoomToExtent(new_extent)
            scale = ref_map.scale()
            new_scale = math.ceil(scale/5000)*5000 #up scale value to nearest 5,000
            ref_map.setScale(new_scale)
            layout.refresh()

            # export'o-rama
            self.logger.info('Exporting map')
            exporter = QgsLayoutExporter(layout)
            pdf_settings = QgsLayoutExporter.PdfExportSettings()
            pdf_settings.dpi = 300
            pdf_settings.exportMetadata = False
            exporter.exportToPdf( output ,pdf_settings)

            self.qgs_project.clear()

            return output
        except Exception as e:
            self.logger.error(f'Error in generating the map: {e} \n Traceback: {traceback.print_exc()}')
            try:
                self.qgs_project.clear()
            except:
                pass
            return None


    
