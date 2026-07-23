import httpx
import time
from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix='/fires', tags=['fires'])

CURRENT_POINTS = 'pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP'
CURRENT_POLYS = 'pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP'
HISTORIC_POINTS = 'pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_HISTORICAL_INCIDENTS_SP'
HISTORIC_POLYS = 'pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_HISTORICAL_FIRE_POLYS_SP'

WFS_BASE_URL = 'https://openmaps.gov.bc.ca/geo/pub/ows'
CACHE_TTL_SECONDS = 300

_cache: Dict[str, Dict[str, Any]] = {}

http_client = httpx.AsyncClient(timeout=45.0)

async def fetch_wfs_features(
        layer_name: str,
        cql_filter: Optional[str] = None,
        fields: Optional[List[str]] = None,
        srs_name: str = 'EPSG:3857'
) -> dict:
    page_size = 10000
    params: Dict[str, Any] = {
        'service': 'WFS',
        'version': '2.0.0',
        'request': 'GetFeature',
        'typeName': layer_name,
        'outputFormat': 'json',
        'srsName': srs_name
    }

    if cql_filter:
        params['CQL_FILTER'] = cql_filter
    if fields:
        params['propertyName'] = ','.join(fields)

    try:
        response = await http_client.get(WFS_BASE_URL, params=params)
        response.raise_for_status()
        res_data = response.json()
    except Exception as e:
        print(f'Error fetching primary WFS {layer_name}: {e}')
        return {'features': [], 'numberReturned': 0, 'numbermatched': 0}

    matched = int(res_data.get('numberMatched', 0))
    returned = int(res_data.get('numberReturned', 0))
    features = res_data.get('features', [])

    while returned < matched:
        page_params = params.copy()
        page_params.update({
            'startIndex': returned,
            'count': page_size,
            'sortBy': 'OBJECTID'
        })
        try:
            next_resp = await http_client.get(WFS_BASE_URL, params=page_params)
            next_resp.raise_for_status()
            next_data = next_resp.json()
        except Exception as e:
            print(f'Pagination network error on {layer_name}: {e}')
            break

        added = int(next_data.get('numberReturned',0))

        if added == 0:
            print(f'Warning: WFS returned 0 features at startIndex {returned}. Breaking loop to prevent deadlock')
            break
        returned += added
        features.extend(next_data.get('features', []))
    
    res_data['features'] = features
    res_data['numberReturned'] = len(features)
    return res_data


async def get_cached_wfs(cache_key: str, layer_name: str, cql_filter: Optional[str] = None, fallback_layer: Optional[str] = None) -> dict:
    now = time.time()
    cache_entry = _cache.get(cache_key)

    if cache_entry and cache_entry['data'] is not None and now < cache_entry['expiry']:
        return cache_entry['data']
    
    try:
        data = await fetch_wfs_features(layer_name=layer_name, cql_filter=cql_filter)

        if len(data.get('features', [])) == 0 and fallback_layer:
            print(f'No fires found in {layer_name}, checking in {fallback_layer}')
            data = await fetch_wfs_features(layer_name=fallback_layer, cql_filter=cql_filter)

        _cache[cache_key] = {
            'data': data,
            'expiry': now + CACHE_TTL_SECONDS
        }
        return data
    except Exception as e:
        if cache_entry and cache_entry['data'] is not None:
            print(f'WFS Error: {str(e)}. Serving stale cache fallback for key: {cache_key}')
            return cache_entry['data']
        raise e


@router.get('/points')
async def get_fire_points(
    year: Optional[int] = Query(None, description='Year of incident. Defaults to active/current year'),
    historical: bool = Query(False, description='Force historical layer lookup')
    ):

    current_year = datetime.now().year

    if historical or (year is not None and year < current_year):
        primary_layer = HISTORIC_POINTS
        fallback_layer = CURRENT_POINTS if year is not None else None
    else:
        primary_layer = CURRENT_POINTS
        fallback_layer = HISTORIC_POINTS if year is not None else None

    cql_conditions = []
    if year:
        cql_conditions.append(f'FIRE_YEAR = {year}')
    cql_filter = ' AND '.join(cql_conditions) if cql_conditions else None
    cache_key = f'points_{year or 'active'}_{cql_filter or 'all'}'

    try:
        return await get_cached_wfs(cache_key=cache_key, layer_name=primary_layer, cql_filter=cql_filter, fallback_layer=fallback_layer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to fetch fire points: {str(e)}')

    
@router.get('/perimeters')
async def get_fire_perimeters(
    year: Optional[int] = Query(None, description='Fire year. Defaults to archive/current year'),
    min_hectares: Optional[float] = Query(10.0, description='Minimum fire size in hecatres filter'),
    historical: bool = Query(False, description='Force historical layer lookup')
    ):

    current_year = datetime.now().year

    if historical or (year is not None and year < current_year):
        primary_layer = HISTORIC_POLYS
        fallback_layer = CURRENT_POLYS if year is not None else None
    else:
        primary_layer = CURRENT_POLYS
        fallback_layer = HISTORIC_POLYS if year is not None else None
    
    cql_conditions = []
    if year:
        cql_conditions.append(f'FIRE_YEAR = {year}')
    if min_hectares:
        cql_conditions.append(f'FIRE_SIZE_HECTARES >= {min_hectares}')

    cql_filter = ' AND '.join(cql_conditions) if cql_conditions else None
    cache_key = f'perimeters_{year or 'active'}_{cql_filter or 'all'}'

    try:
        return await get_cached_wfs(cache_key=cache_key, layer_name=primary_layer, cql_filter=cql_filter, fallback_layer=fallback_layer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to fetch fire points: {str(e)}')