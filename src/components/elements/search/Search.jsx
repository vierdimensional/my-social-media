import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./search.scss";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const jwt = localStorage.getItem("jwt");
            if (!jwt) {
                setError("Kein Token gefunden. Bitte anmelden.");
                setLoading(false);
                return;
            }

            const response = await fetch(`http://49.13.31.246:9191/search?query=${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": jwt,
                },
            });

            if (!response.ok) throw new Error(`Fehler: ${response.status}`);

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError("Fehler bei der Suche. Bitte versuche es erneut.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Benutzername eingeben..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Suche bei Enter-Taste
                />
            </div>

            {loading && <p>⏳ Suche läuft...</p>}
            {error && <p className="error">{error}</p>}

            <ul className="search-results">
                {results.length > 0 ? (
                    results.map((user) => (
                        <li key={user._id}>
                            <Link to={`/profile/${user._id}`}>
                                <img src={user.avatar || "/default-avatar.png"} alt="avatar" className="miniAvatar" />
                                <span>{user.username}</span>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p className="no-results">🔎 Keine Benutzer gefunden.</p>
                )}
            </ul>
        </div>
    );
};

export default Search;
