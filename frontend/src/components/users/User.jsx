
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

import {
    updateToken,
    updateName,
    updateEmail,
    updateId,
    updateMobile,
    updateRole,
} from "../auth/userSlice"

import "./User.css"

function User() {
    const role = window.localStorage.getItem("role")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getLinkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`

    function logouthandler() {
        dispatch(updateToken(null))
        dispatch(updateName(null))
        dispatch(updateEmail(null))
        dispatch(updateId(null))
        dispatch(updateMobile(null))
        dispatch(updateRole(null))

        ;["token", "name", "email", "id", "mobile", "role"].forEach(
            (key) => window.localStorage.removeItem(key)
        )

        navigate("/")
    }

    return (
        <div className="propsphere-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="brand-logo">P</div>

                    <div className="brand-text">
                        <h2>PropSphere</h2>
                        <span>Find your space</span>
                    </div>
                </div>

                {/* Main navigation */}
                <div className="sidebar-section-title">
                    MAIN MENU
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/home/properties"
                        className={getLinkClass}
                    >
                        <span className="nav-icon">⌂</span>
                        <span>Properties</span>
                    </NavLink>

                    <NavLink
                        to="/home/favorites"
                        className={getLinkClass}
                    >
                        <span className="nav-icon">♡</span>
                        <span>Favorites</span>
                    </NavLink>

                    <NavLink
                        to="/home/mybookings"
                        className={getLinkClass}
                    >
                        <span className="nav-icon">▣</span>
                        <span>My Bookings</span>
                    </NavLink>

                    {/* Seller navigation */}
                    {role === "seller" && (
                        <>
                            <div className="sidebar-section-title seller-menu-title">
                                SELLER TOOLS
                            </div>

                            <NavLink
                                to="/home/addproperty"
                                className={getLinkClass}
                            >
                                <span className="nav-icon">＋</span>
                                <span>Add Property</span>
                            </NavLink>

                            <NavLink
                                to="/home/myproperties"
                                className={getLinkClass}
                            >
                                <span className="nav-icon">▤</span>
                                <span>My Properties</span>
                            </NavLink>
                        </>
                    )}

                    {/* Account navigation */}
                    <div className="sidebar-section-title account-menu-title">
                        ACCOUNT
                    </div>

                    <NavLink
                        to="/home/profile"
                        className={getLinkClass}
                    >
                        <span className="nav-icon">♙</span>
                        <span>Profile</span>
                    </NavLink>
                </nav>

                {/* Logout */}
                <div className="sidebar-logout">
                    <button
                        type="button"
                        className="navbar-logout-button"
                        onClick={logouthandler}
                    >
                        <span className="logout-icon">↪</span>
                        <span>Log Out</span>
                    </button>
                </div>

                {/* Sidebar footer */}
                <div className="sidebar-footer">
                    <div className="footer-indicator"></div>
                    <span>Your next chapter starts here.</span>
                </div>
            </aside>

            {/* Main content */}
            <main className="propsphere-main">
                <header className="main-header">
                    <div>
                        <h1>Choose Your Place</h1>
                        <p>
                            Start a new journey with PropSphere.
                        </p>
                    </div>

                    <div className="header-badge">
                        <span className="header-status-dot"></span>
                        Your property journey
                    </div>
                </header>

                <section className="page-content">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default User
