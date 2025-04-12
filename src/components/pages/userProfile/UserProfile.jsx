import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import avatar from "../../../assets/img/sbcf-default-avatar.png";
import "./userProfile.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faArrowLeft,
    faHeart,
    faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Nav from "../../elements/nav/Nav";

const UserProfile = () => {
    const { username: viewedUsername } = useParams();
    const { token, username: myUsername, user } = useSelector((state) => state.user);

    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !viewedUsername) {
            setError("❌ Fehler: Token oder Benutzername fehlt.");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await fetch(`http://49.13.31.246:9191/user/${viewedUsername}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!res.ok) throw new Error(`Fehler: ${res.status}`);
                const data = await res.json();
                setUserData(data);
                if (data._id) fetchUserPosts(data._id);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchUserPosts = async (userId) => {
            try {
                const res = await fetch(`http://49.13.31.246:9191/posts?user_id=${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!res.ok) return;
                const data = await res.json();
                setUserPosts(data.reverse());
            } catch {
                console.warn("Keine Beiträge geladen");
            }
        };

        const checkFollowStatus = async () => {
            try {
                const cached = localStorage.getItem(`following_${myUsername}`);
                if (cached) {
                    const set = new Set(JSON.parse(cached));
                    setIsFollowing(set.has(viewedUsername.toLowerCase()));
                } else {
                    const res = await fetch(`http://49.13.31.246:9191/followings/${myUsername}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": token,
                        },
                    });
                    if (!res.ok) throw new Error("Fehler beim Laden der Abos");
                    const data = await res.json();
                    const follows = new Set(data.following.map((u) => u.username.toLowerCase()));
                    setIsFollowing(follows.has(viewedUsername.toLowerCase()));
                    localStorage.setItem(`following_${myUsername}`, JSON.stringify([...follows]));
                }
            } catch (err) {
                console.error("❌ Fehler beim Follow-Abgleich:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        checkFollowStatus();
    }, [token, viewedUsername, myUsername]);

    const toggleFollow = async () => {
        const isNowFollowing = !isFollowing;
        const url = `http://49.13.31.246:9191/${isNowFollowing ? "follow" : "unfollow"}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({ username: viewedUsername }),
            });

            if (!res.ok) throw new Error("Fehler beim Follow/Unfollow");

            const stored = localStorage.getItem(`following_${myUsername}`);
            const follows = stored ? new Set(JSON.parse(stored)) : new Set();

            const usernameLC = viewedUsername.toLowerCase();
            isNowFollowing ? follows.add(usernameLC) : follows.delete(usernameLC);

            localStorage.setItem(`following_${myUsername}`, JSON.stringify([...follows]));
            setIsFollowing(isNowFollowing);
        } catch (err) {
            console.error("❌ Fehler beim Follow/Unfollow:", err.message);
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await fetch("http://49.13.31.246:9191/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({ post_id: postId }),
            });
            if (!res.ok) throw new Error("Fehler beim Liken");
            setUserPosts((prev) =>
                prev.map((p) =>
                    p._id === postId ? { ...p, likes: [...p.likes, { fromUser: user }] } : p
                )
            );
        } catch (error) {
            console.error("Fehler beim Liken:", error);
        }
    };

    const deleteLike = async (postId) => {
        try {
            const res = await fetch(`http://49.13.31.246:9191/like/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });
            if (!res.ok) throw new Error("Fehler beim Entfernen des Likes");
            setUserPosts((prev) =>
                prev.map((p) =>
                    p._id === postId ? { ...p, likes: p.likes.filter((l) => l.fromUser !== user) } : p
                )
            );
        } catch (error) {
            console.error("Fehler beim Entfernen des Likes:", error);
        }
    };

    if (loading) return <div className="one-user-loading">⏳ Laden...</div>;
    if (error) return <div className="one-user-error">{error}</div>;
    if (!userData) return <div className="one-user-error">❌ Benutzerprofil konnte nicht geladen werden</div>;

    const followersCount = userPosts?.[0]?.user?.[0]?.followers?.length || 0;
    const followingCount = userPosts?.[0]?.user?.[0]?.following?.length || 0;

    return (
        <div className="box-content">
            <div>
                <Nav />
                <div className="one-user-container">
                    <div className="one-user-card">
                        <img src={userData.avatar || avatar} alt="Avatar" className="one-user-avatar" />
                        <h2 className="one-user-name">{userData.fullName}</h2>
                        <p><strong>Benutzername:</strong> <br />@{userData.username}</p>
                        <p><strong>Alter:</strong> {userData.age}</p>
                        <p style={{ whiteSpace: "pre-wrap" }}><strong>Über mich:</strong> <br />{userData.bio}</p>
                        <p><strong>Beiträge:</strong> {userData.posts_count}</p>
                        <div className="one-user-follow-statistics">
                            <button
                                className="user-profile-followers-btn"
                                onClick={() => navigate(`/followers/${userData.username}`)}
                            >
                                <FontAwesomeIcon icon={faUserGroup} /> {followersCount} Abonnenten
                            </button>
                            <button
                                className="user-profile-following-btn"
                                onClick={() => navigate(`/following/${userData.username}`)}
                            >
                                <FontAwesomeIcon icon={faUserPlus} /> {followingCount} Abonnierte
                            </button>
                        </div>

                        <div className="one-user-btns">
                            {viewedUsername !== myUsername && (
                                <button
                                    className={`one-user-follow-btn ${isFollowing ? "following" : ""}`}
                                    onClick={toggleFollow}
                                >
                                    {isFollowing ? "Nicht folgen" : "Folgen"}
                                </button>
                            )}
                            <button className="user-profile-back-btn" onClick={() => navigate(-1)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Zurück
                            </button>
                        </div>
                    </div>

                    <div className="one-user-posts">
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <div key={post._id} className="feed-post">
                                    {post.title && <h3 className="post-title">{post.title}</h3>}
                                    {post.description && <p className="post-description">{post.description}</p>}
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt="Beitragsbild"
                                            className="post-media"
                                            onClick={() => setFullscreenImage(post.image)}
                                        />
                                    )}
                                    {post.video && (
                                        <iframe title="Beitragsvideo" src={post.video} className="post-video" allowFullScreen></iframe>
                                    )}
                                    <div className="post-actions">
                                        <button
                                            className="like-button"
                                            onClick={() =>
                                                post.likes.some((like) => like.fromUser === user)
                                                    ? deleteLike(post._id)
                                                    : handleLike(post._id)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faHeart} color={post.likes.some((like) => like.fromUser === user) ? "red" : "gray"} /> {post.likes.length}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-posts">❌ Dieser Benutzer hat noch keine Beiträge.</p>
                        )}
                    </div>

                    {fullscreenImage && (
                        <div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
                            <img src={fullscreenImage} alt="Vollbild" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
