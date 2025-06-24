// src/authService.ts
import { UserManager } from 'oidc-client-ts';
import oidcConfig from './authConfig';

const userManager = new UserManager(oidcConfig);

export default userManager;
