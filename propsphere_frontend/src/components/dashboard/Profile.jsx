
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../../services/auth.services";
import { updateemail, updatename, updatephone } from "../../features/user.slice";


import "./Profile.css";
function UpdateProfile() {
  const dispatch = useDispatch();

  const { id, name, email, phone } = useSelector(
    (state) => state.uReducer
  );

  const navigate = useNavigate();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    phone: phone || "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function updateProfile(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!id) {
      setError("Please login first.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await updateUser({
        id: id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }).unwrap();

      if (res.msg === "Profile updated successfully") {
        window.localStorage.setItem("name", res.user.name);
        window.localStorage.setItem("email", res.user.email);
        window.localStorage.setItem("phone", res.user.phone);

        dispatch(updatename(res.user.name));
        dispatch(updateemail(res.user.email));
        dispatch(updatephone(res.user.phone));

      } else {
        setError(res.msg || "Failed to update profile.");
      }
    } catch (err) {
      setError(
        err?.data?.msg || "Failed to update profile."
      );
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {formData.name
              ? formData.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>Update Profile</h2>
          <p>Update your propsphere account details</p>
        </div>

        {error && (
          <p className="profile-error">{error}</p>
        )}

        {message && (
          <p className="profile-success">{message}</p>
        )}

        <form onSubmit={updateProfile}>
          <div className="profile-details">
            <div className="profile-item">
              <label className="profile-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                className="profile-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-item">
              <label className="profile-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="profile-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-item">
              <label className="profile-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                className="profile-input"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="profile-update-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>

            <button
              className="profile-delete-btn"
              type="button"
              onClick={() => navigate("/home/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
