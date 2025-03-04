import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profilePic from '../../../assets/img/sbcf-default-avatar.png';
import "./profile.scss";

const Profile = () => {
    const [userData, setUserData] = useState({ email: '' });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const jwt = localStorage.getItem('jwt');
                if (!jwt) {
                    console.warn("Токен не найден.");
                    return;
                }

                const response = await fetch('http://49.13.31.246:9191/me', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': jwt
                    },
                });

                if (!response.ok) {
                    throw new Error("Ошибка при загрузке профиля");
                }

                const data = await response.json();
                console.log("Данные пользователя:", data);
                setUserData({ email: data.username || '' });

            } catch (error) {
                console.error("Ошибка при получении данных профиля:", error);
            }
        }

        fetchProfile();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-avatar">
                <img src={profilePic} alt="Avatar" />
            </div>

            <h2>Добро пожаловать, {userData.email}!</h2>

            <div className="profile-buttons">
                <button onClick={() => navigate('/newpost')}>Neuer Beitrag</button>
                <button onClick={() => navigate('/feed')}>Alle Beiträge</button>
            </div>
        </div>
    );
};

export default Profile;
