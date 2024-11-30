import React, {useState} from "react";
import {toast} from "react-toastify";
import "../styles/pages/Signup.css";
import Container from "../components/Container.jsx";
import {Link} from "react-router-dom";
import {signupUser} from "../api/auth.js";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await signupUser(formData);
            toast.success(response.message || "You have successfully signed up!", {
                theme: "dark"
            });
            setFormData({ username: "", email: "", password: "" });
        } catch (error) {
            toast.error(error.message || "An error occurred during signup.", {
                theme: "dark"
            });
        }
    };

    return (
        <Container>
            <div className='registration'>
                <div className="registration-container">
                    <h2 className="registration-title">Sign up now!</h2>
                    <form id="registrationForm" className="registration-form" onSubmit={handleSubmit}>
                        <div className="registration-form--container">
                            <label className="registration-form--label" htmlFor="username">
                                Username:
                            </label>
                            <input
                                className="registration-form--input"
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="registration-form--container">
                            <label className="registration-form--label" htmlFor="email">
                                Email:
                            </label>
                            <input
                                className="registration-form--input"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="registration-form--container">
                            <label className="registration-form--label" htmlFor="password">
                                Password:
                            </label>
                            <input
                                className="registration-form--input"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="registration-form--button">
                            Sign up
                        </button>
                        <p>
                            If you already have an account,{" "}
                            <Link className="registration-form--link" to="/signin">
                                sign in
                            </Link>
                            !
                        </p>
                    </form>
                </div>
            </div>
        </Container>
    );
};

export default Signup;
