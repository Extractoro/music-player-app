import React, {useState} from 'react'
import { toast } from "react-toastify";
import "../styles/pages/ForgetPassword.css";
import {requestPasswordReset} from "../api/auth.js";
import Container from "../components/Container.jsx";
import {Link} from "react-router-dom";

const ForgetPassword = () => {
    const [formData, setFormData] = useState({ email: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await requestPasswordReset(formData.email);
            toast.success(response.message || "Password reset link sent to your email.", {
                theme: "dark",
            });
        } catch (error) {
            toast.error(error.message || "Failed to send password reset link.", {
                theme: "dark",
            });
        }
    };

    return (
        <Container>
            <div className="forgetPassword">
                <div className="forgetPassword-container">
                    <h2 className="forgetPassword-title">Reset password</h2>
                    <form
                        id="forgetPasswordForm"
                        className="forgetPassword-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="forgetPassword-form--container">
                            <label
                                className="forgetPassword-form--label"
                                htmlFor="forgetPassword-email"
                            >
                                Email:
                            </label>
                            <input
                                className="forgetPassword-form--input"
                                type="email"
                                id="forgetPassword-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Link className="forgetPassword-form--link" to="/signin">
                            Sign In
                        </Link>
                        <button
                            type="submit"
                            className="forgetPassword-form--button"
                        >
                            Reset password
                        </button>
                    </form>
                </div>
            </div>
        </Container>
    )
}
export default ForgetPassword
