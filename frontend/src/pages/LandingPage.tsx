// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom'; // React Router component for client-side navigation
import "./LandingPage.scss"; // SCSS styles specific to the landing page
import { useAuth } from '../auth/AuthContext';
import HealthStatus from '../components/HealthStatus';

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
            <div>
            <Link to="/burn-severity">View BS Analysis</Link>
            <br />
            <Link to="/severity-configuration">Configure Severity Settings</Link>
            </div>
          ) : (
            // Optionally, you can show a login button or a message for unauthenticated users
            <div>
              <p>Please log in to see our premium features</p>
            </div>
          )}
        </>
      )}
      

      {/* Health status display */}
      <div style={{ marginTop: '2rem' }}>
        <HealthStatus />
      </div>
    </div>
  );
};

export default LandingPage

