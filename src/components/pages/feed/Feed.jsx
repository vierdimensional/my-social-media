import React, { useEffect, useState } from 'react';
import './feed.scss';
import Users from '../../elements/user/User';
import Profile from "../profile/Profile";

const Feed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function initFeed() {
            try {
                const jwt = localStorage.getItem('jwt');
                const response = await fetch('http://49.13.31.246:9191/posts', {
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
                console.log("FEED DATA: ", data);
                setPosts(data);
            } catch (error) {
                console.error("Fehler beim Laden des Feeds:", error);
            }
        }

        initFeed();
    }, []);

    return (
        <div className="feed-wrapper">
            <div className="sidebar">
                <Profile/>
            </div>
            <div className="feed-container">
                <h2>Beiträge</h2>
                <hr/>
                {posts.length > 0 ? (
                    posts.reverse().map((post) => (
                        (post.title && post.image && /(http(s?):)([/|.|\w|\s|-])*.\.(?:jpg|gif|png)/g.test(post.image)) ?
                            <div key={post._id} className="feed-post">
                                <img src={post.user[0].avatar} className='authorAvatar'/>
                                <p>Author: {post.user[0].username}</p>
                                <h3>{post.title}</h3>
                                <p>{post.description}</p>
                                {
                                    <img src={post.image} alt="Post" className="post-image"/>
                                }
                            </div>
                            :
                            null
                    ))
                ) : (
                    <p className="no-posts">Keine Beiträge verfügbar.</p>
                )}
            </div>
            <div className="sidebar">
                <Users/>
            </div>
        </div>
    );
};

export default Feed;
