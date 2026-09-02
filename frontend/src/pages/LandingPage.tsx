// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom'; // React Router component for client-side navigation
import "./LandingPage.scss"; // SCSS styles specific to the landing page
import { useAuth } from '../auth/AuthContext';
import HealthStatus from '../components/HealthStatus';
import 'bootstrap/dist/css/bootstrap.min.css';

// Functional component for the landing (home) page
const LandingPage = () => {
  const { isAuthenticated, roles, isLoadingAuth, login } = useAuth();

  const hostname = window.location.hostname;
  const env = hostname.includes('-prod-') ? 'prod' : hostname.includes('-test-') ? 'test' : 'dev'

  return (
    // Container div styled with the "home-container" class
    <div className="home-container">
      <div className="banner">
        <div className="banner-container">
          <h1> Welcome to the { (env !== 'prod') && env.toUpperCase() } bs application!</h1>
          
          <div className="button-container">
            {isLoadingAuth ? ( // Show a loading message while authentication status is being determined
              <p>Loading authentication status...</p>
            ) : (
              <>
                {isAuthenticated ? ( // Render the link only if the user is authenticated
                  <div className='link-container'>
                    {(env !== 'prod' && (!roles.includes('editor') && !roles.includes('viewer'))) ? (
                      <Link to='https://burn-severity-map-prod-frontend.apps.silver.devops.gov.bc.ca/'>Go to Production Site</Link>
                    ) : (
                      <>
                        <Link to="/burn-severity">View BS Analysis</Link>
                        {/* Only show config link to editors */}
                        {roles.includes('editor') && (
                          <Link to="/severity-configuration">Configure BS Analysis</Link>
                        )}
                      </>
                    )}
                    
                  </div>
                ) : (
                  // Optionally, you can show a login button or a message for unauthenticated users
                  <div>
                    <p>Please log in to see our premium features</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="info-container container">
        <div className="row">
          <div className="col-sm-12 col-md-6 info-section">
            <h2>About Burn Severity Analysis</h2>
            <p>
              This portal is a web-based tool designed to support geospatial professionals, emergency managers, and land-use planners in assessing and visualising the severity of recent wildfire events across British Columbia. Through an intuitive map interface and data-rich analytical layers, it provides rapid insights into how intensely areas have burned, where ecosystems may be most vulnerable, and which regions warrant follow-up action.
            </p>
          </div>
          {/* Health status display */}
          <div className="col-sm-12 col-md-6 health-status-container">
            <HealthStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage

