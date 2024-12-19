import React, {useEffect, useState} from "react";
import "../styles/pages/Home.css";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {getAllSongs} from "../api/songs.js";
import {getAllAlbums} from "../api/albums.js";
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";

const Home = () => {
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);

    const loadData = async () => {
        try {
            const songsData = await getAllSongs();
            const albumsData = await getAllAlbums();

            setSongs(songsData);
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

    const handleToggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleToggleAside = () => {
        setIsAsideOpen((prev) => !prev);
    };

    const handleResize = () => {
        if (window.innerWidth >= 1024) {
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

    return (
        <div className="home">
            <Aside isAsideOpen={isAsideOpen} handleToggleMenu={handleToggleMenu} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

            <div className={`main ${isAsideOpen ? "shift" : ""}`}>
                <div className="main-container container">
                    <Header handleToggleAside={handleToggleAside}/>

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
                                        <Link to={`/track/${song_id}`} className="main-tracks--card" key={song_id}>
                                            <img
                                                className="tracks-card--img"
                                                src={path}
                                                alt="Track cover"
                                            />
                                            <div className="tracks-card--content">
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
                        <div className="main-tracks">
                            <h2 className="main-tracks--title" style={{marginTop: '1.5rem'}}>Albums</h2>
                            <div className="main-tracks--container-wrapper">
                                <div className="main-tracks--container">
                                    {albums?.data?.map(({
                                                            album_id,
                                                            title,
                                                            photo_path,
                                                            performer_name,
                                                        }) => (
                                        <Link to={`/album/${album_id}`} className="main-tracks--card" key={album_id}>
                                            <img
                                                className="tracks-card--img"
                                                src={photo_path}
                                                alt="Track cover"
                                            />
                                            <div className="tracks-card--content">
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
        </div>
    );
};

export default Home;
