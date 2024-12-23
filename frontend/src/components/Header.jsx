import React from 'react'
import sprite from "../assets/symbol-defs.svg";

const Header = ({ handleToggleAside, setSearchQuery }) => {
    const isDisplayNone = (path) => location.pathname === path;

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <header className="main-header">
            <button id="aside-toggle" className="aside-toggle" onClick={handleToggleAside}>
                <svg className="aside-close--icon">
                    <use href={`${sprite}#menu`}></use>
                </svg>
            </button>
            <form method="post" className={`${isDisplayNone('/profile') || isDisplayNone('/statistics') || isDisplayNone('/playlists') ? 'displayNone' : 'header-form'}`}>
                <label className="header-form--container">
                    <input
                        className="header-form--input"
                        type="text"
                        placeholder="Search..."
                        onChange={handleInputChange}
                    />
                    <svg className="header-form--search-icon">
                        <use href={`${sprite}#search`}></use>
                    </svg>
                </label>
            </form>
        </header>
    )
}
export default Header
