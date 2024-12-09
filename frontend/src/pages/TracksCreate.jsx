import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../styles/pages/TracksCreate.css";
import {Link, useNavigate} from "react-router-dom";
import Container from "../components/Container.jsx";
import {addSong} from "../api/songs.js";
import sprite from "../assets/symbol-defs.svg";
import {getAllPerformers} from "../api/performer.js";
import {getAllAlbums} from "../api/albums.js";
import {throttle} from "lodash";

const TracksCreate = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: null,
        release_date: "",
        performer_id: null,
        photo: '',
        duration: null,
        album_id: null,
    });

    const [performers, setPerformers] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [searchPerformers, setPerformersSearch] = useState("");
    const [searchAlbums, setAlbumsSearch] = useState("");

    const loadData = async () => {
        try {
            const performersData = await getAllPerformers();
            const albumsData = await getAllAlbums();
            setPerformers(performersData);
            setAlbums(albumsData);
        } catch (error) {
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredPerformers = performers?.filter((performer) => {
        const name = performer?.type === "artist"
            ? performer?.artistDetails?.name
            : performer?.groupDetails?.name;

        return name?.toLowerCase().includes(searchPerformers.toLowerCase());
    });

    const handlePerformersSearchChange = (e) => {
        setPerformersSearch(e.target.value);
    };

    const filteredAlbums = albums?.data?.filter((album) => {
        const isPerformerMatch = album?.performer_id === Number(formData.performer_id); // Проверка на принадлежность исполнителю
        const isSearchMatch = album?.title?.toLowerCase().includes(searchAlbums.toLowerCase()); // Поиск по названию

        return isPerformerMatch && isSearchMatch; // Условие для фильтрации
    });

    const handleAlbumsSearchChange = (e) => {
        setAlbumsSearch(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, photo: file }));
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePerformerChange = (e) => {
        const performerId = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            performer_id: performerId,
            album_id: null,
        }));
    };

    const handleAlbumChange = (e) => {
        const albumId = e.target.value;

        setFormData((prevData) => ({
            ...prevData,
            album_id: albumId,
        }));
    };

    const submitForm = async (e) => {
        if (formData.performer_id === null) {
            toast.error("Choose track's performer!", {
                theme: "dark",
            });
            return;
        }

        try {
            const formDataToSend = new FormData();

            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("release_date", formData.release_date);
            formDataToSend.append("performer_id", formData.performer_id);
            formDataToSend.append("duration", formData.duration);

            if (formData.album_id) {
                formDataToSend.append("album_id", formData.album_id);
            }

            if (formData.photo) {
                formDataToSend.append("photo", formData.photo);
            }

            const response = await addSong(formDataToSend);
            toast.success(response.message || "You have successfully created track!", {
                theme: "dark",
            });

            navigate("/tracks");
        } catch (error) {
            toast.error(error.message || "An error occurred during creating track.", {
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
            <div className='trackCreate-wrapper'>
                <Link to={'/tracks'} className='trackCreate-link--back'>
                    <svg className="trackCreate-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back</Link>

                <div className="trackCreate">
                    <div className="trackCreate-container">
                        <h2 className="trackCreate-title">Create track</h2>
                        <form
                            id="trackCreateForm"
                            className="trackCreate-form"
                            onSubmit={onSubmit}
                        >
                            <div className="trackCreate-form--container">
                                <label
                                    className="trackCreate-form--label"
                                    htmlFor="title"
                                >
                                    Title: *
                                </label>
                                <input
                                    className="trackCreate-form--input"
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="trackCreate-form--container">
                                <label
                                    className="trackCreate-form--label"
                                    htmlFor="duration"
                                >
                                    Duration (in sec): *
                                </label>
                                <input
                                    className="trackCreate-form--input"
                                    type="number"
                                    min="1"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="trackCreate-form--container">
                                <label
                                    className="trackCreate-form--label"
                                    htmlFor="release_date"
                                >
                                    Release date: *
                                </label>
                                <input
                                    className="trackCreate-form--input"
                                    type="date"
                                    id="release_date"
                                    name="release_date"
                                    max={new Date().toISOString().split("T")[0]}
                                    value={formData.release_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="trackCreate-form--container">
                                <label className="trackCreate-form--label" htmlFor="performer_id">
                                    Performer: *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search performer..."
                                    value={searchPerformers}
                                    onChange={handlePerformersSearchChange}
                                    className="trackCreate-form--input"
                                />
                                <select
                                    className="trackCreate-form--select"
                                    name="performer_id"
                                    id="performer_id"
                                    value={formData.performer_id}
                                    onChange={handlePerformerChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select performer
                                    </option>
                                    {filteredPerformers?.map((performer) => {
                                        const name =
                                            performer?.type === "artist"
                                                ? performer?.artistDetails?.name
                                                : performer?.groupDetails?.name;

                                        return (
                                            <option key={performer?.performer_id} value={performer?.performer_id}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="trackCreate-form--container">
                                <label className="trackCreate-form--label" htmlFor="album_id">
                                    Album:
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search album..."
                                    value={searchAlbums}
                                    onChange={handleAlbumsSearchChange}
                                    className="trackCreate-form--input"
                                />
                                <select
                                    className="trackCreate-form--select"
                                    name="album_id"
                                    id="album_id"
                                    value={formData.album_id}
                                    onChange={handleAlbumChange}
                                >
                                    <option value="">No album</option>
                                    {filteredAlbums?.map((album) => (
                                        <option key={album?.album_id} value={album?.album_id}>
                                            {album?.title} (by {album?.performer_name})
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className="trackCreate-form--file-container">
                                <label className="trackCreate-form--label" htmlFor="photo">
                                    Track photo: *
                                </label>
                                <input
                                    lang='en'
                                    className="trackCreate-form--file-button"
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="trackCreate-form--container">
                                <label
                                    className="trackCreate-form--label"
                                    htmlFor="description"
                                >
                                    Description:
                                </label>
                                <textarea
                                    className="trackCreate-form--textarea"
                                    rows='6'
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="trackCreate-form--button"
                            >
                                Create track
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default TracksCreate;
