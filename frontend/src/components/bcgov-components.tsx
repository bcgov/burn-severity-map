import React from "react";
import { Header, Footer } from "@bcgov/design-system-react-components";
import { useMatch } from "react-router-dom";
import geobcLogo from '../assets/geobc_logo.png';

const PageHeader: React.FC = () => {

  return (
    <div>
      <Header 
      title="Leaflet Demo"
      logoLinkElement={<a href="https://www2.gov.bc.ca/gov/content/data/about-data-management/geobc"></a>}
      logoImage={<img src={geobcLogo}
      alt="GeoBC Logo" 
      style={{ height: "30px" }} />} 
      />
    </div>
  );
};

const PageFooter: React.FC = () => {
  const isMapPage = useMatch("/map");

  if (isMapPage) {
    return null;
  }

  return (
    <div>
      <Footer/>
    </div>
  );
};

export { PageHeader, PageFooter }