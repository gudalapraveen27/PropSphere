
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRegisterUserMutation } from "../../services/registrationApi"
import "./Register.css"

function Register() {
    const [registerUser, { isLoading }] = useRegisterUserMutation()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        mobile: "",
        role: "",
        email: "",
        password: "",
    })

    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")

    function handleChange(e) {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")
        setMessageType("")

        const userData = {
            ...formData,
            age: Number(formData.age),
            mobile: formData.mobile,
            role: formData.role.toLowerCase(),
        }

        try {
            await registerUser(userData).unwrap()

            setMessage("Account created successfully! Redirecting to login...")
            setMessageType("success")

            setTimeout(() => {
                navigate("/login")
            }, 1200)
        } catch (error) {
            console.error("Registration failed:", error)

            setMessage(
                error?.data?.message ||
                error?.data?.msg ||
                "Registration failed. Please check your details and try again."
            )
            setMessageType("error")
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-brand">
                    <div className="register-brand-logo">P</div>
                    <span>PropSphere</span>
                </div>

                <div className="register-heading">
                    <span className="register-eyebrow">JOIN PROPSPHERE</span>
                    <h1>Create your account</h1>
                    <p>Find your place. Start your next chapter.</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-field">
                        <label htmlFor="register-name">Full Name *</label>
                        <input
                            id="register-name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="register-form-grid">
                        <div className="register-field">
                            <label htmlFor="register-age">Age *</label>
                            <input
                                id="register-age"
                                name="age"
                                type="number"
                                placeholder="Your age"
                                min="18"
                                max="120"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="register-gender">Gender *</label>
                            <select
                                id="register-gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="register-field">
                        <label htmlFor="register-mobile">Mobile Number *</label>
                        <input
                            id="register-mobile"
                            name="mobile"
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={handleChange}
                            autoComplete="tel"
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="register-role">I want to *</label>
                        <select
                            id="register-role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose your account type</option>
                            <option value="buyer">Buy or rent a property</option>
                            <option value="seller">List my property</option>
                        </select>
                    </div>

                    <div className="register-field">
                        <label htmlFor="register-email">Email Address *</label>
                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="register-password">Password *</label>
                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />
                        <small>Use at least 8 characters.</small>
                    </div>

                    {message && (
                        <div
                            className={`register-message ${messageType}`}
                            role={messageType === "error" ? "alert" : "status"}
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="register-login-prompt">
                    Already have an account?
                    <Link to="/login"> Login</Link>
                </div>

                <div className="register-footer">
                    Your next chapter starts with PropSphere.
                </div>
            </div>
        </div>
    )
}

export default Register
