// apiService.ts
import userManager from '../auth/authService';

// documents returned by getFireDocuments
export interface Document {
  key: string;
  filename: string;
  url: string;
}

// Define your API's base URL. It's good practice to have this in an environment variable.
const API_BASE_URL = '/api'; // Your FastAPI backend URL
const ANALYSIS_API_BASE_URL = '/analysis'
/**
 * A wrapper around the native fetch function that automatically adds the
 * OIDC Authorization header to API requests.
 *
 * @param endpoint The API endpoint to call (e.g., '/burn-severity/F12345').
 * @param options Optional fetch options (method, body, etc.).
 * @returns A Promise that resolves with the Fetch API Response.
 */
async function authedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // Get the latest user object from the oidc-client-ts user manager.
  const user = await userManager.getUser();

  // If there's no user or the token is expired, the request cannot be authenticated.
  // You could throw an error or handle this case as needed.
  if (!user || user.expired) {
    // Depending on your app's desired behavior, you might:
    // 1. Throw an error to be caught by the calling component.
    // 2. Trigger a login redirect.
    // 3. Attempt a silent refresh (though oidc-client-ts often handles this).
    console.error("authedFetch: No valid user session found.");
    // We'll throw an error to make the calling code aware of the failure.
    throw new Error("User is not authenticated or session has expired.");
  }

  // Create default headers if none were provided.
  const headers = new Headers(options.headers || {});

  // Add the Authorization header with the Bearer token.
  headers.append('Authorization', `Bearer ${user.access_token}`);
  
  // Assemble the full request URL.
  const url = `${API_BASE_URL}${endpoint}`;

  // Perform the fetch call with the updated options.
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Optional: Handle 401 Unauthorized responses globally.
  // This could be a good place to trigger a logout if the token is rejected by the server.
  if (response.status === 401) {
    console.error("API request returned 401 Unauthorized. The token may be invalid.");
    // Consider redirecting to logout or showing a session expiry message.
    // await userManager.signoutRedirect();
  }

  return response;
}

// --- Define your specific API functions here ---


export interface HealthResponse {
  status: 'ok' | 'degraded' | 'unreachable';
  object_storage: 'connected' | 'unreachable';
  analysis_backend: 'ok' | 'degraded' | 'unreachable';
}

/**
 * Fetches system health status from both FastAPI and Analysis backend.
 * Unprotected endpoint
 */
export const fetchHealth = async (): Promise<HealthResponse> => {
  // Default values (if a service is unreachable)
  let backendStatus: HealthResponse['status'] = 'unreachable';
  let objectStorage: HealthResponse['object_storage'] = 'unreachable';
  let analysisStatus: HealthResponse['analysis_backend'] = 'unreachable';

  // FastAPI backend health (independent)
  try {
    const backendResponse = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    if (backendResponse.ok) {
      const backendHealth = await backendResponse.json();
      backendStatus = backendHealth?.status ?? 'unreachable';
      objectStorage = backendHealth?.object_storage ?? 'unreachable';
    } else {
      console.warn(`Backend health check failed with status ${backendResponse.status}`);
    }
  } catch (e) {
    console.warn('Backend health check error:', e);
  }

  // Analysis backend health (independent)
  try {
    const analysisResponse = await fetch(`${ANALYSIS_API_BASE_URL}/health`, { cache: 'no-store' });
    if (analysisResponse.ok) {
      const analysisHealth = await analysisResponse.json();
      analysisStatus = analysisHealth?.status ?? 'unreachable';
    } else {
      console.warn(`Analysis health check failed with status ${analysisResponse.status}`);
    }
  } catch (e) {
    console.warn('Analysis health check error:', e);
  }

  // Combine: if backend is good but analysis is down, don't fail the API status.
  // Keep your original `status` semantics coming from the backend.
  return {
    status: backendStatus,                 // keep backend's own status (ok/degraded/unreachable)
    object_storage: objectStorage,         // from backend (or 'unreachable')
    analysis_backend: analysisStatus,      // independent result for analysis
  };
};



/**
 * Fetches the features for a specific fire number.
 * @param fireNumber The fire number to look up.
 * @returns A Promise that resolves to the feature collection data.
 */

export const getFireData = async (fireNumber: string) => {
  const response = await authedFetch(`/burn-severity/${fireNumber}`);
  if (!response.ok) {
    // handle non-2xx responses here.
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
/**
 * Fetch the list of documents availiable for fire number
 * response = [{"key":str,"filename":str,"url":str}]
 */
export const getFireDocuments = async (fireNumber: string) => {
  const response = await authedFetch(`/docs/download/${fireNumber}`);
  if (!response.ok) {
    // handle non-2xx responses here.
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("Raw response data:",data);
  
  if (!Array.isArray(data.files)) {
    throw new Error("Unexpected response format: 'files' field is missing or not an array.");
  }

  return data.files;

}

/**
 * Fetches the list of all available fire numbers.
 * Protected endpoint
 */
export const getFireNumbers = async () => {
  const response = await authedFetch(`/burn-severity`);
  if (!response.ok) {
    // handle non-2xx responses here.
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const syncFireResults = async (year: string,fire_number: string) => {
    const response = await authedFetch(`/sync-burn-severity/${year}/${fire_number}`);
    // handle non-2xx responses here.
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };
