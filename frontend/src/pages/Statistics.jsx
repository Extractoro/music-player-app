import React, {useEffect, useState} from 'react'
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";
import {currentUser} from "../api/auth.js";
import {toast} from "react-toastify";
import TopSongsChart from "../components/TopSongsChart.jsx";
import PopularGenresChart from "../components/PopularGenresChart.jsx";

const Statistics = () => {
    const [user, setUser] = useState([]);

    const loadData = async () => {
        try {
            const usersData = await currentUser(localStorage.getItem("user_id"));

            setUser(usersData);
        } catch (error) {
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

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

    return (
        <div className='home'>
            <Aside isAsideOpen={isAsideOpen} handleToggleMenu={handleToggleMenu} setIsMenuOpen={setIsMenuOpen}
                   isMenuOpen={isMenuOpen}/>

            <div className={`main ${isAsideOpen ? "shift" : ""}`}>
                <div className="main-container container">
                    <Header handleToggleAside={handleToggleAside}/>

                    <div className="main-home">
                        <div className="main-tracks">
                            <h2 className="main-tracks--title">Statistics</h2>
                            <TopSongsChart/>
                            <PopularGenresChart/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Statistics
