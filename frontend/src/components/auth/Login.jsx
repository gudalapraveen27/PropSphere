
import { useState } from "react"
import { useLoginUserMutation } from "../../services/registrationApi"
import {
    updateToken,
    updateId,
    updateName,
    updateEmail,
    updateMobile,
    updateRole
} from "./userSlice"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import "./Login.css"

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [loginUser, { isLoading }] = useLoginUserMutation()
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()
    const nav = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        try {
            const res = await loginUser(formData).unwrap()

            // Save authentication details
            window.localStorage.setItem("token", res.token)
            window.localStorage.setItem("name", res.name ?? "")
            window.localStorage.setItem("email", res.email ?? "")
            window.localStorage.setItem("id", res.id ?? "")
            window.localStorage.setItem("mobile", res.mobile ?? "")
            window.localStorage.setItem("role", res.role ?? "")

            // Update Redux state
            dispatch(updateToken(res.token))
            dispatch(updateName(res.name ?? null))
            dispatch(updateEmail(res.email ?? null))
            dispatch(updateId(res.id ?? null))
            dispatch(updateMobile(res.mobile ?? null))
            dispatch(updateRole(res.role ?? null))

            nav("/home")
        } catch (err) {
            console.error("Login failed:", err)

            setErrorMessage(
                err?.data?.message ||
                err?.data?.msg ||
                "Unable to log in. Please check your email and password."
            )
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-brand">
                    <div className="login-brand-logo">P</div>
                    <span>PropSphere</span>
                </div>

                <div className="login-heading">
                    <span className="login-eyebrow">WELCOME BACK</span>
                    <h1>Login to your account</h1>
                    <p>Find your place. Start your next chapter.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="login-email">Email Address</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className="login-error" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="login-register-prompt">
                    Don't have an account?
                    <Link to="/register"> Create an account</Link>
                </div>

                <div className="login-footer">
                    Your next chapter starts with PropSphere.
                </div>
            </div>
        </div>
    )
}

export default Login
