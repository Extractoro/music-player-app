import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../styles/pages/TracksCreate.css";
import {Link, useNavigate, useParams} from "react-router-dom";
import Container from "../components/Container.jsx";
import {addSong, updateSong} from "../api/songs.js";
import sprite from "../assets/symbol-defs.svg";
import {getAllPerformers} from "../api/performer.js";
import {getAllAlbums} from "../api/albums.js";

const TracksCreate = () => {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        title: null,
        description: null,
        release_date: null,
        duration: null,
        album_id: null,
        performer_id: null,
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
        const isPerformerMatch = album?.performer_id === Number(formData.performer_id);
        const isSearchMatch = album?.title?.toLowerCase().includes(searchAlbums.toLowerCase());

        return isPerformerMatch && isSearchMatch;
    });

    const handleAlbumsSearchChange = (e) => {
        setAlbumsSearch(e.target.value);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.performer_id === null) {
            toast.error("Choose track's performer!", {
                theme: "dark",
            });
            return;
        }

        if (!id) {
            toast.error("No song id!", {
                theme: "dark",
            });
            return;
        }

        try {
            const response = await updateSong(id, formData);
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
                        <h2 className="trackCreate-title">Edit track</h2>
                        <form
                            id="trackCreateForm"
                            className="trackCreate-form"
                            onSubmit={handleSubmit}
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
                                Edit track
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default TracksCreate;
