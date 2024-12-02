import React, {useEffect, useRef, useState} from "react";
import sprite from '../assets/symbol-defs.svg';
import "../styles/pages/Home.css";
import {logoutUser} from "../api/auth.js";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import {getAllSongs} from "../api/songs.js";

const Home = () => {
    const navigate = useNavigate();
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const buttonRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const songsData = await getAllSongs();
            // const albumsData = await fetchAllAlbums();
            // const performersData = await fetchAllPerformers();

            setSongs(songsData);
            // setAlbums(albumsData);
            // setPerformers(performersData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleToggleAside = () => {
        setIsAsideOpen((prev) => !prev);
    };

    const handleResize = () => {
        if (window.innerWidth > 1024) {
            setIsAsideOpen(false);
        }
        setIsMenuOpen(false)
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            toast.success(response.message || "Logout successfully!", {
                theme: "dark",
            });
        } catch (error) {
            toast.error(error.message || "Failed to logout.", {
                theme: "dark",
            });
        }

        setIsMenuOpen(false);
        navigate('/signin')
    };


    return (
        <div className="home">
            <aside className={`aside ${isAsideOpen ? "open" : ""}`}>
                <div className="aside-container">
                    <div className="aside-profile">
                        <Link to={`/profile`} className="aside-button">
                            <svg className="aside-profile--icon">
                                <use href={`${sprite}#profile`}></use>
                            </svg>
                        </Link>
                        <button className="aside-button" onClick={handleToggleMenu} ref={buttonRef}>
                            <svg className="aside-profile--icon">
                                <use href={`${sprite}#dots`}></use>
                            </svg>
                        </button>
                    </div>
                    <div className="aside-navigation">
                        <a href="#" className="aside-navigation--link">Home</a>
                        <a href="#" className="aside-navigation--link">Explore</a>
                    </div>
                    <div className="aside-collection">
                        <h3 className="aside-collection--title">My Collection</h3>
                        <div className="aside-collection--container">
                            <a href="#" className="aside-collection--link">
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#playlists`}></use>
                                </svg>
                                Playlists
                            </a>
                            <a href="#" className="aside-collection--link">
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#albums`}></use>
                                </svg>
                                Albums
                            </a>
                            <a href="#" className="aside-collection--link">
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#tracks`}></use>
                                </svg>
                                Tracks
                            </a>
                            <a href="#" className="aside-collection--link">
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#artists`}></use>
                                </svg>
                                Artists
                            </a>
                        </div>
                    </div>
                    <div className="aside-playlists">
                        <h3 className="aside-playlists--title">My Playlists</h3>
                        <div className="aside-playlists--container">
                            <a href="#" className="aside-playlists--link">Playlists</a>
                        </div>
                    </div>
                </div>
            </aside>

            <div className={`main ${isAsideOpen ? "shift" : ""}`}>
                <div className="main-container container">
                    <header className="main-header">
                        <button id="aside-toggle" className="aside-toggle" onClick={handleToggleAside}>
                            <svg className="aside-close--icon">
                                <use href={`${sprite}#menu`}></use>
                            </svg>
                        </button>
                        <form method="post" className="header-form">
                            <label className="header-form--container">
                                <input
                                    className="header-form--input"
                                    type="search"
                                    placeholder="Search..."
                                />
                                <svg className="header-form--search-icon">
                                    <use href={`${sprite}#search`}></use>
                                </svg>
                            </label>
                        </form>
                    </header>
                    <div className="main-home">
                        <div className="main-tracks">
                            <h2 className="main-tracks--title">Tracks</h2>
                            <div className="main-tracks--container-wrapper">
                                <div className="main-tracks--container">
                                    {songs?.data?.map(({
                                                           song_id,
                                                           title,
                                                           path,
                                                           performer_name,
                                                       }) => (
                                        <Link to={`/song/${song_id}`} className="main-tracks--card" key={song_id}>
                                            <img
                                                className="tracks-card--img"
                                                src={path}
                                                alt="Track cover"
                                            />
                                            <div className="tracks-card--content" >
                                                <h2 className="tracks-card--title">{title}</h2>
                                                <p className="tracks-card--performer">
                                                    {performer_name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <ul className="menu-list">
                    <li className="list-item">
                        <button onClick={handleLogout} className="list-item--button">Log Out</button>
                    </li>
                </ul>
            </div>

        </div>
    );
};

export default Home;

// {
//     "song_id": 2,
//     "title": "Pain",
//     "description": null,
//     "release_date": "2020-05-09T21:00:00.000Z",
//     "duration": 121,
//     "album_id": 2,
//     "album_title": "Roopy",
//     "performer_id": 11,
//     "path": "https://res.cloudinary.com/dxt6akbqn/image/upload/v1732806680/performers/ioz7m8mtaexu5arpm5fo.jpg",
//     "performer_type": "artist",
//     "performer_name": "Paul Green"
// }