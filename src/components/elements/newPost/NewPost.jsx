import React, { useState } from 'react';
import "./newPost.scss";

const NewPost = ({ posts, setPosts }) => {
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        status: '',
        image: '',
        video: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Das ist entscheidend - verhindert das Neuladen der Seite

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

            const createdPost = await response.json();
            setPosts([createdPost, ...posts]); // Verwende setPosts aus den Props
            setNewPost({ title: '', description: '', status: '', image: '', video: '' });
        } catch (error) {
            console.error("Fehler beim Erstellen des Posts:", error);
        }
    };

    return (
        <div className="new-post-section">
            <h2 className="new-post-header">Neuen Post erstellen</h2>

            <form className="new-post-form" onSubmit={handleSubmit}>
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