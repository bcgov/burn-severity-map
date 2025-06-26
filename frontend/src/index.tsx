// index.tsx
// Import global SCSS styles for the entire app
import './style.scss';

import React from 'react';
import ReactDOM from "react-dom/client"; // React 18+ root API for rendering the app
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router for client-side routing
import { AuthProvider } from './auth/AuthContext'; // Make sure this path is correct

// Import reusable header and footer components from BCGov-branded UI library
// IMPORTANT: Adjust path if 'bcgov-components' is not directly in 'components'
import { PageHeader, PageFooter } from "./components/bcgov-components"; 

// Import pages of the app
import LandingPage from "./pages/LandingPage"; // main page visable to all users
import BurnSeverity from "./pages/burn-severity";
import Callback from './pages/Callback'; // Your OIDC callback page

import ProtectedRoute from './auth/ProtectedRoute'; // Your protected route component

// Your main App component, which correctly sets up AuthProvider and Routes
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider wraps the entire application */}
        {/* Render PageHeader here, so it has access to AuthContext */}
        <PageHeader />

        <Routes>
          {/* Public routes */}
          {/* LandingPage should likely be your "/" route */}
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/callback" element={<Callback />} />

          {/* Protected Routes */}
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
        
        {/* Render PageFooter here, so it also has access to AuthContext if needed */}
        <PageFooter />
      </AuthProvider>
    </Router>
  );
};

// Get the root HTML element where the React app will be mounted
const appElement = document.getElementById("app"); 

// Only render the app if the root element is found in the DOM
if (appElement) {
  ReactDOM.createRoot(appElement).render(
    // Router provides client-side routing context to the app
    <Router>
      {/* BCGov-branded page header */}
      <PageHeader />

      {/* Main content area */}
      <main className="bcgov-main">
        {/* Route configuration: defines what component to show for each URL path */}
        <Routes>
          {/* Home/landing page route */}
          <Route path="/" element={<LandingPage />} />


          {/* Burn Severity Map route */}
          <Route path="/nbr" element={<BurnSeverity />} />
        </Routes>
      </main>

      {/* BCGov-branded page footer */}
      <PageFooter />
    </Router>
  );
}