// src/authConfig.ts
import { WebStorageStateStore, UserManagerSettings } from 'oidc-client-ts';

// const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';

const baseUrl = 'https://bs-app-burn-severity-map.apps.silver.devops.gov.bc.ca/';

const oidcConfig: UserManagerSettings = {
  authority: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
  client_id: 'burn-severity-6058',
  // redirect_uri: 'http://localhost:8080/callback',
  redirect_uri: `${baseUrl}/callback`,
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: baseUrl,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export default oidcConfig;
