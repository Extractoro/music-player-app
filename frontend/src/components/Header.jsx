import React from 'react'
import sprite from "../assets/symbol-defs.svg";

const Header = ({ handleToggleAside, setSearchQuery, setSearchPerformer }) => {
    const isDisplayNone = (path) => location.pathname === path;

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePerformerChange = (event) => {
        setSearchPerformer(event.target.value);
    };

    return (
        <header className="main-header">
            <button id="aside-toggle" className="aside-toggle" onClick={handleToggleAside}>
                <svg className="aside-close--icon">
                    <use href={`${sprite}#menu`}></use>
                </svg>
            </button>
            <form className={`${isDisplayNone('/profile') || isDisplayNone('/statistics') || isDisplayNone('/') || isDisplayNone('/playlists') ? 'displayNone' : 'header-form'}`}>
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
                <label className={`${!isDisplayNone('/tracks') && !isDisplayNone('/albums')  ? 'displayNone' : 'header-form--container'}`}>
                    <input
                        className="header-form--input"
                        type="text"
                        placeholder="Search by performer..."
                        onChange={handlePerformerChange}
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
