import React, {useEffect, useState} from 'react'
import {deletePlaylist, getSongsInPlaylist, getUserPlaylists} from "../api/playlists.js";
import {toast} from "react-toastify";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getUserId} from "../utils/getUserId.js";
import Container from "../components/Container.jsx";
import sprite from "../assets/symbol-defs.svg";
import '../styles/pages/PlaylistById.css';
import {FaRegTrashAlt} from "react-icons/fa";
import SongTable from "../components/SongTable.jsx";

const PlaylistById = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [userId, setUserId] = useState(getUserId());
    const [playlist, setPlaylist] = useState([]);
    const [songsInPlaylist, setSongsInPlaylist] = useState([]);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const loadData = async () => {
        try {
            const playlistsData = await getUserPlaylists(userId);
            const currentPlaylist = playlistsData?.data?.find(playlist => playlist.playlist_id === Number(id))
            setPlaylist(currentPlaylist);

            if (!currentPlaylist) {
                navigate('/playlists')
                toast.error("Playlist not found.", {
                    theme: "dark"
                });
            }

            const songs = await getSongsInPlaylist(id);
            setSongsInPlaylist(songs);
        } catch (error) {
            navigate('/playlists')
            toast.error(error.response.data.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    const handleDeletePlaylist = async () => {
        try {
            const response = await deletePlaylist(id);
            toast.success(response.message || "Song successfully deleted!", {
                theme: "dark"
            });
            setIsModalDeleteOpen(false);
            navigate('/playlists')
        } catch (error) {
            toast.error(error.message || "Error in deleting song!", {
                theme: "dark"
            });
        }
    }

    useEffect(() => {
        loadData()
    }, []);

    return (
        <Container>
            <div className='playlistById-wrapper'>
                <Link to={'/playlists'} className='playlistById-link--back'>
                    <svg className="playlistById-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back
                </Link>

                <div className="playlistById">
                    <div className="playlistById-container">
                        <div className="playlistById-card">
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                                <div className='playlistById-album-info'>
                                <h2 className="playlistById-title">{playlist?.title}</h2>
                                {playlist?.description !== null &&
                                    (<p className="playlistById-album">
                                        <strong>Description: </strong>{playlist?.description}
                                    </p>)
                                }
                                <p className="playlistById-release-date">
                                    <strong>Songs count: </strong>{playlist?.song_count}
                                </p>
                                <p className="playlistById-duration">
                                    <strong>Duration: </strong>{Math.floor(playlist?.duration / 60)} minutes
                                </p>
                            </div>
                                <div className='playlistById-album-buttons'>
                                        <div style={{ position: 'relative' }}>
                                            <button className='playlistById-album-button'
                                                    onClick={() => setIsModalDeleteOpen(!isModalDeleteOpen)}>
                                                <FaRegTrashAlt className='playlistById-album-button-icon' size={17}/>
                                            </button>
                                            {isModalDeleteOpen && (
                                                <div className="playlistById-playlist-delete--modal">
                                                    <p>Are you sure that you want to delete this playlist?</p>

                                                    <div className="playlistById-delete-buttons">
                                                        <button className='playlistById-delete-button'
                                                                onClick={handleDeletePlaylist}>Yes
                                                        </button>
                                                        <button className='playlistById-delete-button'
                                                                onClick={() => setIsModalDeleteOpen(false)}>No
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                            </div>
                            </div>
                            <div style={{width: '100%'}}>
                                <SongTable songs={songsInPlaylist} playlistId={id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}
export default PlaylistById
