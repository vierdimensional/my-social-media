import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./lastpost.css";

const LastPost = () => {
    const { token, user } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token || !user?._id) return; // Sicherheitsprüfung

        const fetchUserPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://49.13.31.246:9191/get_post__id_`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Fehler: ${response.status}`);

                const data = await response.json();
                setPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Fehler beim Laden der Posts.");
                console.error("Fehler beim Laden der Posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [token, user]);

    // 🔹 Funktion zum Löschen eines Posts
    const deletePost = async (postId) => {
        if (!window.confirm("Möchtest du diesen Beitrag wirklich löschen?")) return;

        try {
            const response = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) throw new Error("Fehler beim Löschen des Beitrags");

            // Erfolgreich gelöscht, Post aus der Liste entfernen
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            alert("✅ Beitrag erfolgreich gelöscht!");
        } catch (error) {
            console.error("Fehler beim Löschen des Beitrags:", error);
            alert("❌ Fehler beim Löschen des Beitrags.");
        }
    };

    if (loading) return <p>⏳ Posts werden geladen...</p>;
    if (error) return <p className="error">❌ {error}</p>;
    if (posts.length === 0) return <p>📭 Keine eigenen Posts gefunden.</p>;

    return (
        <div className="last-posts">
            {posts.map((post) => (
                <div key={post._id} className="last-post">
                    {post.title && <h3 className="post-title">{post.title}</h3>}
                    {post.description && <p className="post-description">{post.description}</p>}

                    {post.image && <img src={post.image} alt="Post media" className="post-media" />}
                    {post.video && (
                        <iframe
                            title="Post video"
                            src={`${post.video}&autoplay=1&mute=1`}
                            width="100%"
                            height="320"
                        ></iframe>
                    )}

                    <div className="post-author">
                        <img
                            src={user.avatar || "/default-avatar.png"}
                            alt="Author avatar"
                            className="author-avatar"
                        />
                        <span className="author-name">
                            {user.fullName || user.username}
                        </span>
                    </div>

                    <div className="post-likes">
                        <span>❤️ {post.likes.length}</span>
                        <button className="delete_btn" onClick={() => deletePost(post._id)}>🗑</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LastPost;
