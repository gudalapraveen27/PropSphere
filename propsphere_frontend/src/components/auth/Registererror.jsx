import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/auth.services";
import "./Registererror.css";
function Registererror() {
  const [adduser] = useRegisterUserMutation();
  const navigate = useNavigate();

  const initialUser = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  };

  const [user, setUser] = useState(initialUser);

  function handleSubmit(e) {
    e.preventDefault();

    adduser(user)
      .unwrap()
      .then((res) => {
        if (res.msg === "user already exist") {
          alert('user already exist please login')
        } else {
          setUser(initialUser);
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join propsphere and get started today.</p>
        </div>

        <div className="register-field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={user.name}
            placeholder="Enter your full name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={user.email}
            placeholder="Enter your email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={user.password}
            placeholder="Create a password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={user.phone}
            placeholder="Enter your phone number"
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            required
          />
        </div>

        <div className="register-field">
          <label htmlFor="role">Account Type</label>
          <select
            id="role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            required
          >
            <option value="">Select account type</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <div className="register-error" role="alert">
          An account with this email already exists. Please log in instead.
        </div>

        <button className="register-button" type="submit">
          Create Account
        </button>

        <p className="register-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Registererror;
