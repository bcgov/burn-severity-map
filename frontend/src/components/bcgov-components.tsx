import React, { useState, useRef, useEffect } from "react";
import { useAuth } from '../auth/AuthContext'
import { Header, Footer, Button } from "@bcgov/design-system-react-components";
import { useMatch } from "react-router-dom";
import geobcLogo from '../assets/geobc_logo.png';
import HealthStatus from "./HealthStatus";
import { useHealth } from "./HealthContext";

interface HeaderLinkProps {
  url: string;
  title: string;
  displayText: string;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({url, title, displayText}) => {
  return (
    <a className="header-link" href={url} title={title}
    >{displayText}</a>
  );
};

const HealthDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { health, loading } = useHealth();

  const getButtonBackground = (): string => {
    if (loading || !health) return 'transparent';

    const allstatuses = [
      health.status,
      health.object_storage,
      health.data_status,
      health.analysis_backend
    ];

    if (allstatuses.includes('unreachable')) {
      return '#d32f2f80';
    }

    if (allstatuses.includes('degraded') || allstatuses.includes('not created')) {
      return '#ed6c0280';
    }
    return '#2e7d3280';
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <a
      className='header-link'
      onClick={() => setIsOpen(!isOpen)}
      title='Check System Health'
      style={{
        backgroundColor: getButtonBackground(),
        transition: 'background-color 0.3s ease'
      }}
      >
        System Health {isOpen ? '▲' : '▼'}
      </a>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0, // Keeps the dropdown aligned with the right edge of the button
          marginTop: '1rem',
          backgroundColor: 'white',
          color: '#333', // Dark text for readability on the white card
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '4px',
          zIndex: 1000,
          minWidth: '320px',
          textAlign: 'left'
        }}>
          <HealthStatus />
        </div>
      )}
    </div>
  );
};

const LoginLogoutButton: React.FC = () => {
  const { user, login, logout, isAuthenticated, isLoadingAuth } = useAuth(); // Added isAuthenticated and isLoadingAuth for clarity

  // Optionally, show nothing or a disabled button if auth status is still loading
  if (isLoadingAuth) {
    return (null); // Or a placeholder, or null
  }

  return (
    <>
      {isAuthenticated ? ( // Or simply 'user' if you prefer checking for user object directly
        <>
        <HealthDropdown />
        <HeaderLink
          url="/burn-severity"
          title="View Burn Severity Analysis"
          displayText="View"
        />
        <HeaderLink
          url="/severity-configuration"
          title="Configure Burn Severity Analysis"
          displayText="Configure"
        />
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
  
  // Always return the footer, even on map page - just with different styling
  return (
    <div className={`bcgov-footer ${isMapPage ? 'bcgov-footer-map-page' : ''}`}>
      <Footer/>
    </div>
  );
};

export { PageHeader, PageFooter, NothingButton, LoginLogoutButton }