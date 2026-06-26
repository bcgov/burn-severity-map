import pdfIcon from '../assets/pdf_icon.png';
import shpIcon from '../assets/shp_icon.png';
import tifIcon from '../assets/tif_icon.png';
import jsIcon from '../assets/js_icon.png';
import fileIcon from '../assets/file_icon.png';


export type FileName = 
  | 'BARC Final (Filtered)'
  | 'BARC Vector GeoJSON'
  | 'BARC Vector Shapefile'
  | 'Burn Severity Map'
  | 'BARC Unfiltered'
  | 'Differenced Normalized Burn Ratio (dNBR)'
  | 'Scaled dNBR'
  | 'Pre-fire Normalized Burn Ratio (NBR)'
  | 'Post-fire Normalized Burn Ratio (NBR)'
  | 'Pre-fire RGB'
  | 'Post-fire RGB'


const EXTENSION_MAP: Record<string, any> = {
  pdf: pdfIcon,
  doc: fileIcon, docx: fileIcon,
  xls: fileIcon, xlsx: fileIcon,
  csv: fileIcon,
  txt: fileIcon, rtf: fileIcon,
  jpg: fileIcon, jpeg: fileIcon, png: fileIcon, gif: fileIcon, svg: fileIcon, tif: tifIcon, tiff: tifIcon,
  zip: shpIcon, rar: fileIcon, '7z': fileIcon,
  json: jsIcon,
  geojson: jsIcon,
  shp: shpIcon,
  kml: fileIcon, kmz: fileIcon
};

const FILE_NAME_MAP: { token: string; displayName: FileName }[] = [
  // Specific raster products
  { token: 'barc_filtered', displayName: 'BARC Final (Filtered)' },
  { token: 'scaled_dnbr',   displayName: 'Scaled dNBR' },
  { token: 'dnbr',          displayName: 'Differenced Normalized Burn Ratio (dNBR)' },
  { token: 'pre_nbr',       displayName: 'Pre-fire Normalized Burn Ratio (NBR)' },
  { token: 'post_nbr',      displayName: 'Post-fire Normalized Burn Ratio (NBR)' },
  { token: 'pre_rgb',       displayName: 'Pre-fire RGB' },
  { token: 'post_rgb',      displayName: 'Post-fire RGB' },
  
  // Base BARC raster (placed below barc_filtered so it doesn't shadow it)
  { token: 'barc',          displayName: 'BARC Unfiltered' },

  // Interim vector/map deliverables (explicitly targeting the extension + base name)
  { token: 'interim_burn_severity.json', displayName: 'BARC Vector GeoJSON' },
  { token: 'interim_burn_severity.pdf',  displayName: 'Burn Severity Map' },
  { token: 'interim_burn_severity.zip',  displayName: 'BARC Vector Shapefile' }
];



/**
 * Returns a normalized file type string based on the filename extension.
 * @param filename The full name of the file (with extension)
 */
export function getFileIcon(filename: string): any {
  if (!filename || !filename.includes('.')) return fileIcon;

  const ext = filename.split('.').pop()!.toLowerCase();
  return EXTENSION_MAP[ext] || fileIcon;

  // switch (ext) {
  //   // Documents
  //   case 'pdf':
  //     return 'pdf';
  //   case 'doc':
  //   case 'docx':
  //     return 'word';
  //   case 'xls':
  //   case 'xlsx':
  //     return 'excel';
  //   case 'csv':
  //     return 'csv';
  //   case 'txt':
  //   case 'rtf':
  //     return 'text';

  //   // Images
  //   case 'jpg':
  //   case 'jpeg':
  //   case 'png':
  //   case 'gif':
  //   case 'svg':
  //   case 'tif':
  //   case 'tiff':
  //     return 'image';

  //   // Archives
  //   case 'zip':
  //   case 'rar':
  //   case '7z':
  //     return 'zip';

  //   // Data / GIS formats
  //   case 'json':
  //     return 'json';
  //   case 'geojson':
  //     return 'geojson';
  //   case 'shp':
  //     return 'shapefile';
  //   case 'kml':
  //   case 'kmz':
  //     return 'kml';

  //   default:
  //     return 'unknown';
  // }
}


export function getFileName(filename: string): FileName | string {
  const match = FILE_NAME_MAP.find(m => filename.includes(m.token));
  return match ? match.displayName : filename;
}

