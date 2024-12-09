import React, {useEffect, useState} from 'react';
import Container from "../components/Container.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import sprite from "../assets/symbol-defs.svg";
import '../styles/pages/TrackById.css';
import {deleteSong, getSongById} from "../api/songs.js";
import {toast} from "react-toastify";
import {IoIosAdd} from "react-icons/io";
import {FaRegTrashAlt} from "react-icons/fa";
import {FaPencil} from "react-icons/fa6";
import {isAdmin} from "../utils/isAdmin.js";
import {addSongToPlaylist, getUserPlaylists} from "../api/playlists.js";
import {getUserId} from "../utils/getUserId.js";

const TrackById = () => {
    const navigate = useNavigate();
    const {song_id} = useParams();
    const [track, setTrack] = useState([]);
    const [userId, setUserId] = useState(getUserId());
    const [playlists, setPlaylists] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const loadData = async () => {
        try {
            const trackData = await getSongById(song_id);
            setTrack(trackData);
        } catch (error) {
            navigate('/tracks')
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    const fetchPlaylists = async () => {
        try {
            const data = await getUserPlaylists(userId);
            setPlaylists(data);
        } catch (error) {
            toast.error("Failed to load playlists.", {theme: "dark"});
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const response = await addSongToPlaylist(playlistId, song_id);
            toast.success(response.message || "Song successfully added to playlist!", {
                theme: "dark"
            });
            setIsMenuOpen(false);
        } catch (error) {
            toast.error(error.message || "Error in adding song to playlist!", {
                theme: "dark"
            });
        }
    };

    const handleDeleteTrack = async () => {
        try {
            const response = await deleteSong(song_id);
            toast.success(response.message || "Song successfully deleted!", {
                theme: "dark"
            });
            setIsModalDeleteOpen(false);
            navigate('/tracks')
        } catch (error) {
            toast.error(error.message || "Error in deleting song!", {
                theme: "dark"
            });
        }
    }

    useEffect(() => {
        loadData();
        fetchPlaylists();
    }, []);

    return (
        <Container>
            <div className='trackById-wrapper'>
                <Link to={'/tracks'} className='trackById-link--back'>
                    <svg className="trackById-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back
                </Link>

                <div className="trackById">
                    <div className="trackById-container">
                        <div className="trackById-card">
                            <img className="trackById-album-photo" src={track?.data?.song_photo} alt="performer"/>
                            <div className='trackById-album-info'>
                                <h2 className="trackById-title">{track?.data?.title}</h2>
                                <Link to={`/performer/${track?.data?.performer_id}`} className="trackById-performer">
                                    <img className="trackById-album-performerPhoto" src={track?.data?.performer_photo}
                                         alt="performer"/>
                                    {track?.data?.performer_name}
                                </Link>
                                {track?.data?.album_title !== null &&
                                    (<p className="trackById-album">
                                        <strong>Album: </strong>{track?.data?.album_title}
                                    </p>)
                                }
                                {track?.data?.description !== null &&
                                    (<p className="trackById-album">
                                        <strong>Description: </strong>{track?.data?.description}
                                    </p>)
                                }
                                <p className="trackById-release-date">
                                    <strong>Release
                                        Date: </strong>{new Date(track?.data?.release_date).toLocaleDateString()}
                                </p>
                                <p className="trackById-duration">
                                    <strong>Duration: </strong>{track?.data?.duration} seconds
                                </p>
                            </div>
                            <div className='trackById-album-buttons'>
                                <div className="trackById-add-playlist">
                                    <button className='trackById-album-button'
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                        <IoIosAdd
                                            className={`trackById-album-button-icon ${isMenuOpen && 'addIconPlaylist'}`}
                                            size={30}/>
                                    </button>
                                    {isMenuOpen && (
                                        <div className="trackById-playlist-menu">
                                            {playlists?.data?.length > 0 ? (
                                                playlists?.data?.map(playlist => (
                                                    <button
                                                        key={playlist.playlist_id}
                                                        className="trackById-playlist-item"
                                                        onClick={() => handleAddToPlaylist(playlist.playlist_id)}
                                                    >
                                                        {playlist.title}
                                                    </button>
                                                ))
                                            ) : (
                                                <p>No playlists available.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isAdmin() === 'admin' && (
                                    <>
                                        <Link to={`/track/edit-track/${song_id}`} className='trackById-album-button'>
                                            <FaPencil className='trackById-album-button-icon' size={17}/>
                                        </Link>
                                        <div style={{ position: 'relative' }}>
                                            <button className='trackById-album-button'
                                                    onClick={() => setIsModalDeleteOpen(!isModalDeleteOpen)}>
                                                <FaRegTrashAlt className='trackById-album-button-icon' size={17}/>
                                            </button>
                                            {isModalDeleteOpen && (
                                                <div className="trackById-playlist-delete--modal">
                                                    <p>Are you sure that you want to delete this song?</p>

                                                    <div className="trackById-delete-buttons">
                                                        <button className='trackById-delete-button' onClick={handleDeleteTrack}>Yes</button>
                                                        <button className='trackById-delete-button' onClick={() => setIsModalDeleteOpen(false)}>No</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default TrackById;
