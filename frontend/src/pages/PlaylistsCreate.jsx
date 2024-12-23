import React, {useState} from "react";
import {toast} from "react-toastify";
import "../styles/pages/PlaylistsCreate.css";
import {Link, useNavigate} from "react-router-dom";
import Container from "../components/Container.jsx";
import {createPlaylist} from "../api/playlists.js";
import sprite from "../assets/symbol-defs.svg";
import {throttle} from "lodash";

const PlaylistsCreate = () => {
    const [formData, setFormData] = useState({
        title: "My playlist",
        description: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const submitForm = async (e) => {
        try {
            const user_id = localStorage.getItem('user_id');

            const response = await createPlaylist(Object.assign({}, {user_id}, formData));
            toast.success(response.message || "You have successfully created playlist!", {
                theme: "dark"
            });

            navigate("/playlists");
        } catch (error) {
            toast.error(error.message || "An error occurred during creating playlist.", {
                theme: "dark"
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
            <div className='playlistCreate-wrapper'>
                <Link to={'/playlists'} className='playlistCreate-link--back'>
                    <svg className="playlistCreate-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back</Link>

                <div className="playlistCreate">
                    <div className="playlistCreate-container">
                        <h2 className="playlistCreate-title">Create playlist</h2>
                        <form
                            id="playlistCreateForm"
                            className="playlistCreate-form"
                            onSubmit={onSubmit}
                        >
                            <div className="playlistCreate-form--container">
                                <label
                                    className="playlistCreate-form--label"
                                    htmlFor="title"
                                >
                                    Title: *
                                </label>
                                <input
                                    className="playlistCreate-form--input"
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="playlistCreate-form--container">
                                <label
                                    className="playlistCreate-form--label"
                                    htmlFor="description"
                                >
                                    Description:
                                </label>
                                <textarea
                                    className="playlistCreate-form--textarea"
                                    rows='6'
                                    id="description"
                                    name="description"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="playlistCreate-form--button"
                            >
                                Create playlist
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default PlaylistsCreate;
