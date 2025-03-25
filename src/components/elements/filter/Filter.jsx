import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./filter.scss";

const Filter = ({ posts }) => {
    const { token } = useSelector((state) => state.user);
    const [filterOption, setFilterOption] = useState("all");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Beiträge filtern
    const filteredPosts = filterOption === "media"
        ? posts.filter((post) => post.image && post.image.trim() !== "")
        : posts;

    const getPostDate = (post) => {
        if (post.createdAt) return new Date(post.createdAt);
        if (post.created_at) return new Date(post.created_at);
        if (post._id) {
            const timestampHex = post._id.toString().substring(0, 8);
            const timestamp = parseInt(timestampHex, 16);
            return new Date(timestamp * 1000);
        }
        return new Date(0);
    };

    const sortedPosts = [...filteredPosts].sort((a, b) => getPostDate(b) - getPostDate(a));

    // UI-Zustände
    if (!token) return <div className="error-msg">⚠️ Der Benutzer ist nicht autorisiert</div>;
    if (loading) return <div className="loading">⏳ Laden...</div>;
    if (error) return <div className="error-msg">❌ Fehler: {error}</div>;
    if (!sortedPosts.length)
        return <div className="error-msg">📭 Keine Beiträge zum Anzeigen.</div>;

    return (
        <div className="filter-container">
            <div className="filter-controls">
                <label htmlFor="filter">Filter:</label>
                <select id="filter" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                    <option value="all">Alle Posts</option>
                    <option value="media">Nur mit Foto</option>
                </select>
            </div>

            <div className="filtered-posts">
                {sortedPosts.map((post) => (
                    <div key={post._id} className="post">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        {post.image && <img src={post.image} alt="Post media" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter;
