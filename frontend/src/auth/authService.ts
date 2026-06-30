// src/authService.ts
import { UserManager } from 'oidc-client-ts';
import { fetchOidcConfig } from './authConfig';

let userManager: UserManager | null = null;

export async function initializeAuthService(): Promise<UserManager> {
    if (userManager) return userManager;

    try {
        const config = await fetchOidcConfig();
        userManager = new UserManager(config);
        return userManager;
    } catch (error) {
        console.error('Failed to initialize UserManager with runtime configurations:', error);
        throw error;
    }
}

export function getUserManager(): UserManager {
    if (!userManager) {
    throw new Error("UserManager has not been initialized yet. Call initializeAuthService() first.");
    }
    return userManager;
}
