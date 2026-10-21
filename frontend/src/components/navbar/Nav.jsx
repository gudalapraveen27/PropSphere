
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
    updateName,
    updateToken,
    updateEmail,
    updateId,
    updateMobile,
    updateRole
} from '../auth/userSlice'
import './Nav.css'

function Nav() {
    const token = useSelector((state) => state.uReducer.token)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function logouthandler() {
        dispatch(updateToken(null))
        dispatch(updateName(null))
        dispatch(updateEmail(null))
        dispatch(updateId(null))
        dispatch(updateMobile(null))
        dispatch(updateRole(null))

        ;['token', 'name', 'email', 'id', 'mobile', 'role'].forEach((key) => {
            window.localStorage.removeItem(key)
        })

        navigate('/')
    }

    return (
        <header className="propsphere-navbar">
            <Link to="/" className="navbar-brand">
                <span className="navbar-logo">P</span>
                <span className="navbar-brand-name">PropSphere</span>
            </Link>

            <nav className="navbar-navigation">
                <Link to="/" className="navbar-link">
                    Home
                </Link>

                {token ? (
                    <button
                        type="button"
                        className="navbar-logout-button"
                        onClick={logouthandler}
                    >
                        Log Out
                    </button>
                ) : (
                    <div className="navbar-auth-links">
                        <Link to="/login" className="navbar-login-link">
                            Login
                        </Link>

                        <Link to="/register" className="navbar-register-button">
                            Register
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Nav
