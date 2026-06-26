// apiService.ts
import userManager from '../auth/authService';


// documents returned by getFireDocuments
export interface Document {
  key: string;
  filename: string;
  url: string;
  size: string;
  createdDate: string;
}

// Define your API's base URL. It's good practice to have this in an environment variable.
const API_BASE_URL = '/api'; // Your FastAPI backend URL
const ANALYSIS_API_BASE_URL = '/analysis'

let cachedDataStatus: 'ok' | 'not created' | 'unreachable' | null = null;
let activeHealthCheck: Promise<HealthResponse> | null = null;

const ensureDataReady = async (): Promise<void> => {
  if (cachedDataStatus === 'ok') return;

  if (cachedDataStatus === null || cachedDataStatus === 'not created') {
    await fetchHealth();
  }

  // if (cachedDataStatus === 'not created') {
  //   throw new Error('No fire data is currently loaded in the system, please configure and run the analysis')
  // }
  if (cachedDataStatus === 'unreachable') {
    throw new Error('Unable to verify system health, the application may be down')
  }
};

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
  const url = endpoint.startsWith('/') && !endpoint.startsWith(ANALYSIS_API_BASE_URL) 
    ? `${API_BASE_URL}${endpoint}` 
    : endpoint;


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
export interface AnalysisRequest {
  fire: string;
  year: number;
  sensor: 'S2';
  s_date?: string;
  e_date?: string;
  cloud?: number;
  object_storage: true;
  image_ids?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'unreachable';
  object_storage: 'ok' | 'connected' | 'unreachable';
  data_status: 'ok' | 'not created' | 'unreachable';
  fire_count: number | null;
  analysis_backend: 'ok' | 'degraded' | 'unreachable';
  version: string;
}

/**
 * Fetches system health status from both FastAPI and Analysis backend.
 * Unprotected endpoint
 */
export const fetchHealth = async (): Promise<HealthResponse> => {

  if (activeHealthCheck) return activeHealthCheck;

  activeHealthCheck = (async () => {
    const endpoints = {
      api: `${API_BASE_URL}/health/api`,
      storage: `${API_BASE_URL}/health/storage`,
      data: `${API_BASE_URL}/health/data`,
      analysis: `${ANALYSIS_API_BASE_URL}/health/analysis`,
    };

    const [apiRes, storageRes, dataRes, analysisRes] = await Promise.allSettled([
      fetch(endpoints.api, { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(endpoints.storage, { cache: 'no-store'}).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(endpoints.data, { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(endpoints.analysis, { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(r.status))
    ]);

    const result: HealthResponse = {
      status: apiRes.status === 'fulfilled' ? (apiRes.value.status || 'ok') : 'unreachable',
      object_storage: storageRes.status === 'fulfilled' ? (storageRes.value.status || 'connected') : 'unreachable',
      data_status: dataRes.status === 'fulfilled' ? (dataRes.value.status || 'unreachable') : 'unreachable',
      fire_count: dataRes.status === 'fulfilled' ? (dataRes.value.fire_count || null) : null,
      analysis_backend: analysisRes.status == 'fulfilled' ? (analysisRes.value.status || 'ok') : 'unreachable',
      version: apiRes.status === 'fulfilled' ? (apiRes.value.version || 'dev') :'unknown'
    };

    cachedDataStatus = result.data_status;

    activeHealthCheck = null;
    return result;

  })();

  return activeHealthCheck;
};

/**
 * Triggers the BARC analysis on the Flask backend.
 * Protected endpoint - Requires 'editor' role on the backend.
 */
export const runBurnSeverityAnalysis = async (params: AnalysisRequest) => {
  // We use authedFetch to automatically include the Bearer token
  // We override the URL assembly since this goes to the ANALYSIS_API_BASE_URL
  const response = await authedFetch(`${ANALYSIS_API_BASE_URL}/run-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Analysis initiation failed' }));
    
    // Handle the 403 Forbidden specifically for role issues
    if (response.status === 403) {
      throw new Error("Access Denied: You do not have the required 'editor' permissions.");
    }
    
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches the features for a specific fire number.
 * @param fireNumber The fire number to look up.
 * @returns A Promise that resolves to the feature collection data.
 */

export const getFireData = async (year:string, fireNumber: string) => {
  await ensureDataReady();

  console.log('getFireData',year,fireNumber)
  const response = await authedFetch(`/burn-severity/${year}/${fireNumber}`);
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
export const getFireDocuments = async (year:string,fireNumber: string) => {
  await ensureDataReady();

  const response = await authedFetch(`/docs/download/${year}/${fireNumber}`);
  if (!response.ok) {
    // handle non-2xx responses here.
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("Raw response data:",data);
  
  if (!Array.isArray(data.export_files)) {
    throw new Error("Unexpected response format: 'files' field is missing or not an array.");
  }

  return [data.export_files, data.intermediate_files];

};

/**
 * Fetches the list of all available fire numbers.
 * Protected endpoint
 */
export const getFireNumbers = async (year:string) => {
  await ensureDataReady();

  const response = await authedFetch(`/burn-severity/${year}`);
  if (!response.ok) {
    // handle non-2xx responses here.
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const syncFireResults = async (year: string,fire_number: string) => {
  await ensureDataReady();
  const response = await authedFetch(`/sync-burn-severity/${year}/${fire_number}`);
  // handle non-2xx responses here.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};
