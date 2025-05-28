import React from "react";
import { Header, Footer } from "@bcgov/design-system-react-components";
import { useMatch } from "react-router-dom";
import geobcLogo from '../assets/geobc_logo.png';

const PageHeader: React.FC = () => {
  return (
    <div className="bcgov-header">
      <Header 
        title="Burn Severity Analysis"
        logoLinkElement={<a href="https://www2.gov.bc.ca/gov/content/data/about-data-management/geobc"></a>}
        logoImage={<img src={geobcLogo}
        alt="GeoBC Logo" 
        style={{ height: "30px" }} />} 
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

export { PageHeader, PageFooter }