import React, {useState} from 'react'
import { toast } from "react-toastify";
import "../styles/pages/ResetPassword.css";
import {passwordReset} from "../api/auth.js";
import Container from "../components/Container.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({ password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = searchParams.get("token");

        try {
            const response = await passwordReset(formData.password, token);
            toast.success(response.message || "Password changed successfully!", {
                theme: "dark",
            });
            navigate("/signin");
        } catch (error) {
            toast.error(error.message || "Failed to send password reset link.", {
                theme: "dark",
            });
        }
    };

    return (
        <Container>
            <div className="resetPassword">
                <div className="resetPassword-container">
                    <h2 className="resetPassword-title">Change password</h2>
                    <form
                        id="resetPasswordForm"
                        className="resetPassword-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="resetPassword-form--container">
                            <label
                                className="resetPassword-form--label"
                                htmlFor="resetPassword-password"
                            >
                                Email:
                            </label>
                            <input
                                className="resetPassword-form--input"
                                type="password"
                                id="resetPassword-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="resetPassword-form--button"
                        >
                            Change password
                        </button>
                    </form>
                </div>
            </div>
        </Container>
    )
}
export default ResetPassword
