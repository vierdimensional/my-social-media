import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../../assets/img/sbcf-default-avatar.png";
import "./allUser.scss";
import Nav from "../../elements/nav/Nav";

const User = () => {
    const { token, username } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("❌ Fehler: Kein Token gefunden.");
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch("http://49.13.31.246:9191/users", {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!res.ok) throw new Error(`Fehler beim Laden der Nutzer: ${res.status}`);
                const data = await res.json();
                const filtered = data.filter((u) => u.username !== username);
                setUsers(filtered);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchFollowings = async () => {
            try {

                //       const cached = localStorage.getItem(`following_${username}`);
                //    if (cached) {
                //        setFollowing(new Set(JSON.parse(cached)));
                //     } else {

                const res = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!res.ok) throw new Error("Fehler beim Laden der Follows");
                const data = await res.json();
                const follows = new Set(data.following.map((u) => u.username.toLowerCase()));
                setFollowing(follows);
                localStorage.setItem(`following_${username}`, JSON.stringify([...follows]));
                // }
            } catch (err) {
                console.error("❌ Fehler bei Follow-Daten:", err.message);
            }
        };

        const init = async () => {
            await Promise.all([fetchUsers(), fetchFollowings()]);
            setLoading(false);
        };

        init();
    }, [token, username]);

    const toggleFollow = async (targetUser) => {
        const isAlreadyFollowing = following.has(targetUser.toLowerCase());
        const url = `http://49.13.31.246:9191/${isAlreadyFollowing ? "unfollow" : "follow"}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({ username: targetUser }),
            });

            if (!res.ok) throw new Error(`Fehler beim ${isAlreadyFollowing ? "Entfolgen" : "Folgen"}`);

            const updated = new Set(following);
            isAlreadyFollowing
                ? updated.delete(targetUser.toLowerCase())
                : updated.add(targetUser.toLowerCase());

            setFollowing(updated);
            localStorage.setItem(`following_${username}`, JSON.stringify([...updated]));
        } catch (err) {
            console.error("❌ Follow/Unfollow Fehler:", err.message);
        }
    };

    if (loading) return <div className="loading">⏳ Lade Benutzer...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <div className="box-content">
            <div>
                <Nav/>
                <div className="all-user-list-container">
                    <h2 className="all-user-title">
                        <FontAwesomeIcon icon={faUsers}/> Alle User
                    </h2>

                    <div className="all-user-list">
                        {users.map((user) => (
                            <div key={user._id} className="user-item">
                                <div className="user-info" onClick={() => navigate(`/userprofile/${user.username}`)}>
                                    <img src={user.avatar || avatar} alt="Avatar" className="user-avatar"/>
                                    <div>
                                        <h4>{user.fullName || "Ohne Name"}</h4>
                                        <p>@{user.username}</p>
                                    </div>
                                </div>

                                <button
                                    className={`follow-btn ${following.has(user.username) ? "following" : ""}`}
                                    onClick={() => toggleFollow(user.username)}
                                >
                                    {following.has(user.username) ? "Nicht folgen" : "Folgen"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
        </div>
    );
};

                export default User;
