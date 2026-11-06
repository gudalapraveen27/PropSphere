import { NavLink } from "react-router-dom";
import "./Sellerdashboard.css";
function Sellerdashboard() {
  return (
    <div className="dashboard-menu">
      <h2 className="dashboard-title">Main Menu</h2>

      <nav className="dashboard-links">
        <NavLink to="/home/profile" className="dashboard-link">
          Profile
        </NavLink>
        <NavLink to="/home" end className="dashboard-link">
          Properties
        </NavLink>
        <NavLink to="/home/favorites" className="dashboard-link">
          Favourites
        </NavLink>
        <NavLink to="/home/bookings" className="dashboard-link">
          Bookings
        </NavLink>
        <NavLink to="/home/listings" className="dashboard-link">
          Listings
        </NavLink>{" "}
        <NavLink to="/home/requests" className="dashboard-link">
          Requests
        </NavLink>
        <NavLink to="/home/analytics" className="dashboard-link">
          Analytics
        </NavLink>
      </nav>
    </div>
  );
}

export default Sellerdashboard;
