import React, { useState } from "react";
import { toast } from "react-toastify";
import "../styles/pages/ProfileEdit.css";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { signinUser } from "../api/auth";
import Cookies from "js-cookie";
import {throttle} from "lodash";

const ProfileEdit = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // const handleSubmit = throttle(async (e) => {
    //     e.preventDefault();
    //
    //     try {
    //         const response = await (formData);
    //         toast.success(response.message || "You have successfully signed in!", {
    //             theme: "dark"
    //         });
    //
    //         navigate("/profile");
    //     } catch (error) {
    //         toast.error(error.message || "An error occurred during signin.", {
    //             theme: "dark"
    //         });
    //     }
    // }, 5000);

    return (
        <Container>
            <div className="login">
                <div className="login-container">
                    <h2 className="login-title">Sign in</h2>
                    <form
                        id="loginForm"
                        className="login-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="login-form--container">
                            <label
                                className="login-form--label"
                                htmlFor="login-email"
                            >
                                Email:
                            </label>
                            <input
                                className="login-form--input"
                                type="email"
                                id="login-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="login-form--container">
                            <label
                                className="login-form--label"
                                htmlFor="login-password"
                            >
                                Password:
                            </label>
                            <input
                                className="login-form--input"
                                type="password"
                                id="login-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <Link className="login-form--link" to="/forget-password">
                            Forget password
                        </Link>
                        <button
                            type="submit"
                            className="login-form--button"
                        >
                            Sign in
                        </button>
                        <p>
                            If you haven't got an account,{" "}
                            <Link className="login-form--link" to="/signup">
                                sign up
                            </Link>
                            !
                        </p>
                    </form>
                </div>
            </div>
        </Container>
    );
};

export default ProfileEdit;
