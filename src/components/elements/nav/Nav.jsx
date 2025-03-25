/*import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import './nav.scss';

const Nav = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [userAvatar, setUserAvatar] = useState(null);
    const navigate = useNavigate();

    // ✅ Benutzeravatar laden
    useEffect(() => {
        async function fetchUser() {
            try {
                const jwt = localStorage.getItem("token");

                if (!jwt) {
                    console.error("Kein Token gefunden. Benutzer nicht authentifiziert.");
                    return;
                }

                const response = await fetch("http://49.13.31.246:9191/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": jwt,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Fehler: ${response.status}`);
                }

                const data = await response.json();//

                if (Array.isArray(data) && data.length > 0) {
                    setUserAvatar(data[0].avatar); // Erstes User-Avatar aus der API nehmen
                }
            } catch (error) {
                console.error("Fehler beim Laden des Avatars:", error);
            }
        }

        fetchUser();
    }, []);

    // ✅ Such-Handler (Weiterleitung zu `Search.jsx`)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(""); // Eingabefeld nach Weiterleitung leeren
        }
    };

    return (
        <div className="nav-container">
            <nav className="nav">
              <Link to="/feed" className="nav-link">
                    <img src="../../../assets/img/4D_logo_schwarz_1x1.png" alt="4D Logo" />
                </Link>
                <Link to="/MyProfile" className="nav-link">
                    <FontAwesomeIcon icon={faUser} /> Profil
                </Link>

/*
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
/*

/*
                {userAvatar && (
                    <Link to="/MyProfile" className="avatar-link">
                        <img src={userAvatar?.avatar || "/sbcf-default-avatar.png"} alt="Avatar"
                             className="profile-avatar"/>
                    </Link>
                )}
            </nav>
        </div>
    );
};

export default Nav;*/


import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import './nav.scss';

const Nav = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // ✅ Обработчик поиска (редирект в `Search.jsx`)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(""); // Очистка поля ввода после редиректа
        }
    };

    return (
        <div className="box-content">
        <div className="nav-container">
            <nav className="nav">
                <Link to="/feed" className="nav-link"><FontAwesomeIcon icon={faHome} /> Home</Link>

                {/* ✅ Форма поиска */}
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Suche..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>
                <Link to="/MyProfile" className="nav-link"><FontAwesomeIcon icon={faUser} /> Profile</Link>

            </nav>
        </div>
        </div>
    );
};

export default Nav;