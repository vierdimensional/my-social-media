import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import avatar from "../../../assets/img/sbcf-default-avatar.png";
import "./search.scss";
import Nav from "../../elements/nav/Nav";

// Font Awesome Imports
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

    // ✅ Hole den query-Parameter aus der URL
    const params = new URLSearchParams(location.search);
    const query = params.get("query")?.toLowerCase() || "";

    // 📌 Lade die Abonnements des Benutzers
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

    // 📌 Suche nach Benutzern
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

    // 📌 Abonnieren / Abbestellen
    const toggleFollow = async (username) => {
        const isFollowing = following.has(username);
        const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;

        try {
            await axios.post(url, { username }, { headers: { "x-access-token": token } });

            setFollowing((prev) => {
                const updatedSet = new Set(prev);
                if (isFollowing) {
                    updatedSet.delete(username);
                } else {
                    updatedSet.add(username);
                }
                return updatedSet;
            });
        } catch (err) {
            console.error(`Fehler beim ${isFollowing ? "Abbestellen" : "Abonnieren"}:`, err);
        }
    };

    // 📌 Zum Benutzerprofil navigieren
    const handleUserClick = (user) => {
        navigate(`/user/${user.username}`);
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

                {/* ✅ Liste der gefundenen Benutzer */}
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

                {/* ✅ Button "Zurück zum Feed" */}
                <button className="back-to-feed-btn" onClick={() => navigate("/feed")}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Zurück zum Feed
                </button>
            </div>
        </div>
    );
};

export default Search;