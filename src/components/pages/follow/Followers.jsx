import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "./followers.scss";
import avatar from "../../../assets/img/sbcf-default-avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import Nav from "../../elements/nav/Nav";

const Followers = () => {
    const { token } = useSelector((state) => state.user);
    const { username } = useParams();
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

                if (!response.ok) throw new Error(`Fehler beim Abrufen: ${response.status}`);
                const data = await response.json();
                console.log("followers:", followers);

                if (Array.isArray(data.followers)) {
                    setFollowers(data.followers);
                } else {
                    console.warn("⚠️ Keine gültigen Abonnentendaten gefunden.");
                    setFollowers([]);
                }
            } catch (err) {
                console.error("❌ Fehler beim Abrufen der Abonnenten:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [token, username]);

    if (loading) return <div className="followers-loading">⏳ Lädt...</div>;
    if (error) return <div className="followers-error">{error}</div>;
    if (followers.length === 0) return <div className="followers-empty">❌ Keine Abonnenten gefunden.</div>;

    return (
        <div className="box-content">
            <div>
                <Nav/>
                <div className="followers-container">
                    <h2><FontAwesomeIcon icon={faUsers}/> Abonnenten von @{username}</h2>
                    <div className="followers-list">
                        {followers.map((follower) => (
                            <div
                                key={follower._id}
                                className="follower-card"
                                onClick={() => navigate(`/userprofile/${follower.username}`)}
                            >
                                <img
                                    src={follower.avatar || avatar}
                                    alt={`${follower.username} Avatar`}
                                    className="follower-avatar"
                                />
                                <div className="follower-info">
                                    <h4>{follower.fullName?.trim() || ""}</h4>
                                    <p>@{follower.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="followings-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
                </div>
            </div>
        </div>
            );
            };

            export default Followers;
