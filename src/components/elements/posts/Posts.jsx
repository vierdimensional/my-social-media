import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faTrashAlt,
    faExclamationTriangle,
    faSpinner,
    faEnvelope,
    faTimesCircle,
    faArrowUp,
    faUserGroup,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import "./posts.scss";

const Posts = () => {
    const { token, user } = useSelector((state) => state.user);
    const [postsData, setPostsData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterOption, setFilterOption] = useState("all");
    const [showScroll, setShowScroll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://49.13.31.246:9191/posts", {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Fehler: ${response.status}`);
                const data = await response.json();
                setPostsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScroll(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLike = async (postId) => {
        setPostsData((prev) =>
            prev.map((post) =>
                post._id === postId ? { ...post, likes: [...post.likes, { fromUser: user._id }] } : post
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

    const deleteLike = async (postId) => {
        setPostsData((prev) =>
            prev.map((post) =>
                post._id === postId
                    ? { ...post, likes: post.likes.filter((like) => like.fromUser !== user._id) }
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

    const deletePost = async (postId) => {
        const postToDelete = postsData.find((post) => post._id === postId);
        if (!postToDelete || postToDelete.user?.[0]?._id !== user._id) {
            alert("❌ Du kannst nur deine eigenen Beiträge löschen.");
            return;
        }

        if (!window.confirm("Möchtest du diesen Beitrag wirklich löschen?")) return;

        setPostsData((prev) => prev.filter((post) => post._id !== postId));

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
            console.error("Fehler beim Löschen:", error);
            alert("❌ Fehler beim Löschen des Beitrags.");
        }
    };

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

    const filteredPosts =
        filterOption === "media"
            ? postsData.filter((post) => post.image && post.image.trim() !== "")
            : postsData;

    const sortedPosts = [...filteredPosts].sort((a, b) => getPostDate(b) - getPostDate(a));

    if (!token) return <div className="error-msg"><FontAwesomeIcon icon={faExclamationTriangle} /> Der Benutzer ist nicht autorisiert</div>;
    if (loading) return <div className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Laden...</div>;
    if (error) return <div className="error-msg"><FontAwesomeIcon icon={faTimesCircle} /> Fehler: {error}</div>;
    if (!sortedPosts.length) return <div className="error-msg"><FontAwesomeIcon icon={faEnvelope} /> Keine Beiträge zum Anzeigen.</div>;

    return (
        <div className="posts-container">
            <div className="posts-section">
                <div className="posts-controls">
                    <label htmlFor="filter">Filter:</label>
                    <select id="filter" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                        <option value="all">Alle Posts</option>
                        <option value="media">Nur mit Foto</option>
                    </select>
                </div>

                <div className="posts-posts">
                    {sortedPosts.map((post) => {
                        const likesCount = post.likes.length;
                        const isLikedByUser = post.likes.some((like) => like.fromUser === user._id);
                        return (
                            <div key={post._id} className="posts-user">
                                <div className="posts-post">
                                    {post.user?.[0] && (
                                        <div className="post-author">
                                            <div className="post-author-info">
                                                {/* Avatar */}
                                                <div className="author-column avatar">
                                                    <img
                                                        src={post.user[0].avatar || "/default-avatar.png"}
                                                        alt="Author avatar"
                                                        className="author-avatar"
                                                    />
                                                </div>

                                                {/* Name */}
                                                <div className="author-column name">
                                                    <span className="author-name">
                                                        {post.user[0].fullName || post.user[0].username}
                                                    </span>
                                                </div>

                                                {/* Follower */}
                                                <div className="author-column followers">
                                                    <button
                                                        className="followers-btn"
                                                        onClick={() => navigate(`/followers/${post.user[0].username}`)}
                                                    >
                                                        <FontAwesomeIcon icon={faUserGroup} /> {post.user[0].followers?.length || 0} Abonnenten
                                                    </button>
                                                </div>

                                                {/* Following */}
                                                <div className="author-column following">
                                                    <button
                                                        className="following-btn"
                                                        onClick={() => navigate(`/following/${post.user[0].username}`)}
                                                    >
                                                        <FontAwesomeIcon icon={faUserPlus} /> {post.user[0].following?.length || 0} Abonnierte
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {post.title && <h3 className="post-title">{post.title}</h3>}
                                    {post.description && <p className="post-description">{post.description}</p>}
                                    {post.image && <img src={post.image} alt="Post media" className="post-media" />}
                                    {post.video && filterOption === "all" && (
                                        <div className="responsive-video">
                                            <iframe
                                                title="Post video"
                                                src={`${post.video}&autoplay=1&mute=1`}
                                                allow="autoplay"
                                            ></iframe>
                                        </div>
                                    )}

                                    <div className="post-likes">
                                        <button
                                            className="like-button"
                                            onClick={() =>
                                                isLikedByUser ? deleteLike(post._id) : handleLike(post._id)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faHeart} color={isLikedByUser ? "black" : "red"} />
                                            {isLikedByUser ? " Gefällt mir" : " Gefällt mir"}
                                        </button>
                                        {token && post.user?.[0]?._id === user._id && (
                                            <button className="delete-btn" onClick={() => deletePost(post._id)}>
                                                <FontAwesomeIcon icon={faTrashAlt} color={"red"} /> Löschen
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showScroll && (
                    <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Posts;
