import React, { useState } from 'react';
import "./newPost.scss";

const NewPost = () => {
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        status: '',
        image: '',
        video: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        const { title, description } = newPost;
        if (!title.trim() || !description.trim()) {
            setErrorMessage('Bitte fülle Titel und Beschreibung aus.');
            return;
        }

        try {
            const jwt = localStorage.getItem('token');
            const response = await fetch('http://49.13.31.246:9191/post', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': jwt
                },
                body: JSON.stringify(newPost)
            });

            if (!response.ok) {
                throw new Error(`Fehler: ${response.status}`);
            }

            alert("✅ Beitrag erfolgreich erstellt!");

            window.location.reload();

        } catch (error) {
            console.error("Fehler beim Erstellen des Posts:", error);
            setErrorMessage("Beim Erstellen des Beitrags ist ein Fehler aufgetreten.");
        }
    };

    return (
        <div className="new-post-section">
            <h2 className="new-post-header">Neuer Beitrag</h2>

            <form className="new-post-form" onSubmit={handleSubmit}>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <input
                    className="new-post-input"
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleChange}
                    placeholder="Titel"
                    required
                />
                <textarea
                    className="new-post-input"
                    name="description"
                    value={newPost.description}
                    onChange={handleChange}
                    placeholder="Beschreibung"
                    required
                />
                <input
                    className="new-post-input"
                    type="text"
                    name="status"
                    value={newPost.status}
                    onChange={handleChange}
                    placeholder="Status"
                />
                <input
                    className="new-post-input"
                    type="text"
                    name="image"
                    value={newPost.image}
                    onChange={handleChange}
                    placeholder="Link zum Bild"
                />
                <input
                    className="new-post-input"
                    type="text"
                    name="video"
                    value={newPost.video}
                    onChange={handleChange}
                    placeholder="Link zum Video"
                />
                <button className="new-post-button" type="submit">Veröffentlichen</button>
            </form>
        </div>
    );
};

export default NewPost;
