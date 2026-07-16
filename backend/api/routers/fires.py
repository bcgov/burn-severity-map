import httpx
import asyncio
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix='/fires', tags=['fires'])

FIRE_POINTS_URL = 'https://openmaps.gov.bc.ca/geo/pub/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_PNTS_SP&outputFormat=application/json&srsName=EPSG:3857'
FIRE_POLYS_URL = (
    'https://openmaps.gov.bc.ca/geo/pub/ows?'
    'service=WFS&version=1.0.0&request=GetFeature'
    '&typeName=pub:WHSE_LAND_AND_NATURAL_RESOURCE.PROT_CURRENT_FIRE_POLYS_SP'
    '&outputFormat=application/json'
    '&srsName=EPSG:3857'
    '&propertyName=FIRE_NUMBER'
)

@router.get('/live')
async def get_live_fires():

    async with httpx.AsyncClient() as client:
        try:
            point_response, poly_response = await asyncio.gather(
                client.get(FIRE_POINTS_URL, timeout=30.0),
                client.get(FIRE_POLYS_URL, timeout=30.0)
            )

            point_response.raise_for_status()
            poly_response.raise_for_status()

            point_data = point_response.json()
            poly_data = poly_response.json()

            perimeter_fire_numbers = set()
            for feature in poly_data.get('features', []):
                properties = feature.get('properties', {})

                fire_num = properties.get('FIRE_NUMBER') or properties.get('fire_number')
                if fire_num:
                    perimeter_fire_numbers.add(str(fire_num).strip())
            all_points = point_data.get('features', [])
            filtered_points = []

            for feature in all_points:
                properties = feature.get('properties', {})
                fire_num = properties.get('FIRE_NUMBER') or properties.get('fire_number')
                if fire_num and str(fire_num).strip() in perimeter_fire_numbers:
                    filtered_points.append(feature)
            
            point_data['features'] = filtered_points

            print(f'Returned {len(filtered_points)} of {len(all_points)} fires')

            return point_data

        except Exception as e:
            raise HTTPException(status_code=500, detail=f'Failed to fetch WFS data: {str(e)}')