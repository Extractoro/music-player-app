import React, {useEffect, useState} from 'react'
import {currentUser} from "../api/auth.js";
import {toast} from "react-toastify";
import Aside from "../components/Aside.jsx";
import Header from "../components/Header.jsx";
import '../styles/pages/Profile.css'
import {Link} from "react-router-dom";

const Profile = () => {
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
                            <h2 className="main-tracks--title">Profile</h2>
                            <div className='profile'>
                                <div className='profile-container'>
                                    <p className='profile-text'>Username: <span
                                        className='profile-text--span'>{user?.data?.username}</span></p>
                                    <p className='profile-text'>Email: <span
                                        className='profile-text--span'>{user?.data?.email}</span></p>
                                </div>
                                <Link to={'/profile/edit-profile'} className='profile-link'>Edit profile</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile
