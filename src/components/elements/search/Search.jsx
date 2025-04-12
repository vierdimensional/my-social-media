import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import avatar from "../../../assets/img/sbcf-default-avatar.png";
import "./search.scss";
import Nav from "../../elements/nav/Nav";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner, faTriangleExclamation, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
    const [results, setResults] = useState([]); // Gefundene Benutzer
    const [following, setFollowing] = useState(new Set()); // Abonnierte Benutzer
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { token, username } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const query = params.get("query")?.toLowerCase() || "";

    useEffect(() => {
        if (!token) return;

        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`http://49.13.31.246:9191/followings/${username}`, {
                    headers: { "x-access-token": token },
                });
                const followingSet = new Set(response.data.following.map((u) => u.username));
                setFollowing(followingSet);
            } catch (err) {
                console.error("Fehler beim Laden der Abonnements:", err);
            }
        };

        fetchFollowing();
    }, [token, username]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://49.13.31.246:9191/users`, {
                    headers: { "x-access-token": token },
                });

                const filteredUsers = response.data.filter((user) =>
                    user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
                );

                setResults(filteredUsers);
            } catch (err) {
                console.error("Fehler bei der Suche:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [query, token]);

    const handleUserClick = (user) => {
        navigate(`/userprofile/${user.username}`);
    };

    return (
        <div>
            <Nav />
            <div className="search-container">
                <h2>
                    <FontAwesomeIcon icon={faSearch} /> Suchergebnisse: {query}
                </h2>
                {loading && (
                    <p>
                        <FontAwesomeIcon icon={faSpinner} spin /> Wird geladen...
                    </p>
                )}
                {error && <p className="error-msg">{error}</p>}
                {!loading && results.length === 0 && (
                    <p>
                        <FontAwesomeIcon icon={faTriangleExclamation} /> Keine Ergebnisse gefunden
                    </p>
                )}

                <ul className="search-results">
                    {results.map((user) => (
                        <div className="user-card-search">
                        <li key={user._id} onClick={() => handleUserClick(user)}>
                            <img src={user.avatar || avatar} alt="Avatar" />
                            {user.fullName} (@{user.username})
                        </li>
                        </div>
                    ))}
                </ul>

                <button className="back-to-feed-btn" onClick={() => navigate("/feed")}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Zurück
                </button>
            </div>
        </div>
    );
};

export default Search;