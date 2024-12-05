import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../styles/pages/AlbumsCreate.css";
import {Link, useNavigate} from "react-router-dom";
import Container from "../components/Container.jsx";
import {addAlbum} from "../api/albums.js";
import sprite from "../assets/symbol-defs.svg";
import {getAllPerformers} from "../api/performer.js";

const AlbumsCreate = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: null,
        release_date: "",
        performer_id: null,
        photo: ''
    });

    const [performers, setPerformers] = useState([]);
    const [search, setSearch] = useState("");

    const loadData = async () => {
        try {
            const performersData = await getAllPerformers();
            setPerformers(performersData);
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

        return name?.toLowerCase().includes(search.toLowerCase());
    });

    console.log(formData.photo)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, photo: file }));
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.performer_id === null) {
            toast.error("Choose album's performer!", {
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

            if (formData.photo) {
                formDataToSend.append("photo", formData.photo);
            }

            const response = await addAlbum(formDataToSend);
            toast.success(response.message || "You have successfully created album!", {
                theme: "dark",
            });

            navigate("/albums");
        } catch (error) {
            toast.error(error.message || "An error occurred during creating album.", {
                theme: "dark",
            });
        }
    };


    return (
        <Container>
            <div className='albumCreate-wrapper'>
                <Link to={'/albums'} className='albumCreate-link--back'>
                    <svg className="albumCreate-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back</Link>

                <div className="albumCreate">
                    <div className="albumCreate-container">
                        <h2 className="albumCreate-title">Create album</h2>
                        <form
                            id="albumCreateForm"
                            className="albumCreate-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="albumCreate-form--container">
                                <label
                                    className="albumCreate-form--label"
                                    htmlFor="title"
                                >
                                    Title: *
                                </label>
                                <input
                                    className="albumCreate-form--input"
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="albumCreate-form--container">
                                <label
                                    className="albumCreate-form--label"
                                    htmlFor="release_date"
                                >
                                    Release date: *
                                </label>
                                <input
                                    className="albumCreate-form--input"
                                    type="date"
                                    id="release_date"
                                    name="release_date"
                                    max={new Date().toISOString().split("T")[0]}
                                    value={formData.release_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="albumCreate-form--container">
                                <label className="albumCreate-form--label" htmlFor="performer_id">
                                    Performer: *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search performer..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    className="albumCreate-form--input"
                                />
                                <select
                                    className="albumCreate-form--select"
                                    name="performer_id"
                                    id="performer_id"
                                    value={formData.performer_id}
                                    onChange={handleChange}
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
                            <div className="albumCreate-form--file-container">
                                <label className="albumCreate-form--label" htmlFor="photo">
                                    Album photo: *
                                </label>
                                <input
                                    lang='en'
                                    className="albumCreate-form--file-button"
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="albumCreate-form--container">
                                <label
                                    className="albumCreate-form--label"
                                    htmlFor="description"
                                >
                                    Description:
                                </label>
                                <textarea
                                    className="albumCreate-form--textarea"
                                    rows='6'
                                    id="description"
                                    name="description"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="albumCreate-form--button"
                            >
                                Create album
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default AlbumsCreate;
