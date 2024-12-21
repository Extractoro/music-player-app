import React, {useEffect, useState} from 'react'
import Container from "../components/Container.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import sprite from "../assets/symbol-defs.svg";
import '../styles/pages/AlbumById.css';
import {isAdmin} from "../utils/isAdmin.js";
import {FaPencil} from "react-icons/fa6";
import {FaRegTrashAlt} from "react-icons/fa";
import {getUserId} from "../utils/getUserId.js";
import {toast} from "react-toastify";
import {addSongToPlaylist, getUserPlaylists} from "../api/playlists.js";
import {deleteAlbum, getAlbumById} from "../api/albums.js";

const AlbumById = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [album, setAlbum] = useState([]);
    const [userId, setUserId] = useState(getUserId());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const loadData = async () => {
        try {
            const albumData = await getAlbumById(id);
            setAlbum(albumData);
        } catch (error) {
            navigate('/albums')
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const response = await addSongToPlaylist(playlistId, id);
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

    const handleDeleteAlbum = async () => {
        try {
            const response = await deleteAlbum(id);
            toast.success(response.message || "Song successfully deleted!", {
                theme: "dark"
            });
            setIsModalDeleteOpen(false);
            navigate('/albums')
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
            <div className='albumById-wrapper'>
                <Link to={'/albums'} className='albumById-link--back'>
                    <svg className="albumById-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back
                </Link>

                <div className="albumById">
                    <div className="albumById-container">
                        <div className="albumById-card">
                            <img className="albumById-album-photo" src={album?.data?.album_photo_path} alt="performer"/>
                            <div className='albumById-album-info'>
                                <h2 className="albumById-title">{album?.data?.title}</h2>
                                <Link to={`/performer/${album?.data?.performer_id}`} className="albumById-performer">
                                    <img className="albumById-album-performerPhoto" src={album?.data?.performer_photo_path}
                                         alt="performer"/>
                                    {album?.data?.performer_name}
                                </Link>
                                {album?.data?.title !== null &&
                                    (<p className="albumById-album">
                                        <strong>Album: </strong>{album?.data?.title}
                                    </p>)
                                }
                                {album?.data?.description !== null &&
                                    (<p className="albumById-album">
                                        <strong>Description: </strong>{album?.data?.description}
                                    </p>)
                                }
                                <p className="albumById-release-date">
                                    <strong>Release
                                        Date: </strong>{new Date(album?.data?.release_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='albumById-album-buttons'>
                                {isAdmin() === 'admin' && (
                                    <>
                                        <Link to={`/album/edit-album/${id}`} className='albumById-album-button'>
                                            <FaPencil className='albumById-album-button-icon' size={17}/>
                                        </Link>
                                        <div style={{ position: 'relative' }}>
                                            <button className='albumById-album-button'
                                                    onClick={() => setIsModalDeleteOpen(!isModalDeleteOpen)}>
                                                <FaRegTrashAlt className='albumById-album-button-icon' size={17}/>
                                            </button>
                                            {isModalDeleteOpen && (
                                                <div className="albumById-playlist-delete--modal">
                                                    <p>Are you sure that you want to delete this album?</p>

                                                    <div className="albumById-delete-buttons">
                                                        <button className='albumById-delete-button' onClick={handleDeleteAlbum}>Yes</button>
                                                        <button className='albumById-delete-button' onClick={() => setIsModalDeleteOpen(false)}>No</button>
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
}
export default AlbumById
