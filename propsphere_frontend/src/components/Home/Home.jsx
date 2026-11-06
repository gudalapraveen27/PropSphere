import { useSelector } from "react-redux";
import Buyerdashboard from "../dashboard/Buyerdashboard";
import { Outlet } from "react-router-dom";
import Sellerdashboard from "../dashboard/Sellerdashboard";
import "../dashboard/DashboardMenu.css";

import "./Home.css";
function Homepage() {
  let role = useSelector((state) => state.uReducer.role);

  return (
    <div className="homepage-layout">
      <aside className="homepage-sidebar">
        {role === "buyer" ? (
          <Buyerdashboard />
        ) : (
          <Sellerdashboard/>
        )}
      </aside>

      <main className="homepage-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Homepage;
