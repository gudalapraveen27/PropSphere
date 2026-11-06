import { useState } from "react";
import { useLoginUserMutation } from "../../services/auth.services";
import { useDispatch } from "react-redux";
import {
  updaterole,
  updatetoken,
  updatename,
  updatephone,
  updateemail,
  updateid,
} from "../../features/user.slice";
import { useNavigate } from "react-router-dom";
import "./Login.css";
function Login() {

  const [user, setuser] = useState({ email: "", password: "" });
  const [loginuser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function loginhandler(e) {
    e.preventDefault();

    loginuser(user).then((res) => {
      if (res.data?.token) {
        window.localStorage.setItem("token", res.data.token);
        window.localStorage.setItem("role", res.data.role);
        window.localStorage.setItem("name", res.data.name);
        window.localStorage.setItem("email", res.data.email);
        window.localStorage.setItem("phone", res.data.phone);
        window.localStorage.setItem("id", res.data.id);

        dispatch(updaterole(res.data.role));
        dispatch(updatetoken(res.data.token));
        dispatch(updatename(res.data.name));
        dispatch(updateemail(res.data.email));
        dispatch(updatephone(res.data.phone));
        dispatch(updateid(res.data.id));

        navigate("/home");
      }
      if(res.data?.msg=="user not found"){
        navigate("/loginerror")
      }
    });
  }

  return (
    <div className="login-container">

      <form className="login-form" onSubmit={loginhandler}>
        <div className="login-header">
          
          <h2>Welcome Back</h2>
          <p>Login to your propsphere account.</p>
        </div>

        <div className="login-field">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={user.email}
            required
            onChange={(e) =>
              setuser({ ...user, email: e.target.value })
            }
          />
        </div>

        <div className="login-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={user.password}
            required
            onChange={(e) =>
              setuser({ ...user, password: e.target.value })
            }
          />
        </div>
        

        <button className="login-button" type="submit">
          Login
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}

export default Login;