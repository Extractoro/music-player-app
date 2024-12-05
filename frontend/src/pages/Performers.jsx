import React, {useEffect, useState} from 'react'
import {getAllPerformers} from "../api/performer.js";
import {toast} from "react-toastify";
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";
import {isAdmin} from "../utils/isAdmin.js";
import '../styles/pages/Performers.css'

const Performers = () => {
    const [itemOffset, setItemOffset] = useState(0);
    const [performers, setPerformers] = useState([]);

    const loadData = async () => {
        try {
            const performersData = await getAllPerformers();

            setPerformers(performersData);
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
    const currentItems = performers?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(performers?.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % performers?.length;
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
                                <div className='performer-container'>
                                    <h2 className="main-tracks--title">Performers</h2>
                                    {isAdmin() === 'admin' &&
                                        <Link to={'/performer/create-performer'} className='create-performer'>Create
                                            performer</Link>
                                    }
                                </div>
                                <div className="main-page-tracks--container-wrapper">
                                    <div className="main-page-tracks--container">
                                        {currentItems?.map(({
                                                                performer_id,
                                                                photo_path,
                                                                artistDetails,
                                                                groupDetails,
                                                                type
                                                            }) => (
                                            <Link to={`/performer/${performer_id}`} className="main-tracks--card" key={performer_id}>
                                                <img
                                                    className="tracks-card--img"
                                                    src={photo_path}
                                                    alt="Track cover"
                                                />
                                                <div className="tracks-card--content">
                                                    <h2 className="tracks-card--title">{type === "artist" ? artistDetails?.name : groupDetails?.name || "Unknown Name"}</h2>
                                                    <p className="tracks-card--performer">
                                                        {`${type[0].toUpperCase()}${type.slice(1)}`}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            performers?.data?.length > itemsPerPage && (<ReactPaginate
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
export default Performers
