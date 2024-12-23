import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";
import {getAllSongs} from "../api/songs.js"
import "../styles/pages/Home.css";
import "../styles/pages/Tracks.css";
import "../styles/components/Pagination.css";
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";
import {Link} from "react-router-dom";
import {isAdmin} from "../utils/isAdmin.js";


const Tracks = () => {
    const [itemOffset, setItemOffset] = useState(0);
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const loadData = async () => {
        try {
            const songsData = await getAllSongs();

            setSongs(songsData);
        } catch (error) {
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    const filteredTracks = songs?.data?.filter((track) => {
        return track?.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

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

    const itemsPerPage = 8;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredTracks?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredTracks?.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredTracks?.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <div className="home">
                <Aside isAsideOpen={isAsideOpen} handleToggleMenu={handleToggleMenu} setIsMenuOpen={setIsMenuOpen}
                       isMenuOpen={isMenuOpen}/>

                <div className={`main ${isAsideOpen ? "shift" : ""}`}>
                    <div className="main-container container">
                        <Header handleToggleAside={handleToggleAside} setSearchQuery={setSearchQuery}/>

                        <div className="main-home">
                            <div className="main-tracks">
                                <div className='track-container'>
                                    <h2 className="main-tracks--title">Tracks</h2>
                                    {isAdmin() === 'admin' &&
                                        <Link to={'/track/create-track'} className='create-track'>Create
                                            track</Link>
                                    }
                                </div>
                                <div className="main-page-tracks--container-wrapper">
                                    <div className="main-page-tracks--container">
                                        {currentItems?.map(({
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
                        </div>
                        {
                            filteredTracks?.length > itemsPerPage && (<ReactPaginate
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
export default Tracks
