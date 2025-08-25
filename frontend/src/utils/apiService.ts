import userManager from '../auth/authService';

// documents returned by getFireDocuments
export interface Document {
  key: string;
  filename: string;
  url: string;
}

// Define your API's base URL. It's good practice to have this in an environment variable.
const API_BASE_URL = 'http://localhost:8080/pg-bs'; // Your FastAPI backend URL
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

//dummy data for test
  // const response = [{'key': 'burn-severity/V30558_interim_burn_severity.pdf', 'filename': 'V30558_interim_burn_severity.pdf', 'url': 'https://nrs.objectstore.gov.bc.ca:443/rczimv/burn-severity/V30558_interim_burn_severity.pdf?AWSAccessKeyId=nr-geobc-data-test&Signature=SLbQpFsOBJzJVztFwEomNfEnWIE%3D&Expires=1752868250'}, {'key': 'burn-severity/V30558_interim_burn_severity_2025.kml', 'filename': 'V30558_interim_burn_severity_2025.kml', 'url': 'https://nrs.objectstore.gov.bc.ca:443/rczimv/burn-severity/V30558_interim_burn_severity_2025.kml?AWSAccessKeyId=nr-geobc-data-test&Signature=MLg36X9FoqoUgOqynaI9BDUmfZI%3D&Expires=1752868252'}]
  // return response;

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

/**
 * Fetches the list of all available fire numbers.
 * Unprotected endpoint
 */
// export const getFireNumbers = async () => {
//     const response = await fetch(`${API_BASE_URL}/burn-severity`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch fire numbers');
//     }
//     return response.json();
// }

