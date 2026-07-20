import httpx
import time
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix='/fires', tags=['fires'])

FIRE_POINTS_URL = 'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application/json&srsName=EPSG:3857'
FIRE_POLYS_URL = 'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP&outputFormat=application/json&srsName=EPSG:3857&CQL_FILTER=FIRE_SIZE_HECTARES>=10'

CACHE_TTL_SECONDS = 300
_cache = {
    'points': {'data': None, 'expiry': 0},
    'perimeters': {'data': None, 'expiry': 0}
}

async def fetch_with_cache(key: str, url: str) -> dict:
    now = time.time()

    if _cache[key]['data'] is not None and now < _cache[key]['expiry']:
        return _cache[key]['data']
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=30.0)
            response.raise_for_status()
            data = response.json()

            _cache[key]['data'] = data
            _cache[key]['expiry'] = now + CACHE_TTL_SECONDS
            return data
        except Exception as e:
            if _cache[key]['data'] is not None:
                print(f'WFS Error: {str(e)}. Serving stale cache fallback')
                return _cache[key]['data']
            raise e


@router.get('/points')
async def get_live_points():
    try:
        return await fetch_with_cache(key='points', url=FIRE_POINTS_URL)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to fetch points: {str(e)}')
    
@router.get('/perimeters')
async def get_live_perimeters():
    try:
        return await fetch_with_cache(key='perimeters', url=FIRE_POLYS_URL)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to fetch perimeters: {str(e)}')