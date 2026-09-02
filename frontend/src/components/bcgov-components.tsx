import React, { useState, useRef, useEffect } from "react";
import { useAuth } from '../auth/AuthContext'
import { Header, Footer, Button } from "@bcgov/design-system-react-components";
import { useMatch, Link } from "react-router-dom";
import geobcLogo from '../assets/geobc_logo.png';
import bcgovLogo from '../assets/BCID_H_rgb_rev.png';
import HealthStatus from "./HealthStatus";
import { useHealth } from "./HealthContext";

interface HeaderLinkProps {
  url: string;
  title: string;
  displayText: string;
}


const HeaderLink: React.FC<HeaderLinkProps> = ({url, title, displayText}) => {
  return (
    <Link className="header-link" to={url} title={title}
    >{displayText}</Link>
  );
};

const LoginLogoutButton: React.FC = () => {
  const { user, login, logout, isAuthenticated, isLoadingAuth, roles } = useAuth(); // Added isAuthenticated and isLoadingAuth for clarity

  // Optionally, show nothing or a disabled button if auth status is still loading
  if (isLoadingAuth) {
    return (null); // Or a placeholder, or null
  }

  const hostname = window.location.hostname;
  const env = hostname.includes('-prod-') ? 'prod' : hostname.includes('-test-') ? 'test' : 'dev'


  return (
    <>
      {isAuthenticated ? ( // Or simply 'user' if you prefer checking for user object directly
        <>
        {(env === 'prod' || roles.includes('viewer') ) && (
          <HeaderLink
            url="/burn-severity"
            title="View Burn Severity Analysis"
            displayText="View"
          />
        )}
        {roles.includes('editor') && (
          <HeaderLink
            url="/severity-configuration"
            title="Configure Burn Severity Analysis"
            displayText="Configure"
          />
        )}
        <Button
          onPress={logout}
          variant="secondary"
        >
          Logout ({user?.profile?.name || user?.profile?.email || 'User'}) {/* Display user info if available */}
        </Button>
        </>
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
        logoLinkElement={<a href="/" title="Return home"></a>}
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
  const burnSeverityMatch = useMatch("/burn-severity");
  const severityConfigMatch = useMatch("/severity-configuration");
  const isMapPage = burnSeverityMatch || severityConfigMatch;

  const [isExpanded, setIsExpanded] = useState(false);

  const { health, loading } = useHealth();
  const footerRef = useRef<HTMLDivElement>(null);

  const getHealthStatusColour = (): string => {
    if (loading || !health) return 'transparent';

    const allstatuses = [
      health.status,
      health.object_storage,
      health.data_status,
      health.analysis_backend
    ];

    if (allstatuses.includes('unreachable')) {
      return 'status-error';
      // return '#d32f2f80';
    }

    if (allstatuses.includes('degraded') || allstatuses.includes('not created')) {
      return 'status-warning';
      // return '#ed6c0280';
    }
    return 'status-healthy';
    // return '#2e7d3280';
  }

  if (!isMapPage) {
    // Standard footer for non map pages
    return (
      <div className='bcgov-footer'>
        <Footer />
      </div>
    );
  }

  return (
    <div className='bcgov-footer-map-page'>
      <div className='map-footer-collapsed-bar'>
        {/* Left column for logo */}
        <div className='map-footer-left'>
            <>
              <img
                src={bcgovLogo}
                alt='BC Government Logo'
                style = {{ height: '30px' }}
              />
              <span className='map-footer-copyright'>
                © {new Date().getFullYear()} Government of British Columbia
              </span>
            </>
        </div>
        {/* Centre column for toggle button */}
        <div className='map-footer-centre'>
          <button
            className='map-footer-toggle-btn'
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Collapse ▼' : 'Expand ▲'}
          </button>
        </div>
        {/* Right column for system health */}
        <div className='map-footer-right'>
            <>
              <span className={`health-indicator ${getHealthStatusColour()}`}></span>
              <span>System Health</span>
              <span style ={{ color: 'white', fontSize: '0.8rem', opacity: 0.8 }}>
                ({health?.version || 'dev'})
              </span>
            </>
        </div>
      </div>
      <div className={`map-footer-expand-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div className='map-footer-expand-inner'>
          <div className='system-health-panel'>
            <HealthStatus layout='inline'/>
          </div>
          {/* <div className='standard-footer-wrapper'>
            <Footer hideAcknowledgement={true} hideLogoAndLinks={true} hideCopyright={true}/>
          </div> */}
        </div>
      </div>

    </div>

  );
};

export { PageHeader, PageFooter, NothingButton, LoginLogoutButton };