import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, setUser } from "../../../features/features";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faRss,
    faUsers,
    faUserFriends,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.user);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://49.13.31.246:9191/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(` Fehler: ${response.status}`);
                const data = await response.json();
                setProfileData(data);

                // 🛠️ Token + Username + full user im Redux speichern
                dispatch(setUser({
                    token: token,
                    username: data.username,
                    user: data,
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/signIn");
    };

    if (!token) return <div className="error-msg">Benutzer nicht autorisiert</div>;
    if (loading) return <div className="loading">Profil wird geladen...</div>;
    if (error) return <div className="error-msg">{error}</div>;
    if (!profileData) return <div className="error-msg">Keine Profildaten gefunden</div>;

    return (
        <div className="profile-card">
            <div className="profile-header">
                <img
                    src={profileData?.avatar || "/sbcf-default-avatar.png"}
                    alt="Avatar"
                    className="profile-avatar"
                />
                <h2>{profileData?.fullName || "Unbekannter Benutzer"}</h2>
                <p className="profile-job">{profileData?.jobTitle || ""}</p>
                <p className="profile-bio">{profileData?.bio || "Keine Bio vorhanden"}</p>
            </div>

            <div className="profile-stats">
                <div><strong>{profileData?.posts_count || 0}</strong> Beiträge</div>
                <div><strong>{profileData?.followers || 0}</strong> Follower</div>
                <div><strong>{profileData?.following || 0}</strong> Gefolgt</div>
            </div>

            <div className="profile-menu">
                <button className="menu-button" onClick={() => navigate("/myprofile")}>
                    <FontAwesomeIcon icon={faUser} /> Profil
                </button>
                <button className="menu-button" onClick={() => navigate(`/followers/${profileData.username}`)}>
                    <FontAwesomeIcon icon={faUsers} /> Folgen mich
                </button>
                <button className="menu-button" onClick={() => navigate(`/following/${profileData.username}`)}>
                    <FontAwesomeIcon icon={faUserFriends} /> Folge ich
                </button>
            </div>

            <button className="profile-view-btn" onClick={() => navigate("/editmyprofile")}>
                Profil bearbeiten
            </button>
        </div>
    );
};

export default Profile;
