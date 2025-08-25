import React from "react";
import { useAuth } from '../auth/AuthContext'
import { Header, Footer, Button } from "@bcgov/design-system-react-components";
import { useMatch } from "react-router-dom";
import geobcLogo from '../assets/geobc_logo.png';

const LoginLogoutButton: React.FC = () => {
  const { user, login, logout, isAuthenticated, isLoadingAuth } = useAuth(); // Added isAuthenticated and isLoadingAuth for clarity

  // Optionally, show nothing or a disabled button if auth status is still loading
  if (isLoadingAuth) {
    return (null); // Or a placeholder, or null
  }

  return (
    <>
      {isAuthenticated ? ( // Or simply 'user' if you prefer checking for user object directly
        <Button
          onPress={logout}
          variant="secondary"
        >
          Logout ({user?.profile?.name || user?.profile?.email || 'User'}) {/* Display user info if available */}
        </Button>
      ) : (
        <Button
          onPress={login}
          variant="primary" // Or 'secondary' as in your example
        >
          Login
        </Button>
      )}
    </>
  );
};

const NothingButton: React.FC = () => {
  //const { user, login, logout, isAuthenticated, isLoadingAuth } = useAuth(); 
  return (
    <Button
      variant="secondary"
    >Login</Button>
  );
};
const PageHeader: React.FC = () => {
  return (
    <div className="bcgov-header">
      <Header 
        title="Burn Severity Analysis"
        logoLinkElement={<a href="https://www2.gov.bc.ca/gov/content/data/about-data-management/geobc"></a>}
        logoImage={<img src={geobcLogo}
        alt="GeoBC Logo" 
        style={{ height: "30px" }} />}
        children = {<LoginLogoutButton />}
      />
    </div>
  );
};

const PageFooter: React.FC = () => {
  // Only hide footer on the original MapPage, not on NBRMap
  const isMapPage = useMatch("/map");
  
  // Always return the footer, even on map page - just with different styling
  return (
    <div className={`bcgov-footer ${isMapPage ? 'bcgov-footer-map-page' : ''}`}>
      <Footer/>
    </div>
  );
};


export { PageHeader, PageFooter,NothingButton, LoginLogoutButton }