import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navi from "./components/navbar/Navi";
import "./App.css";

function App() {
  const location = useLocation();
  const token = useSelector((state) => state.uReducer.token);

  return (
    <div className="app-shell">
      <Navi />
      {!token && location.pathname.startsWith("/home") && <Navigate to="/" />}
      {!token && !location.pathname.startsWith("/home") && <Outlet />}
      {token && <Outlet />}
    </div>
  );
}

export default App;
