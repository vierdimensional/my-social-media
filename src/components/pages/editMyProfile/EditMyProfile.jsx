import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./editMyProfile.scss";

const EditMyProfile = () => {
    const { token } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [postData, setPostData] = useState({
        username: "",
        avatar: "",
        age: "",
        bio: "",
        fullName: "",
        balance: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [photoInputType, setPhotoInputType] = useState("url");

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://49.13.31.246:9191/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify(postData),
            });
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            setPostData({
                username: "",
                avatar: "",
                age: "",
                bio: "",
                fullName: "",
                balance: "",
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        navigate("/feed")
    };

    const deleteProfile = async () => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить профиль? Это действие нельзя отменить!");

        if (!isConfirmed) return; // Если нажали "Отмена", просто выходим из функции

        try {
            await fetch("http://49.13.31.246:9191/me", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            navigate("/signIn");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="createProfile">
            <button className="delete-profile-btn" onClick={()=> deleteProfile()}>
                Удолить профиль
            </button>
            <h1>Редактировать профиль</h1>
            <form onSubmit={handleSubmit} className="new-post-form">
                <div className="form-group">
                    <label htmlFor="username">Новый Ник:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={postData.username}
                        onChange={handleChange}
                        placeholder="Введите ваш Ник"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Новый возраст:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={postData.age}
                        onChange={handleChange}
                        placeholder="Введите возраст"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Инфо о себе:</label>
                    <input
                        type="text"
                        id="bio"
                        name="bio"
                        value={postData.bio}
                        onChange={handleChange}
                        placeholder="Введите информацию о себе"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fullName">Новое Имя:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={postData.fullName}
                        onChange={handleChange}
                        placeholder="Введите полное имя"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="balance">Новый Баланс:</label>
                    <input
                        type="number"
                        id="balance"
                        name="balance"
                        value={postData.balance}
                        onChange={handleChange}
                        placeholder="Введите баланс"
                    />
                </div>
                <div className="form-group">
                    <label>Аватар:</label>
                    <div className="media-choice">
                        <label>
                            <input
                                type="radio"
                                name="photoInputType"
                                value="upload"
                                checked={photoInputType === "upload"}
                                onChange={() => setPhotoInputType("upload")}
                            />
                            Загрузить файл
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="photoInputType"
                                value="url"
                                checked={photoInputType === "url"}
                                onChange={() => setPhotoInputType("url")}
                            />
                            Ввести URL
                        </label>
                    </div>
                    {photoInputType === "upload" ? (
                        <input type="file" accept="image/*" />
                    ) : (
                        <input
                            type="text"
                            name="avatar"
                            value={postData.avatar}
                            onChange={handleChange}
                            placeholder="Введите URL изображения"
                        />
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Отправка..." : "Сохранить изменения"}
                </button>
            </form>

            <button className="back-to-profile-btn" onClick={() => navigate("/MyProfile")}>
                Вернуться в профиль
            </button>

            {error && <div className="error-msg">Ошибка: {error}</div>}
        </div>
    );
};

export default EditMyProfile;