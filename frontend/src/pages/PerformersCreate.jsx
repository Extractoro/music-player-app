import React, { useState } from "react";
import { toast } from "react-toastify";
import "../styles/pages/PerformersCreate.css";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";
import { addPerformer } from "../api/performer.js";
import sprite from "../assets/symbol-defs.svg";
import {throttle} from "lodash";

const PerformersCreate = () => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        genre: "",
        country: "",
        career_started_date: "",
        birthday_date: "",
        year_created: "",
        photo: "",
        bio: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, photo: file }));
    };

    const submitForm = async (e) => {
        if (!formData.type) {
            toast.error("Choose performer type!", { theme: "dark" });
            return;
        }

        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    formDataToSend.append(key, value);
                }
            });

            const response = await addPerformer(formDataToSend);
            toast.success(response.message || "You have successfully created the performer!", { theme: "dark" });
            navigate("/performers");
        } catch (error) {
            toast.error(error.message || "An error occurred while creating the performer.", { theme: "dark" });
        }
    };

    const throttledSubmit = throttle(submitForm, 5000, { leading: true, trailing: false });

    const onSubmit = (e) => {
        e.preventDefault();
        throttledSubmit();
    };

    return (
        <Container>
            <div className="performersCreate-wrapper">
                <Link to={"/performers"} className="performersCreate-link--back">
                    <svg className="performersCreate-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back
                </Link>

                <div className="performersCreate">
                    <div className="performersCreate-container">
                        <h2 className="performersCreate-title">Create performer</h2>
                        <form id="performersForm" className="performersCreate-form" onSubmit={onSubmit}>
                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="type">
                                    Performer Type: *
                                </label>
                                <select
                                    className="performersCreate-form--select"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select type
                                    </option>
                                    <option value="artist">Solo Artist</option>
                                    <option value="group">Group</option>
                                </select>
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="name">
                                    Name: *
                                </label>
                                <input
                                    className="performersCreate-form--input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="genre">
                                    Genre: *
                                </label>
                                <input
                                    className="performersCreate-form--input"
                                    type="text"
                                    id="genre"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="country">
                                    Country: *
                                </label>
                                <input
                                    className="performersCreate-form--input"
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="bio">
                                    Biography:
                                </label>
                                <textarea
                                    className="performersCreate-form--textarea"
                                    id="bio"
                                    name="bio"
                                    rows="6"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </div>

                            {formData.type === "artist" && (
                                <>
                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="birthday_date">
                                            Birthday (Year): *
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="number"
                                            id="birthday_date"
                                            name="birthday_date"
                                            value={formData.birthday_date}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            required
                                        />
                                    </div>

                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="career_started_date">
                                            Career Started (Year): *
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="number"
                                            id="career_started_date"
                                            name="career_started_date"
                                            value={formData.career_started_date}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {formData.type === "group" && (
                                <div className="performersCreate-form--container">
                                    <label className="performersCreate-form--label" htmlFor="year_created">
                                        Year Created: *
                                    </label>
                                    <input
                                        className="performersCreate-form--input"
                                        type="number"
                                        id="year_created"
                                        name="year_created"
                                        value={formData.year_created}
                                        onChange={handleChange}
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        required
                                    />
                                </div>
                            )}

                            <div className="performersCreate-form--file-container">
                                <label className="performersCreate-form--label" htmlFor="photo">
                                    {formData.type === "group" ? "Group" : "Artist"} Photo: *
                                </label>
                                <input
                                    className="performersCreate-form--file-button"
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="performersCreate-form--button">
                                Create Performer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default PerformersCreate;
