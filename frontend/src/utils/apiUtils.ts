// apiUtils.ts - Utility functions for API connections

// Base URL for the backend API
export const API_BASE_URL = 'http://localhost:8000';

// Endpoint paths
export const ENDPOINTS = {
  BURN_SEVERITY: '/pg-bs',
  BURN_RECORDS: '/pg-bs',  // The correct endpoint for all records
  FIRE_BY_ID: (fireId: string) => `/pg-bs/${fireId}`,
  FIRE_GEOMETRY: (fireId: string) => `/pg-bs/${fireId}/geometry`  // Updated path
};

/**
 * Helper function to build a complete API URL
 * @param endpoint The API endpoint path
 * @returns Full URL to the API endpoint
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Standard options for fetch requests
 */
export const defaultFetchOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors' as RequestMode
};

/**
 * Helper function for making GET requests
 * @param endpoint API endpoint path
 * @param customOptions Additional fetch options
 * @returns Promise with the response
 */
export async function apiGet<T>(endpoint: string, customOptions = {}): Promise<T> {
  try {
    const url = buildApiUrl(endpoint);
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      ...defaultFetchOptions,
      ...customOptions
    });
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    // Use our safe JSON parser
    return await safeJsonParse(response);
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Safely parse a JSON response
 * @param response The fetch response to parse
 * @returns Promise resolving to the parsed JSON data
 */
export async function safeJsonParse(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON response:', text);
    throw new Error(`Invalid JSON response: ${error}`);
  }
}

/**
 * Check if the backend API is accessible
 * @returns Promise resolving to true if connected, false otherwise
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(buildApiUrl(ENDPOINTS.BURN_SEVERITY), {
      method: 'GET',
      ...defaultFetchOptions
    });
    
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
}
