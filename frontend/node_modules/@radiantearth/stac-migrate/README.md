# stac-migrate

A library to update STAC files to the latest version (**1.1.0** at the moment of writing).
Supports updating **STAC versions 0.6.0 and later**.

Version of this library: **2.0.2**

## Usage

### JavaScript / Node

Add to your project with `npm install @radiantearth/stac-migrate --save`

Import the library: `const Migrate = require('@radiantearth/stac-migrate');`

* Migrate (auto-detection): `Migrate.stac(stac: object, updateVersionNumber: boolean = true) => object`<br />
  *This method does not migrate the Commons extension - use `Migrate.item` if you have used the Commons extension.*
* Migrate a STAC Collection: `Migrate.collection(collection: object, updateVersionNumber: boolean = true) => object`
* Migrate a STAC Catalog: `Migrate.catalog(catalog: object, updateVersionNumber: boolean = true) => object`
* Migrate a STAC Item: `Migrate.item(item: object, collection: object = null, updateVersionNumber: boolean = true) => object`
  
  *The `collection` parameter is only required to migrate the Commons extension. Otherwise, you don't need to pass this paramater.*
* Migrate a STAC CollectionCollection: `Migrate.collectionCollection(apiCollections: object, updateVersionNumber: boolean = true) => object`
* Migrate a STAC ItemCollection: `Migrate.itemCollection(apiItems: object, updateVersionNumber: boolean = true) => object`

**Note:** All changes will be applied in-place! If you don't want the input object to change, make a deep clone before. If you don't have a library which supports this (e.g. [lodash](https://lodash.com/docs/4.17.15#cloneDeep)) you can simply use `var clone = JSON.parse(JSON.stringify(object));`.

### CLI

You can also use the CLI to migrate a single file.
The commands follow the different methods above and has the same "restrictions" as above.

* Migrate (auto-detection, override): `npx stac-migrate <source_path>`
* Migrate (auto-detection, save to a different file with 4 spaces indentation): `npx stac-migrate <source_path> --dest <dest_path> --indent 4`
* Migrate a STAC Collection: `npx stac-migrate <source_path> <dest_path> --collection`
* Migrate a STAC Catalog: `npx stac-migrate <source_path> <dest_path> --catalog`
* Migrate a STAC Item: `npx stac-migrate <source_path> <dest_path> --item --collection_path <collection_path>`
* Migrate a STAC Item Collection: `npx stac-migrate <source_path> <dest_path> --item_collection`
* Migrate a STAC Collection Collection: `npx stac-migrate <source_path> <dest_path> --collecions`

## Supported Extensions

* Checksum (legacy, use `Migrate.enableMultihash(require('multihashes'))` to enable conversion from pre-0.9 checksums - disabled by default to keep the bundle size low)
* Classification 2.0.0
* Collection Assets (legacy)
* Commons (legacy)
* Data Cube 2.2.0
* Datetime Range (legacy)
* Electro-Optical 2.0.0
* File 2.1.0 (and 1.0.0 for `nodata`)
* Item Asset Definition 1.0.0 (legacy)
* Label 1.0.1
* Point Cloud 1.0.0
* Processing 1.2.0
* Projection 2.0.0
* Raster 2.0.0
* SAR 1.0.0
* Satellite 1.0.0
* Scientific Citation 1.0.0
* Single Item
* Table 1.2.0
* Timestamps 1.1.0
* Versioning Indicators 1.2.0
* View Geometry 1.0.0

## Development

Run the tests: `npm test`
