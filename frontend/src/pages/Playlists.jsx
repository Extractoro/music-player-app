import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";
import {getUserPlaylists} from "../api/playlists.js";
import '../styles/pages/Playlists.css'

const Playlists = () => {
    const [itemOffset, setItemOffset] = useState(0);
    const [userPlaylists, setUserPlaylists] = useState([]);

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

    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    useEffect(() => {
        loadData();
    }, []);

    const itemsPerPage = 12;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = userPlaylists?.data?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(userPlaylists?.data?.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % userPlaylists?.data?.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <div className="home">
                <Aside isAsideOpen={isAsideOpen} handleToggleMenu={handleToggleMenu} setIsMenuOpen={setIsMenuOpen}
                       isMenuOpen={isMenuOpen}/>

                <div className={`main ${isAsideOpen ? "shift" : ""}`}>
                    <div className="main-container container">
                        <Header handleToggleAside={handleToggleAside}/>

                        <div className="main-home">
                            <div className="main-tracks">
                                <div className='playlist-container'>
                                    <h2 className="main-tracks--title">Your playlists</h2>
                                    <Link to={'/playlist/create-playlist'} className='create-playlist'>Create playlist</Link>
                                </div>
                                <div className="main-page-tracks--container-wrapper">
                                    <div className="main-page-tracks--container">
                                        {currentItems?.map(({
                                                                playlist_id,
                                                                title,
                                                                duration,
                                                                song_count
                                                            }) => (
                                            <Link to={`/playlist/${playlist_id}`} className="main-tracks--card"
                                                  key={playlist_id}>
                                                <div className="tracks-card--content">
                                                    <h2 className="tracks-card--title">{title}</h2>
                                                    <p className="tracks-card--performer">
                                                        {song_count} songs
                                                    </p>
                                                    <p className="tracks-card--performer">
                                                        {Math.floor(duration / 60)} minutes
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            userPlaylists?.data?.length > itemsPerPage && (<ReactPaginate
                                breakLabel="..."
                                nextLabel="Next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={pageCount}
                                previousLabel="< Previous"
                                containerClassName="pagination"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item-prev"
                                nextClassName="page-item-next"
                                activeClassName="active"
                                disabledClassName="disabled"
                            />)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default Playlists
