import React, {useEffect, useState} from 'react'
import {getAllAlbums} from "../api/albums.js";
import {toast} from "react-toastify";
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";
import '../styles/pages/Albums.css'
import {isAdmin} from "../utils/isAdmin.js";

const Albums = () => {
    const [itemOffset, setItemOffset] = useState(0);
    const [albums, setAlbums] = useState([]);

    const loadData = async () => {
        try {
            const albumsData = await getAllAlbums();

            setAlbums(albumsData);
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

    const itemsPerPage = 8;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = albums?.data?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(albums?.data?.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % albums?.data?.length;
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
                                <div className='album-container'>
                                    <h2 className="main-tracks--title">Albums</h2>
                                    {isAdmin() === 'admin' &&
                                        <Link to={'/album/create-album'} className='create-album'>Create
                                            album</Link>
                                    }
                                </div>
                                <div className="main-page-tracks--container-wrapper">
                                    <div className="main-page-tracks--container">
                                        {currentItems?.map(({
                                                                album_id,
                                                                title,
                                                                photo_path,
                                                                performer_name,
                                                            }) => (
                                            <Link to={`/album/${album_id}`} className="main-tracks--card"
                                                  key={album_id}>
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
                        {
                            albums?.data?.length > itemsPerPage && (<ReactPaginate
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
export default Albums
