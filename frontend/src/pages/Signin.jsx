import React, { useState } from "react";
import { toast } from "react-toastify";
import "../styles/pages/Signin.css";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { signinUser } from "../api/auth";
import Cookies from "js-cookie";
import {throttle} from "lodash";

const Signin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submitForm = async (e) => {
        try {
            const response = await signinUser(formData);

            toast.success(response.message || "You have successfully signed in!", {
                theme: "dark",
            });

            localStorage.setItem("user_id", response.user.user_id);
            localStorage.setItem("token", `Bearer ${response.token}`);
            Cookies.set("token", response.token, { expires: 1, secure: true, sameSite: 'Strict' });

            navigate("/");
        } catch (error) {
            toast.error(error.message || "An error occurred during signin.", {
                theme: "dark",
            });
        }
    };

    const throttledSubmit = throttle(submitForm, 5000, { leading: true, trailing: false });

    const onSubmit = (e) => {
        e.preventDefault();
        throttledSubmit();
    };

    return (
        <Container>
            <div className="login">
                <div className="login-container">
                    <h2 className="login-title">Sign in</h2>
                    <form
                        id="loginForm"
                        className="login-form"
                        onSubmit={onSubmit}
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

export default Signin;
