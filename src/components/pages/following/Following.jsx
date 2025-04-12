import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "./followings.scss"; // Falls du ein separates followings.scss hast, kannst du es hier verwenden.
import avatar from "../../../assets/img/sbcf-default-avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Followings = () => {
    const { token } = useSelector((state) => state.user);
    const { username } = useParams();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !username) {
            setError("❌ Fehler: Token oder Benutzername fehlen.");
            setLoading(false);
            return;
        }

        const fetchFollowings = async () => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Fehler beim Abrufen: ${response.status}`);
                const data = await response.json();

                if (Array.isArray(data.following)) {
                    setFollowing(data.following);
                } else {
                    console.warn("⚠️ Keine gültigen Daten gefunden.");
                    setFollowing([]);
                }
            } catch (err) {
                console.error("❌ Fehler beim Abrufen der Gefolgten:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowings();
    }, [token, username]);

    if (loading) return <div className="followers-loading">⏳ Lädt...</div>;
    if (error) return <div className="followers-error">{error}</div>;
    if (following.length === 0) return <div className="followers-empty">❌ Keine gefolgten Nutzer gefunden.</div>;

    return (
        <div className="followers-container">
            <h2>
                <FontAwesomeIcon icon={faUserPlus}/> Gefolgt von @{username}
            </h2>

            <div className="followers-list">
                {following.map((followed) => (
                    <div
                        key={followed._id}
                        className="follower-card"
                        onClick={() => navigate(`/userprofile/${followed.username}`)}
                    >
                        <img
                            src={followed.avatar || avatar}
                            alt={`${followed.username} Avatar`}
                            className="follower-avatar"
                        />
                        <div className="follower-info">
                            <h4>{followed.fullName || "Ohne Name"}</h4>
                            <p>@{followed.username}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="followings-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
        </div>
    );
};

export default Followings;
