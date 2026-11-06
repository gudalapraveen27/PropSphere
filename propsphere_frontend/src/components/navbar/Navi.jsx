import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updaterole,
  updatetoken,
  updateemail,
  updatename,
  updatephone,
  updateid,
  viewproperty,
} from "../../features/user.slice";
import { userApi } from "../../services/auth.services";
import "./Navi.css";
function Navi() {
  let token = useSelector((state) => state.uReducer.token);
  const dispatch = useDispatch();

  function logouthandler() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("name");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("phone");
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("property");

    dispatch(updatetoken(null));
    dispatch(updaterole(null));
    dispatch(updatename(null));
    dispatch(updateemail(null));
    dispatch(updatephone(null));
    dispatch(updateid(null));
    dispatch(viewproperty(null))

    dispatch(userApi.util.resetApiState());
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
         
          propsphere
        </Link>

        <div className="navbar-actions">
          {!token ? (
            <div className="navbar-links">
              <Link to="/" className="navbar-login">
                Login
              </Link>
              <Link to="/register" className="navbar-register">
                Register
              </Link>
            </div>
          ) : (
            <button className="navbar-logout" onClick={logouthandler}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navi;