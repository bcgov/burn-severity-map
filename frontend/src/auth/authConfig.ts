// src/authConfig.ts
import { WebStorageStateStore, UserManagerSettings } from 'oidc-client-ts';

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';
const callbackUrl = process.env.REACT_APP_AUTH_CALLBACK_URL || `${baseUrl}/callback`;

const oidcConfig: UserManagerSettings = {
  authority: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
  client_id: 'burn-severity-6058',
  redirect_uri: callbackUrl,
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: baseUrl,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export default oidcConfig;
