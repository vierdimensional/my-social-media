import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import "./userProfile.scss";

const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const token = useSelector((state) => state.auth?.token);

    const fetchUserPosts = async (userId) => {
        if (!token || !userId) return;

        try {
            const response = await axios.get(`http://49.13.31.246:9191/posts?user_id=${userId}`, {
                headers: { "x-access-token": token },
            });
            setUserPosts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setUserPosts([]);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setError("Необходима авторизация");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://49.13.31.246:9191/user/${username}`, {
                    headers: { "x-access-token": token },
                });

                setUser(response.data);
                if (response.data._id) {
                    fetchUserPosts(response.data._id);
                }
            } catch (err) {
                setError("Ошибка при загрузке профиля");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token, username]);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`http://49.13.31.246:9191/followings/${username}`, {
                    headers: { "x-access-token": token },
                });

                const followingList = response.data.following || [];
                const isUserFollowing = followingList.some(user => user.username === username);
                setIsFollowing(isUserFollowing);
                localStorage.setItem(`isFollowing_${username}`, JSON.stringify(isUserFollowing));
            } catch (err) {
                console.error("Ошибка проверки подписки:", err);
            }
        };

        const storedFollowing = localStorage.getItem(`isFollowing_${username}`);
        if (storedFollowing !== null) {
            setIsFollowing(JSON.parse(storedFollowing));
        } else {
            checkFollowingStatus();
        }
    }, [token, username]);

    const handleFollow = async () => {
        if (!token || !user) return;
        setIsLoadingFollow(true);

        try {
            await axios.post(`http://49.13.31.246:9191/follow`, { username }, {
                headers: { "x-access-token": token },
            });

            setIsFollowing(true);
            setUser(prevUser => ({ ...prevUser, followers: (prevUser.followers || 0) + 1 }));
            localStorage.setItem(`isFollowing_${username}`, JSON.stringify(true));
        } catch (error) {
            console.error("Ошибка подписки:", error);
        } finally {
            setIsLoadingFollow(false);
        }
    };

    const handleUnfollow = async () => {
        if (!token || !user) return;
        setIsLoadingFollow(true);

        try {
            await axios.post(`http://49.13.31.246:9191/unfollow`, { username }, {
                headers: { "x-access-token": token },
            });

            setIsFollowing(false);
            setUser(prevUser => ({ ...prevUser, followers: (prevUser.followers || 0) - 1 }));
            localStorage.setItem(`isFollowing_${username}`, JSON.stringify(false));
        } catch (error) {
            console.error("Ошибка отписки:", error);
        } finally {
            setIsLoadingFollow(false);
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div className="error">Пользователь не найден</div>;

    return (
        <div className="container">
            <div className="profile-container">
                <div className="cover-image"></div>
                <div className="profile-content">
                    <div className="profile-image">
                        <img src={user.avatar || "https://via.placeholder.com/80"} alt="Avatar" />
                    </div>
                    <div className="profile-info">
                        <h2 className="name">
                            {user.fullName} <FaCheckCircle className="verified" />
                        </h2>
                        <div className="connections">
                            <p><strong>Подписчики:</strong> {user.followers || 0}</p>
                            <p><strong>Подписки:</strong> {user.following || 0}</p>
                        </div>
                        <div className="follow-section">
                            <button
                                className="follow-btn"
                                onClick={handleFollow}
                                disabled={isLoadingFollow}
                            >
                                {isLoadingFollow && !isFollowing ? "Подписка..." : "Подписаться"}
                            </button>

                            <button
                                className="unfollow-btn"
                                onClick={handleUnfollow}
                                disabled={isLoadingFollow}
                            >
                                {isLoadingFollow && isFollowing ? "Отписка..." : "Отписаться"}
                            </button>
                            {isFollowing && <span className="follow-status">✔ Вы подписаны</span>}
                        </div>
                        <p className="details">
                            <span className="location"><FaMapMarkerAlt /> {user.bio || "Нет информации"}</span>
                            <span className="joined"><FaCalendarAlt /> Age - {user.age || "Не указан"}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;