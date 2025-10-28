// apiService.ts
import userManager from '../auth/authService';

// documents returned by getFireDocuments
export interface Document {
  key: string;
  filename: string;
  url: string;
}

// Define your API's base URL. It's good practice to have this in an environment variable.
const API_BASE_URL = 'http://localhost:8080/pg-bs'; // Your FastAPI backend URL
const ANALYSIS_API_BASE_URL = 'http://localhost:5000'
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
  try {
    // Fetch FastAPI backend health
    const backendResponse = await fetch(`${API_BASE_URL}/health`);
    if (!backendResponse.ok) {
      throw new Error(`Backend health check failed with status ${backendResponse.status}`);
    }
    const backendHealth = await backendResponse.json();

    // Fetch Analysis backend health
    const analysisResponse = await fetch(`${ANALYSIS_API_BASE_URL}/health`);
    if (!analysisResponse.ok) {
      throw new Error(`Analysis health check failed with status ${analysisResponse.status}`);
    }
    const analysisHealth = await analysisResponse.json();

    // Combine both responses
    const combinedHealth: HealthResponse = {
      status: backendHealth.status,
      object_storage: backendHealth.object_storage,
      analysis_backend: analysisHealth.status,
    };

    return combinedHealth;
  } catch (error) {
    console.error('Health check error:', error);
    return {
      status: 'unreachable',
      object_storage: 'unreachable',
      analysis_backend: 'unreachable',
    };
  }
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
