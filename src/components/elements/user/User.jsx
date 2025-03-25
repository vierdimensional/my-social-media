import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import avatar from '../../../assets/img/sbcf-default-avatar.png';
import "./user.scss";

const User = () => {
    const {token, username} = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [following, setFollowing] = useState(new Set()); // ✅ Подписки пользователя
    const navigate = useNavigate(); // ✅ Для перехода на страницу профиля

    // 📌 Загружаем всех пользователей и мои подписки
    useEffect(() => {
        if (!token) {
            setError("❌ Ошибка: Токен не найден.");
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch("http://49.13.31.246:9191/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

                const data = await response.json();

                // ✅ Исключаем текущего пользователя из списка
                const filteredUsers = data.filter(user => user.username !== username);
                setUsers(filteredUsers);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchMyFollowing = async () => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (!response.ok) throw new Error("Ошибка загрузки подписок");

                const data = await response.json();
                const myFollowing = new Set(data.following.map((u) => u.username)); // ✅ Формируем Set из подписок
                setFollowing(myFollowing);
            } catch (err) {
                console.error("❌ Ошибка загрузки подписок:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        fetchMyFollowing();
    }, [token, username]);

    // 📌 Подписка / Отписка
    const toggleFollow = async (userToFollow) => {
        const isFollowing = following.has(userToFollow);
        const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({username: userToFollow}),
            });
            if (!response.ok) throw new Error(`Ошибка ${isFollowing ? "отписки" : "подписки"}`);

            // 📌 Обновляем UI мгновенно
            setFollowing((prev) => {
                const updatedSet = new Set(prev);
                if (isFollowing) {
                    updatedSet.delete(userToFollow);
                } else {
                    updatedSet.add(userToFollow);
                }
                return updatedSet;
            });
        } catch (err) {
            console.error("❌ Ошибка при подписке/отписке:", err.message);
        }
    };

    // 📌 UI обработка ошибок и загрузки
    if (loading) return <div className="loading">⏳ Загрузка...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <div className="user-list-container">
            <h2 className="uberschrift_user">
                <FontAwesomeIcon icon={faUsers}/> Alle User
            </h2>
            <div className="user-list">
                {users.map((userItem) => (
                    <div key={userItem._id} className="user-item">
                        {/* ✅ Клик на аватар или имя перенаправляет в профиль */}
                        <div className="user-info" onClick={() => navigate(`/user/${userItem.username}`)}>
                            <img src={userItem.avatar || avatar} alt="Avatar" className="user-avatar"/>
                            <h4>{userItem.fullName || "Ohne Name"}</h4>
                            <p>@{userItem.username}</p>
                        </div>

                        {/* ✅ Кнопка подписки / отписки */}
                        <button
                            className={`follow-btn ${following.has(userItem.username) ? "following" : ""}`}
                            onClick={() => toggleFollow(userItem.username)}
                        >
                            {following.has(userItem.username) ? "Löschen" : "Folgen"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default User;