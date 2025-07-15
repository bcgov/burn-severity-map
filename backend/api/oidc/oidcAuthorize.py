import requests
import time
import os

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from jose.exceptions import JOSEError
from typing import Dict

# --- OIDC Configuration ---
# Based on your src/authConfig.ts file.
# In a production app, it's best practice to load these from environment variables.
OIDC_AUTHORITY = os.getenv("OIDC_AUTHORITY","https://dev.loginproxy.gov.bc.ca/auth/realms/standard")
OIDC_CLIENT_ID = os.getenv("OIDC_CLIENT_ID","burn-severity-6058")

# --- Caching for OIDC provider's public keys ---
# This simple cache avoids refetching the keys on every request.
# For production, consider a more robust cache like Redis or Memcached.
jwks_cache = None
jwks_cache_time = 0
CACHE_TTL_SECONDS = 3600  # Cache for 1 hour

http_bearer = HTTPBearer()

def get_jwks():
    """
    Fetches and caches the JSON Web Key Set (JWKS) from the OIDC provider.
    The JWKS contains the public keys used to verify JWT signatures.
    """
    global jwks_cache, jwks_cache_time
    now = time.time()

    # Return from cache if it's not stale
    if jwks_cache and (now - jwks_cache_time < CACHE_TTL_SECONDS):
        return jwks_cache

    try:
        # Discover the jwks_uri from the OIDC provider's well-known configuration
        oidc_config_url = f"{OIDC_AUTHORITY}/.well-known/openid-configuration"
        oidc_config_response = requests.get(oidc_config_url, timeout=5)
        oidc_config_response.raise_for_status()
        oidc_config = oidc_config_response.json()
        
        jwks_uri = oidc_config.get("jwks_uri")
        if not jwks_uri:
            raise HTTPException(status_code=500, detail="jwks_uri not found in OIDC config")

        # Fetch the JWKS
        jwks_response = requests.get(jwks_uri, timeout=5)
        jwks_response.raise_for_status()
        
        # Cache the result
        jwks_cache = jwks_response.json()
        jwks_cache_time = now
        return jwks_cache
    except requests.exceptions.RequestException as e:
        # If the OIDC provider is unavailable, the service cannot verify tokens
        raise HTTPException(status_code=503, detail=f"Could not fetch OIDC public keys: {e}")


async def verify_token(token: HTTPAuthorizationCredentials = Depends(http_bearer)) -> Dict:
    """
    FastAPI dependency to extract, validate, and decode an OIDC JWT.

    Args:
        token: The bearer token from the Authorization header, injected by FastAPI.

    Returns:
        The decoded token payload (claims) as a dictionary.

    Raises:
        HTTPException: If the token is missing, malformed, or invalid in any way.
    """
    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Bearer token not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        jwt_string = token.credentials
        unverified_header = jwt.get_unverified_header(jwt_string)
    except JOSEError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Could not parse token header: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    jwks = get_jwks()
    
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header.get("kid"):
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
            break
    
    if not rsa_key:
        raise HTTPException(
            status_code=401,
            detail="Public key for token signature not found in JWKS",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Decode and validate the token's signature and claims
        payload = jwt.decode(
            jwt_string,
            rsa_key,
            algorithms=["RS256"],
            issuer=OIDC_AUTHORITY,
            audience=OIDC_CLIENT_ID,
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTClaimsError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid claims: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JOSEError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token validation failed: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
