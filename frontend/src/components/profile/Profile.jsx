
import { useNavigate } from "react-router-dom"
import "./Profile.css"

function Profile() {
    const name = window.localStorage.getItem("name")
    const email = window.localStorage.getItem("email")
    const mobile = window.localStorage.getItem("mobile")
    const role = window.localStorage.getItem("role")
    const id = window.localStorage.getItem("id")

    const navigate = useNavigate()

    function handleUpdate() {
        navigate("/home/updateaccount")
    }

    function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        )

        if (confirmed) {
            // Connect this action to your backend delete-account API.
            window.alert(
                "Account deletion is not connected yet. Please implement the backend API first."
            )
        }
    }

    const displayName = name || "User"

    const initials = displayName
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    return (
        <div className="profile-page">
            <div className="profile-heading">
                <div>
                    <h2>My Profile</h2>
                    <p>Manage your personal information and account.</p>
                </div>

                <span className="profile-role-badge">
                    {(role || "user").toUpperCase()}
                </span>
            </div>

            <div className="profile-card">
                <div className="profile-cover"></div>

                <div className="profile-main-info">
                    <div className="profile-avatar">
                        {initials || "U"}
                    </div>

                    <div className="profile-identity">
                        <h3>{displayName}</h3>
                        <p>{email || "No email available"}</p>
                    </div>

                    <span className="profile-status">
                        <span className="profile-status-dot"></span>
                        Account
                    </span>
                </div>

                <div className="profile-divider"></div>

                <div className="profile-details-heading">
                    <h3>Personal Information</h3>
                    <p>Your registered account details</p>
                </div>

                <div className="profile-details-grid">
                    <div className="profile-detail-item">
                        <div className="profile-detail-icon">♙</div>
                        <div>
                            <span className="profile-label">
                                Full Name
                            </span>
                            <p>{name || "Not provided"}</p>
                        </div>
                    </div>

                    <div className="profile-detail-item">
                        <div className="profile-detail-icon">@</div>
                        <div>
                            <span className="profile-label">
                                Email Address
                            </span>
                            <p>{email || "Not provided"}</p>
                        </div>
                    </div>

                    <div className="profile-detail-item">
                        <div className="profile-detail-icon">☎</div>
                        <div>
                            <span className="profile-label">
                                Mobile Number
                            </span>
                            <p>{mobile || "Not provided"}</p>
                        </div>
                    </div>

                    <div className="profile-detail-item">
                        <div className="profile-detail-icon">◇</div>
                        <div>
                            <span className="profile-label">
                                Account Role
                            </span>
                            <p className="profile-role-text">
                                {role
                                    ? role.charAt(0).toUpperCase() +
                                      role.slice(1)
                                    : "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="profile-divider"></div>

                <div className="profile-account-id">
                    <div>
                        <span className="profile-label">
                            Account ID
                        </span>
                        <p>{id || "Not available"}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    <button
                        type="button"
                        className="profile-update-button"
                        onClick={handleUpdate}
                    >
                        <span>✎</span>
                        Update Account
                    </button>

                    <button
                        type="button"
                        className="profile-delete-button"
                        onClick={handleDelete}
                    >
                        <span>⌫</span>
                        Delete Account
                    </button>
                </div>
            </div>

            <div className="profile-help-card">
                <div className="profile-help-icon">i</div>
                <div>
                    <h4>Keep your account information up to date</h4>
                    <p>
                        Make sure your contact details are correct so
                        you can stay informed about your property
                        activities.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile
