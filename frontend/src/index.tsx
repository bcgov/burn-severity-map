// Import global SCSS styles for the entire app
import './style.scss';

import ReactDOM from "react-dom/client"; // React 18+ root API for rendering the app
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router for client-side routing

// Import reusable header and footer components from BCGov-branded UI library
import { PageHeader, PageFooter } from "./components/bcgov-components";

// Import the two main pages of the app
import LandingPage from "./pages/LandingPage";
import MapPage from "./pages/MapPage";

// Get the root HTML element where the React app will be mounted
const appElement = document.getElementById("app"); 

// Only render the app if the root element is found in the DOM
if (appElement) {
  ReactDOM.createRoot(appElement).render(
    // Router provides client-side routing context to the app
    <Router>
      {/* BCGov-branded page header */}
      <PageHeader />

      {/* Route configuration: defines what component to show for each URL path */}
      <Routes>
        {/* Home/landing page route */}
        <Route path="/" element={<LandingPage />} />

        {/* Map page route */}
        <Route path="/map" element={<MapPage />} />
      </Routes>

      {/* BCGov-branded page footer */}
      <PageFooter />
    </Router>
  );
}
