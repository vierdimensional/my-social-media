import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import "./followings.scss";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';

const FolgenMir = () => {
    const {token, username} = useSelector((state) => state.user);
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !username) {
            setError("❌ Fehler: Token oder Benutzername fehlen.");
            setLoading(false);
            return;
        }
        const fetchFollowers = async () => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/followers/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!response.ok) throw new Error(`Fehler: ${response.status}`);
                let data = await response.json();
                console.log("🔍 SERVER ANTWORT (Followers):", data);
                if (data && Array.isArray(data.followers)) {
                    console.log("✅ Gefundene Follower:", data.followers);
                    setFollowers(data.followers);
                } else {
                    console.warn("⚠️ Keine Follower gefunden oder Datenformat hat sich geändert!");
                    setFollowers([]);
                }
            } catch (err) {
                console.error("❌ Fehler beim Abrufen der Follower:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFollowers();
    }, [token, username]);

    if (loading) return <div className="followers-loading">⏳ Wird geladen...</div>;
    if (error) return <div className="followers-error">{error}</div>;

    console.log("✅ Endgültige Liste der Follower:", followers);

    if (!followers || followers.length === 0) return <div className="followers-empty">❌ Keine Follower gefunden</div>;

    return (
        <div className="followers-container">
            <h2>Folgen mir</h2>
            <div className="followers-list">
                {followers.map((follower) => (
                    <div key={follower._id} className="follower-card"
                         onClick={() => navigate(`/user/${follower.username}`)}>
                        <img src={follower.avatar || avatar} alt="Avatar" className="follower-avatar"/>
                        <div className="follower-info">
                            <h4>{follower.name}</h4>
                            <p>@{follower.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FolgenMir;