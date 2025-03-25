import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import './newPost.scss';//

const NewPost = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        status: '',
        image: '',
        video: ''
    });

    useEffect(() => {
        async function fetchPosts() {
            try {
                const jwt = localStorage.getItem('jwt');
                const response = await fetch('http://49.13.31.246:9191/get_posts', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': jwt
                    },
                });

                if (!response.ok) {
                    throw new Error(`Fehler: ${response.status}`);
                }

                const data = await response.json();
                console.log("Post-Daten: ", data);
                setPosts(data);
            } catch (error) {
                console.error("Fehler beim Laden der Posts:", error);
            }
        }

        fetchPosts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleSubmit = async (event) => {
        //event.preventDefault(); // Verhindert Standardformular-Submit

        try {
            const jwt = localStorage.getItem('jwt');
            const response = await fetch('http://49.13.31.246:9191/post_post', {
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
            setPosts([createdPost, ...posts]); // Neuer Post wird zur Liste hinzugefügt
            setNewPost({ title: '', description: '', status: '', image: '', video: '' }); // Formular zurücksetzen
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

            <div className="profile-buttons">
                {posts.map((post, index) => (
                    <Link to="/feed" key={index}>
                        <button>{post.title}</button>
                    </Link>
                ))}
            </div>
        </div>
    );

};

export default NewPost;
