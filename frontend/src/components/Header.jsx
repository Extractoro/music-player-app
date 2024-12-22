import React from 'react'
import sprite from "../assets/symbol-defs.svg";

const Header = ({handleToggleAside}) => {
    const isProfile = (path) => location.pathname === path;

    return (
        <header className="main-header">
            <button id="aside-toggle" className="aside-toggle" onClick={handleToggleAside}>
                <svg className="aside-close--icon">
                    <use href={`${sprite}#menu`}></use>
                </svg>
            </button>
            <form method="post" className={`${isProfile('/profile') || isProfile('/statistics') ? 'displayNone' : 'header-form'}`}>
                <label className="header-form--container">
                    <input
                        className="header-form--input"
                        type="search"
                        placeholder="Search..."
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
