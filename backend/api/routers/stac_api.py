import httpx
from fastapi import HTTPException, Body, APIRouter

router = APIRouter(prefix='/stac', tags=['stac'])

@router.post('/search')
async def search_stac(stac_url: str , payload: dict = Body(...)):

    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(stac_url, json=payload, timeout=30.0)
            res.raise_for_status()
            return res.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
