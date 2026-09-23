import httpx
from fastapi import HTTPException, Body, APIRouter

router = APIRouter(prefix='/stac', tags=['stac'])

STAC_ENDPOINTS = {
    "S2": "https://earth-search.aws.element84.com/v1/search",
    "LS_8_9": "https://planetarycomputer.microsoft.com/api/stac/v1/search",
    "LS_5_7": "https://planetarycomputer.microsoft.com/api/stac/v1/search"
}

@router.post('/search')
async def search_stac(sensor: str , payload: dict = Body(...)):
    stac_url = STAC_ENDPOINTS.get(sensor)

    if not stac_url:
        raise HTTPException(
            status_code=400,
            detail=f'Invald sensor: {sensor}. Allowed balues: {list(STAC_ENDPOINTS.keys())}'
        )

    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(stac_url, json=payload, timeout=30.0)
            res.raise_for_status()
            return res.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
