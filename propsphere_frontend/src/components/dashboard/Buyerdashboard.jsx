import { NavLink } from "react-router-dom";
import "./Buyerdashboard.css";
function Buyerdashboard() {
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
          Wishlist
        </NavLink>

        <NavLink to="/home/bookings" className="dashboard-link">
          My Bookings
        </NavLink>
      </nav>
    </div>
  );
}

export default Buyerdashboard;