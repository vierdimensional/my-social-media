import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSave,
    faArrowLeft,
    faTrashAlt,
    faSpinner,
    faExclamationTriangle,
    faCheck,
    faUpload,
    faLink
} from "@fortawesome/free-solid-svg-icons";
import "./editMyProfile.scss";
import Nav from "../../elements/nav/Nav";

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
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [photoInputType, setPhotoInputType] = useState("url");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Lade aktuelle Profildaten beim Komponenten-Mount
    useEffect(() => {
        const fetchProfileData = async () => {
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
                        navigate("/signin");
                        return;
                    }
                    throw new Error(`Fehler: ${response.status}`);
                }

                const userData = await response.json();
                setPostData({
                    username: userData.username || "",
                    avatar: userData.avatar || "",
                    age: userData.age || "",
                    bio: userData.bio || "",
                    fullName: userData.fullName || "",
                });

                if (userData.avatar) {
                    setAvatarPreview(userData.avatar);
                }
            } catch (err) {
                setError("Fehler beim Laden der Profildaten: " + err.message);
            } finally {
                setFetchLoading(false);
            }
        };

        if (token) {
            fetchProfileData();
        } else {
            navigate("/signin");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            // Erstelle eine Vorschau des ausgewählten Bildes
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async () => {
        if (!avatarFile) return null;

        const formData = new FormData();
        formData.append("avatar", avatarFile);

        try {
            const response = await fetch("http://49.13.31.246:9191/upload", {
                method: "POST",
                headers: {
                    "x-access-token": token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Avatar-Upload fehlgeschlagen");
            }

            const data = await response.json();
            return data.url; // Angenommen, der Server gibt die URL zurück
        } catch (err) {
            throw new Error("Bild-Upload fehlgeschlagen: " + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validierung
            if (postData.age && (isNaN(postData.age) || postData.age < 0)) {
                throw new Error("Alter muss eine positive Zahl sein");
            }

            if (postData.balance && (isNaN(postData.balance) || postData.balance < 0)) {
                throw new Error("Kontostand muss eine positive Zahl sein");
            }

            let updatedData = { ...postData };

            // Upload des Avatars, falls eine Datei ausgewählt wurde
            if (photoInputType === "upload" && avatarFile) {
                const avatarUrl = await uploadAvatar();
                if (avatarUrl) {
                    updatedData.avatar = avatarUrl;
                }
            }

            // Entferne leere Felder, um nur geänderte Daten zu senden
            Object.keys(updatedData).forEach(key => {
                if (updatedData[key] === "") {
                    delete updatedData[key];
                }
            });

            const response = await fetch("http://49.13.31.246:9191/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Fehler: ${response.status} ${await response.text()}`);
            }

            setSuccess(true);

            // Zeige Erfolgsmeldung für 2 Sekunden an und leite dann weiter
            setTimeout(() => {
                navigate("/MyProfile");
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteProfile = async () => {
        const isConfirmed = window.confirm("Sind Sie sicher, dass Sie Ihr Profile löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!");

        if (!isConfirmed) return;

        setLoading(true);
        try {
            const response = await fetch("http://49.13.31.246:9191/me", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) {
                throw new Error(`Fehler: ${response.status}`);
            }

            // Entferne Token aus localStorage und leite zur Anmeldung weiter
            localStorage.removeItem("token");
            navigate("/signin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p>Profildaten werden geladen...</p>
            </div>
        );
    }

    return (
        <div className="box-content">
            <div>
                <Nav/>
                <div className="edit-profile-container">
                    {success && (
                        <div className="success-message">
                            <FontAwesomeIcon icon={faCheck}/> Änderungen erfolgreich gespeichert!
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <FontAwesomeIcon icon={faExclamationTriangle}/> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="edit-profile-form">
                        <h1 className="edit-profile-title">Profil bearbeiten</h1>

                        <div className="avatar-preview-container">
                            {avatarPreview && (
                                <div className="avatar-preview">
                                    <img src={avatarPreview} alt="Avatar Vorschau"/>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Benutzername:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={postData.username}
                                onChange={handleChange}
                                placeholder="Benutzername eingeben"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fullName">Vollständiger Name:</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={postData.fullName}
                                onChange={handleChange}
                                placeholder="Vollständigen Namen eingeben"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Alter:</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={postData.age}
                                onChange={handleChange}
                                min="0"
                                placeholder="Alter eingeben"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">Über mich:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={postData.bio}
                                onChange={handleChange}
                                placeholder="Erzähle etwas über dich"
                                rows="4"
                            />
                        </div>

                        <div className="form-group avatar-group">
                            <label>Avatar:</label>
                            <div className="media-choice">
                                <label className={`choice-option ${photoInputType === "url" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="photoInputType"
                                        value="url"
                                        checked={photoInputType === "url"}
                                        onChange={() => setPhotoInputType("url")}
                                    />
                                    <FontAwesomeIcon icon={faLink}/> URL eingeben
                                </label>
                                <label className={`choice-option ${photoInputType === "upload" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="photoInputType"
                                        value="upload"
                                        checked={photoInputType === "upload"}
                                        onChange={() => setPhotoInputType("upload")}
                                    />
                                    <FontAwesomeIcon icon={faUpload}/> Datei hochladen
                                </label>
                            </div>

                            {photoInputType === "upload" ? (
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file-input"
                                    />
                                    <label htmlFor="avatar-upload" className="file-upload-btn">
                                        <FontAwesomeIcon icon={faUpload}/> Bild auswählen
                                    </label>
                                    {avatarFile && <span className="file-name">{avatarFile.name}</span>}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    name="avatar"
                                    value={postData.avatar}
                                    onChange={handleChange}
                                    placeholder="Geben Sie die URL des Bildes ein"
                                />
                            )}
                        </div>

                        <div className="button-group">

                            <button
                                type="submit"
                                className="save-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin/> Speichern...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave}/> Änderungen speichern
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="edit-my-profile-back-button"
                                onClick={() => navigate("/MyProfile")}
                            >
                                <FontAwesomeIcon icon={faArrowLeft}/> Zurück zum Profil
                            </button>
                        </div>
                    </form>

                    <div className="delete-profile-container">
                        <button
                            className="delete-profile-btn"
                            onClick={deleteProfile}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faTrashAlt}/> Profil löschen
                        </button>
                        <p className="delete-warning">
                            Achtung: Diese Aktion kann nicht rückgängig gemacht werden!
                        </p>
                    </div>
                </div>
            </div>
            </div>
            );
            };

            export default EditMyProfile;