// index.tsx
// Import global SCSS styles for the entire app
import './style.scss';

import React from 'react';
import ReactDOM from "react-dom/client"; // React 18+ root API for rendering the app
import { useLocation } from "react-router-dom"; // React Router hook to access the current location
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router for client-side routing
import { AuthProvider } from './auth/AuthContext'; // Make sure this path is correct
import { HealthProvider } from  './components/HealthContext';

// Import reusable header and footer components from BCGov-branded UI library
// IMPORTANT: Adjust path if 'bcgov-components' is not directly in 'components'
import { PageHeader, PageFooter } from "./components/bcgov-components"; 

// Import pages of the app
import LandingPage from "./pages/LandingPage"; // main page visable to all users
import BurnSeverity from "./pages/burn-severity";
import ConfigurationApp from "./pages/severity-configuration";
import Callback from './pages/Callback'; // Your OIDC callback page

import ProtectedRoute from './auth/ProtectedRoute'; // Your protected route component

import { BURN_SEVERITY_COLOURS } from './utils/severityColours';

// Your main App component, which correctly sets up AuthProvider and Routes
const AppContent: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className={isLanding ? "layout landing-layout" : "layout fixed-layout"}>
      <PageHeader />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/callback" element={<Callback />} />

        {/* Protected routes */}
        {/* <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} /> */}
        <Route path="/burn-severity" element={<BurnSeverity />} />
        {/* Role-Protected routes */}
        <Route path="/severity-configuration" element={
          <ProtectedRoute requiredRole="editor">
            <ConfigurationApp />
          </ProtectedRoute>
        }
        />
        {/* 404 fallback */}
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>

      <PageFooter />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <HealthProvider>
        <AppContent />
      </HealthProvider>
    </AuthProvider>
  </Router>
);


// Get the root HTML element where the React app will be mounted
const appElement = document.getElementById("app"); 

// Only render the app if the root element is found in the DOM
if (appElement) {

  // Add in the standardized burn severity colours to the css sheets

  Object.entries(BURN_SEVERITY_COLOURS).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--colour-${key}`, value);
  });

  ReactDOM.createRoot(appElement).render(
    <React.StrictMode> {/* Good practice to wrap in StrictMode for development */}
      <App /> {/* Render your main App component */}
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'app' not found in the DOM.");
}