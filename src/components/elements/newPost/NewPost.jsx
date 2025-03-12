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
                    throw new Error(`Ошибка: ${response.status}`);
                }

                const data = await response.json();
                console.log("Данные постов: ", data);
                setPosts(data);
            } catch (error) {
                console.error("Ошибка при загрузке постов:", error);
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
                throw new Error(`Ошибка: ${response.status}`);
            }

            const createdPost = await response.json();
            setPosts([createdPost, ...posts]); // Neuer Post wird zur Liste hinzugefügt
            setNewPost({ title: '', description: '', status: '', image: '', video: '' }); // Formular zurücksetzen
        } catch (error) {
            console.error("Ошибка при создании поста:", error);
        }
    };

    return (
        <div>
            <h2>Создать новый пост</h2>
            <form className="newpost-form" onSubmit={handleSubmit}>
                <input className="newpost-title" type="text" name="title" value={newPost.title} onChange={handleChange} placeholder="Заголовок" required />
                <textarea className="newpost-description" name="description" value={newPost.description} onChange={handleChange} placeholder="Описание" required />
                <input className="newpost-image" type="text" name="image" value={newPost.image} onChange={handleChange} placeholder="Ссылка на изображение" />
                <input className="newpost-video" type="text" name="video" value={newPost.video} onChange={handleChange} placeholder="Ссылка на видео" />
                <button className="newpost-button" type="submit">Опубликовать</button>
            </form>

            <h2>Все посты</h2>
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
