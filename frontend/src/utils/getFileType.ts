// getFileType.ts
export type FileType =
  | 'pdf'
  | 'word'
  | 'excel'
  | 'csv'
  | 'text'
  | 'image'
  | 'zip'
  | 'json'
  | 'geojson'
  | 'shapefile'
  | 'kml'
  | 'unknown';

/**
 * Returns a normalized file type string based on the filename extension.
 * @param filename The full name of the file (with extension)
 */
export function getFileType(filename: string): FileType {
  if (!filename || !filename.includes('.')) return 'unknown';

  const ext = filename.split('.').pop()!.toLowerCase();

  switch (ext) {
    // Documents
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
      return 'excel';
    case 'csv':
      return 'csv';
    case 'txt':
    case 'rtf':
      return 'text';

    // Images
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'tif':
    case 'tiff':
      return 'image';

    // Archives
    case 'zip':
    case 'rar':
    case '7z':
      return 'zip';

    // Data / GIS formats
    case 'json':
      return 'json';
    case 'geojson':
      return 'geojson';
    case 'shp':
      return 'shapefile';
    case 'kml':
    case 'kmz':
      return 'kml';

    default:
      return 'unknown';
  }
}