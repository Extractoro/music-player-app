import React, { useState } from "react";
import "../styles/components/SongTable.css";
import { Link, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { removeSongFromPlaylist } from "../api/playlists.js";

const SongTable = ({ songs, playlistId }) => {
    const navigate = useNavigate();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [selectedSongTitle, setSelectedSongTitle] = useState(null);

    const handleDeleteSongFromPlaylist = async () => {
        try {
            const response = await removeSongFromPlaylist(playlistId, selectedSongId);
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

    return (
        <div className="song-table-wrapper">
            {songs.length === 0 ? (
                <div className="no-songs-message">
                    <p>You haven't added any songs yet.</p>
                </div>
            ) : (
                <div className="song-table">
                    <div className="song-table-header">
                        <div className="song-table-cell">#</div>
                        <div className="song-table-cell">Title</div>
                        <div className="song-table-cell">Album</div>
                        <div className="song-table-cell">Realise Date</div>
                        <div className="song-table-cell">Duration</div>
                    </div>
                    {songs.map((song, index) => (
                        <div className="song-table-row" key={song?.song_id}>
                            <div className="song-table-cell">{index + 1}</div>
                            <div className="song-table-cell">
                                <div className="song-title">
                                    <img
                                        className="song-thumbnail"
                                        src={`${song?.song_path}`}
                                        alt={song?.title}
                                    />
                                    <div>
                                        <p>
                                            <Link to={`/track/${song?.song_id}`}>{song?.title}</Link>
                                        </p>
                                        <small>
                                            <Link to={`/performer/${song?.performer_id}`}>
                                                {song?.performer_name}
                                            </Link>
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="song-table-cell">{song?.album_id ? (
                                <Link to={`/album/${song?.album_id}`}>{song?.album_name}</Link>
                            ) : (
                                "No album"
                            )}</div>
                            <div className="song-table-cell">
                                {new Date(song?.release_date).toLocaleDateString()}
                            </div>
                            <div className="song-table-cell">
                                {Math.floor(song?.duration / 60)}:{String(song?.duration % 60).padStart(2, '0')}
                            </div>
                            <div className="song-table-cell">
                                <button
                                    className="song-table-album-button"
                                    onClick={() => openDeleteModal(song.song_id, song.title)}
                                >
                                    <FaRegTrashAlt className="song-table-album-button-icon" size={17}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isModalDeleteOpen && (
                <div
                    className="modal-overlay"
                    onClick={() => setIsModalDeleteOpen(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>Are you sure that you want to delete this song ({selectedSongTitle.trim()}) from playlist?</p>
                        <div className="modal-buttons">
                            <button className="modal-button" onClick={handleDeleteSongFromPlaylist}>
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

export default SongTable;
