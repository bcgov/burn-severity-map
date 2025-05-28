import { Link } from 'react-router-dom'; // React Router component for client-side navigation
import "./LandingPage.scss"; // SCSS styles specific to the landing page

// Functional component for the landing (home) page
const LandingPage = () => {
  return (
    // Container div styled with the "home-container" class
    <div className="home-container">
      {/* Link to navigate to the map page without a full page reload */}
      <Link to="/map">Go to Map</Link>
      <Link to="/nbr">Burn Severity Analysis</Link>
    </div>
  );
};

export default LandingPage;
