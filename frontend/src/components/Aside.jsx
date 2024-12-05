import React, {useEffect, useRef, useState} from 'react'
import {Link, useLocation, useNavigate} from "react-router-dom";
import sprite from "../assets/symbol-defs.svg";
import {getUserPlaylists} from "../api/playlists.js";
import {toast} from "react-toastify";
import {handleLogout} from "../utils/handleLogout.js";

const Aside = ({isAsideOpen, setIsMenuOpen, handleToggleMenu, isMenuOpen}) => {
    const navigate = useNavigate();
    const [userPlaylists, setUserPlaylists] = useState([]);
    const buttonRef = useRef(null);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const loadData = async () => {
        try {
            const userPlaylistsData = await getUserPlaylists(localStorage.getItem('user_id'));

            setUserPlaylists(userPlaylistsData);
        } catch (error) {
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const logoutClick = async () => {
        await handleLogout();
        setIsMenuOpen(false);
        navigate('/signin');
    }

    return (
        <>
            <aside className={`aside ${isAsideOpen ? "open" : ""}`}>
                <div className="aside-container">
                    <div className="aside-profile">
                        <Link to={`/profile`} className={`aside-button ${isActive('/profile') ? 'active' : ''}`}>
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
                        <Link to="/" className={`aside-navigation--link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                    </div>
                    <div className="aside-collection">
                        <h3 className="aside-collection--title">My Collection</h3>
                        <div className="aside-collection--container">
                            <Link to={`/playlists`} className={`aside-collection--link ${isActive('/playlists') ? 'active' : ''}`}>
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#playlists`}></use>
                                </svg>
                                Playlists
                            </Link>
                            <Link to={`/albums`} className={`aside-collection--link ${isActive('/albums') ? 'active' : ''}`}>
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#albums`}></use>
                                </svg>
                                Albums
                            </Link>
                            <Link to={`/tracks`} className={`aside-collection--link ${isActive('/tracks') ? 'active' : ''}`}>
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#tracks`}></use>
                                </svg>
                                Tracks
                            </Link>
                            <Link to={`/performers`} className={`aside-collection--link ${isActive('/performers') ? 'active' : ''}`}>
                                <svg className="aside-collection--icon">
                                    <use href={`${sprite}#artists`}></use>
                                </svg>
                                Performers
                            </Link>
                        </div>
                    </div>
                    <div className="aside-playlists">
                        <h3 className="aside-playlists--title">My Playlists</h3>
                        <div className="aside-playlists--container">
                            {userPlaylists?.data?.map(({
                                                           description,
                                                           duration,
                                                           playlist_id,
                                                           song_count,
                                                           title
                                                       }) => (
                                <Link to={`/playlist/${playlist_id}`}
                                      className="aside-playlists--link" key={playlist_id}>{title}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Menu */}
            <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
                <ul className="menu-list">
                    <li className="list-item">
                        <button onClick={logoutClick} className="list-item--button">Log Out
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}
export default Aside
