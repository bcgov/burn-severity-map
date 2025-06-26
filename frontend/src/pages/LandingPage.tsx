// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom'; // React Router component for client-side navigation
import "./LandingPage.scss"; // SCSS styles specific to the landing page
import { useAuth } from '../auth/AuthContext';

// Functional component for the landing (home) page
const LandingPage = () => {
  const { isAuthenticated, isLoadingAuth, login } = useAuth();
  return (
    // Container div styled with the "home-container" class
    <div className="home-container">
      <h1> Welcome to the bs application!</h1>

      {isLoadingAuth ? ( // Show a loading message while authentication status is being determined
        <p>Loading authentication status...</p>
      ) : (
        <>
          {isAuthenticated ? ( // Render the link only if the user is authenticated
            <Link to="/map">Go to Map</Link>
          ) : (
            // Optionally, you can show a login button or a message for unauthenticated users
            <div>
              <p>Please log in to see our premium features</p>
            </div>
          )}
        </>
      )}
      <Link to="/nbr">Burn Severity Analysis</Link>
    </div>
  );
};

export default LandingPage;
