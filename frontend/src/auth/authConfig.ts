// src/authConfig.ts
import { WebStorageStateStore, UserManagerSettings } from 'oidc-client-ts';

const oidcConfig: UserManagerSettings = {
  authority: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
  client_id: 'burn-severity-6058',
  redirect_uri: 'http://localhost:8080/callback',
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: 'http://localhost:8080/',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export default oidcConfig;
