import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faUser, faSearch, faSignOutAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import './nav.scss';
import { logoutUser } from '../../../features/features';
import { useDispatch } from 'react-redux';

const Nav = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/signIn');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <div className="nav-container">
            <nav className="nav">
                <div className="nav-section nav-start">
                    <Link to="/feed" className="nav-link">
                        <FontAwesomeIcon icon={faHome} /> Home
                    </Link>
                </div>

                <div className="nav-section nav-center">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Suche..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>

                <div className="nav-section nav-right">
                    <Link to="/myprofile" className="nav-link">
                        <FontAwesomeIcon icon={faUser} /> Mein Profil
                    </Link>
                    <Link to="/alluser" className="nav-link">
                        <FontAwesomeIcon icon={faUsers} />  Alle User
                    </Link>
                </div>

                <div className="nav-section nav-end">
                    <button className="logout-btn" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Abmelden
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Nav;
