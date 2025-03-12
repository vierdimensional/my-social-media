import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./feed.scss";
import Profile from "../../elements/profile/Profile";
import User from "../../elements/user/User";
import NewPost from "../../elements/newPost/NewPost";

const Feed = () => {
    const { token, user } = useSelector((state) => state.user);
    const [feedData, setFeedData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterOption, setFilterOption] = useState("all");
    const [showScroll, setShowScroll] = useState(false);

    // Beiträge abrufen
    useEffect(() => {
        if (!token) return;

        const fetchFeed = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://49.13.31.246:9191/posts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Fehler: ${response.status}`);
                const data = await response.json();
                setFeedData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [token]);

    // Scroll-Button steuern
    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Beitrag liken (optimistische UI)
    const handleLike = async (postId) => {
        setFeedData((prevFeedData) =>
            prevFeedData.map((post) =>
                post._id === postId
                    ? { ...post, likes: [...post.likes, { fromUser: user }] }
                    : post
            )
        );

        try {
            const response = await fetch("http://49.13.31.246:9191/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({ post_id: postId }),
            });

            if (!response.ok) throw new Error("Fehler beim Liken eines Beitrags");
        } catch (error) {
            console.error("Fehler:", error);
        }
    };

    // Like entfernen (optimistische UI)
    const deleteLike = async (postId) => {
        setFeedData((prevFeedData) =>
            prevFeedData.map((post) =>
                post._id === postId
                    ? {
                        ...post,
                        likes: post.likes.filter((like) => like.fromUser !== user),
                    }
                    : post
            )
        );

        try {
            const response = await fetch(`http://49.13.31.246:9191/like/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) throw new Error("Fehler beim Entfernen von Gefällt mir");
        } catch (error) {
            console.error("Fehler:", error);
        }
    };

    // Beitrag löschen
    const deletePost = async (postId) => {
        if (!window.confirm("Möchten Sie diesen Beitrag wirklich löschen?")) return;

        setFeedData((prevFeedData) => prevFeedData.filter((post) => post._id !== postId));

        try {
            const response = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) throw new Error("Fehler beim Löschen des Beitrags");
            alert("✅ Der Beitrag wurde erfolgreich gelöscht!");
        } catch (error) {
            console.error("Fehler:", error);
            alert("❌ Fehler beim Löschen des Beitrags.");
        }
    };

    // Filter und Sortierung der Beiträge
    const filteredPosts =
        filterOption === "media"
            ? feedData.filter((post) => post.image && post.image.trim() !== "")
            : feedData;

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
        <div className="feed-container">
            <NewPost/>
            <div className="profile-section"><Profile/></div>
            <div className="feed-section">
                <div className="feed-controls">
                        <label htmlFor="filter">Filter:</label>
                        <select id="filter" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                            <option value="all">Alle Posts</option>
                            <option value="media">Nur mit Foto</option>
                        </select>
                    </div>
                    <div className="feed-posts">
                        {sortedPosts.map((post) => {
                            const likesCount = post.likes.length;
                            const isLikedByUser = post.likes.some((like) => like.fromUser === user);

                            return (
                                <div key={post._id} className="feed-post">
                                    {post.title && <h3 className="post-title">{post.title}</h3>}
                                    {post.description && <p className="post-description">{post.description}</p>}

                                    {post.image && <img src={post.image} alt="Post media" className="post-media"/>}
                                    {post.video && filterOption === "all" && (
                                        <iframe
                                            title="Post video"
                                            src={`${post.video}&autoplay=1&mute=1`}
                                            width="100%"
                                            height="320"
                                        ></iframe>
                                    )}

                                    {post.user?.[0] && (
                                        <div className="post-author">
                                            <img
                                                src={post.user[0].avatar || "/default-avatar.png"}
                                                alt="Author avatar"
                                                className="author-avatar"
                                            />
                                            <span className="author-name">
                                        {post.user[0].fullName || post.user[0].username}
                                                <br/> ❤️ {likesCount}
                                    </span>
                                        </div>
                                    )}

                                    <div className="post-likes">
                                        <button className="like-button"
                                                onClick={() => (isLikedByUser ? deleteLike(post._id) : handleLike(post._id))}>
                                            {isLikedByUser ? "❤️ Gefällt mir" : "🤍 Gefällt mir"}
                                        </button>
                                        <button className="delete_btn" onClick={() => deletePost(post._id)}>🗑</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {showScroll && (
                        <button className="scroll-to-top" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
                            ↑
                        </button>
                    )}
                </div>
                <div className="user-section"><User/></div>

        </div>

    );
};

export default Feed;
