import React, {useEffect, useState} from "react";
import "../styles/components/AlbumTable.css";
import {Link, useNavigate} from "react-router-dom";
import {FaRegTrashAlt} from "react-icons/fa";
import {toast} from "react-toastify";
import {addSongToPlaylist, getUserPlaylists} from "../api/playlists.js";
import {isAdmin} from "../utils/isAdmin.js";
import {updateSong} from "../api/songs.js";
import {IoIosAdd} from "react-icons/io";
import {getUserId} from "../utils/getUserId.js";

const AlbumTable = ({songs, albumId}) => {
    const navigate = useNavigate();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [selectedSongTitle, setSelectedSongTitle] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userId, setUserId] = useState(getUserId());
    const [playlists, setPlaylists] = useState([]);

    const handleDeleteSongFromAlbum = async () => {
        try {
            const response = await updateSong(songs[0]?.song_id, {album_id: null});
            toast.success(response.message || "Song successfully deleted!", {
                theme: "dark",
            });
            setIsModalDeleteOpen(false);
            setSelectedSongId(null);
            setSelectedSongTitle(null);
            window.location.reload();
        } catch (error) {
            toast.error(error.message || "Error in deleting song!", {
                theme: "dark",
            });
        }
    };

    const openDeleteModal = (songId, songTitle) => {
        setSelectedSongId(songId);
        setSelectedSongTitle(songTitle);
        setIsModalDeleteOpen(true);
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const response = await addSongToPlaylist(playlistId, songs[0]?.song_id);
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

    const fetchPlaylists = async () => {
        try {
            const data = await getUserPlaylists(userId);
            setPlaylists(data);
        } catch (error) {
            toast.error("Failed to load playlists.", {theme: "dark"});
        }
    };

    useEffect(() => {
        fetchPlaylists()
    }, []);

    return (
        <div className="album-table-wrapper">
            {songs.length === 0 ? (
                <div className="no-songs-message">
                    <p>You haven't added any songs yet.</p>
                </div>
            ) : (
                <div className="album-table">
                    <div className="album-table-header">
                        <div className="album-table-cell">#</div>
                        <div className="album-table-cell">Title</div>
                        <div className="album-table-cell">Release Date</div>
                        <div className="album-table-cell">Duration</div>
                    </div>
                    {songs.map((song, index) => (
                        <div className="album-table-row" key={song?.song_id}>
                            <div className="album-table-cell">{index + 1}</div>
                            <div className="album-table-cell">
                                <div className="song-title">
                                    <img
                                        className="song-thumbnail"
                                        src={`${song?.path}`}
                                        alt={song?.song_title}
                                    />
                                    <div>
                                        <p>
                                            <Link to={`/track/${song?.song_id}`}>{song?.song_title}</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="album-table-cell">
                                {new Date(song?.song_release_date).toLocaleDateString()}
                            </div>
                            <div className="album-table-cell">
                                {Math.floor(song?.duration / 60)}:{String(song?.duration % 60).padStart(2, '0')}
                            </div>
                            <div className="album-table-cell">
                                <button className='trackById-album-button'
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <IoIosAdd
                                        className={`trackById-album-button-icon ${isMenuOpen && 'addIconPlaylist'}`}
                                        size={30}/>
                                </button>
                                {isMenuOpen && (<div
                                        className="modal-overlay"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div
                                            className="modal-content"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={() => setIsMenuOpen(false)} style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                color: 'white',
                                                background: 'none',
                                                fontSize: '18px'
                                            }}>x
                                            </button>
                                            <p style={{marginBottom: '0.5rem'}}>Choose the playlist in which you want to add the song: </p>
                                            <div style={{display: 'grid', gridTemplateCcolumns: '1fr 1fr 1fr'}}>
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

                                        </div>
                                    </div>
                                )}
                                {isAdmin() === 'admin' && (
                                    <button
                                        className="album-table-album-button"
                                        onClick={() => openDeleteModal(song.song_id, song.song_title)}
                                    >
                                        <FaRegTrashAlt className="album-table-album-button-icon" size={17}/>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
            {
                isModalDeleteOpen && (
                    <div
                        className="modal-overlay"
                        onClick={() => setIsModalDeleteOpen(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p>Are you sure that you want to delete this song ({selectedSongTitle.trim()}) from
                                playlist?</p>
                            <div className="modal-buttons">
                                <button className="modal-button" onClick={handleDeleteSongFromAlbum}>
                                    Yes
                                </button>
                                <button className="modal-button" onClick={() => setIsModalDeleteOpen(false)}>
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default AlbumTable;
