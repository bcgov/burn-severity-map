# FASTAPI-SQLALCHEMY with PostGIS example

## endpoints

post --> post a burn severity record
---
/burn-records
---
get --> Return all burn severity records 
---
/burn-records

# postgis
requires environment variables  
---
DB_HOST
DB_PORT
POSTGIS_USER
POSTGIS_PASS

# running the api
modifiy and rename .env-example to include environment variables that match your postgis instance
```
source .env
uv run uvicorn main:app --reload
```
Your API will be running at http://127.0.0.1:8000/api.
Interactive API documentation (Swagger UI): http://127.0.0.1:8000/docs
Alternative documentation (ReDoc): http://127.0.0.1:8000/redoc

## sample feature
```
{
  "fire_number": "N51069",
  "pre_image_date": "2024-07-12",
  "post_image_date": "2024-08-06",
  "severity_class": "High",
  "geom_wkt": "MultiPolygon (((-117.44109634180421153 49.72885111158496585, -117.44200533199419567 49.7291197484678591, -117.44086578588570546 49.72936474100085746, -117.44105962277185995 49.72988889749336039, -117.44194590176063286 49.73056779954423234, -117.44065905424523066 49.73088750741602837, -117.43979349332256845 49.73084176368821829, -117.43871720025227035 49.73040225551972782, -117.43876882903670378 49.72999135504534962, -117.44002038345411165 49.72940396312223044, -117.44046965712325914 49.72915721104781284, -117.44094658744198512 49.72893336253378749, -117.44109634180421153 49.72885111158496585)))"
}
```