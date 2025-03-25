import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, setUser } from "../../../features/features";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEdit,
    faSignOutAlt,
    faSpinner,
    faExclamationTriangle,
    faRss,
    faUsers,
    faCog,
    faUserFriends
} from "@fortawesome/free-solid-svg-icons";
import "./myProfile.scss";

const MyProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.user);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch("http://49.13.31.246:9191/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        dispatch(logoutUser());
                        navigate("/signIn");
                        return;
                    }
                    throw new Error(`Fehler: ${response.status}`);
                }

                const data = await response.json();
                setProfileData(data);
                dispatch(setUser({ user: data._id }));
            } catch (err) {
                console.error("Fehler beim Laden des Profils:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, dispatch, navigate]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/signIn");
    };

    const handleEditProfile = () => {
        navigate("/editmyprofile");
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p>Profildaten werden geladen...</p>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="profile-error">
                <p><FontAwesomeIcon icon={faExclamationTriangle} /> Benutzer nicht autorisiert</p>
                <button className="auth-button" onClick={() => navigate("/signIn")}>
                    Anmelden
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <p><FontAwesomeIcon icon={faExclamationTriangle} /> Fehler: {error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                    Erneut versuchen
                </button>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="profile-error">
                <p><FontAwesomeIcon icon={faExclamationTriangle} /> Keine Profildaten verfügbar</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar-container">
                        <img
                            src={profileData.avatar || "/default-avatar.png"}
                            alt="Avatar"
                            className="profile-avatar"
                        />
                    </div>
                    <h2 className="profile-name">{profileData.fullName || profileData.username}</h2>
                    {profileData.age && <p className="profile-age">{profileData.age} Jahre</p>}
                    {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}
                    {profileData.balance && (
                        <p className="profile-balance">
                            Kontostand: <span className="balance-amount">{profileData.balance} €</span>
                        </p>
                    )}
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-value">{profileData.posts_count || 0}</span>
                        <span className="stat-label">Posts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{profileData.followers || 0}</span>
                        <span className="stat-label">Follower</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{profileData.following || 0}</span>
                        <span className="stat-label">Folge ich</span>
                    </div>
                </div>

                <div className="profile-menu">
                    <button className="menu-button" onClick={() => navigate("/profile")}>
                        <FontAwesomeIcon icon={faUser} /> Profile
                    </button>
                    <button className="menu-button" onClick={() => navigate("/feed")}>
                        <FontAwesomeIcon icon={faRss} /> Feed
                    </button>
                    <button className="menu-button" onClick={() => navigate("/followers")}>
                        <FontAwesomeIcon icon={faUsers} /> Follower
                    </button>
                    <button className="menu-button" onClick={() => navigate("/following")}>
                        <FontAwesomeIcon icon={faUserFriends} /> Folge ich
                    </button>
                    <button className="menu-button" onClick={() => navigate("/settings")}>
                        <FontAwesomeIcon icon={faCog} /> Einstellungen
                    </button>
                </div>

                <div className="profile-actions">
                    <button className="edit-profile-btn" onClick={handleEditProfile}>
                        <FontAwesomeIcon icon={faEdit} /> Profil bearbeiten
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Abmelden
                    </button>
                </div>

                <p className="profile-footer">© {new Date().getFullYear()}. Alle Rechte vorbehalten</p>
            </div>
        </div>
    );
};

export default MyProfile;