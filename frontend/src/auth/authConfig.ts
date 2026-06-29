// src/authConfig.ts
import { WebStorageStateStore, UserManagerSettings } from 'oidc-client-ts';


function getBaseUrl(): string {
  // Browser runtime: trust the Route/Ingress host
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  // Non-browser (tests/SSR) or local dev fallback
  return process.env.REACT_APP_BASE_URL || 'http://localhost:8080';
}

export async function fetchOidcConfig(): Promise<UserManagerSettings> {
  try {

    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error(`Failed to fetch the SSO config: ${response.statusText}`);
    }

    const data = await response.json();
    const baseUrl = getBaseUrl();
    const CALLBACK_PATH = process.env.REACT_APP_AUTH_CALLBACK_PATH || '/callback';
    const callbackUrl = `${baseUrl.replace(/\/+$/, '')}${CALLBACK_PATH}`;

    return {
      authority: data.oidc_authority,
      client_id: data.oidc_client_id,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid profile email',
      post_logout_redirect_uri: baseUrl,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };
  } catch (error) {
    console.error('Critical Error: Could not resolve runtime OIDC settings. Falling back to local defaults.', error);

    const baseUrl = getBaseUrl();
    const CALLBACK_PATH = process.env.REACT_APP_AUTH_CALLBACK_PATH || '/callback';
    const callbackUrl = `${baseUrl.replace(/\/+$/, '')}${CALLBACK_PATH}`;

    return {
      authority: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
      client_id: 'burn-severity-6058',
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid profile email',
      post_logout_redirect_uri: baseUrl,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };
  }
}
