import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './user.scss';


const User = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function initUsers() {
            try {
                const jwt = localStorage.getItem('jwt');
                const response = await fetch('http://49.13.31.246:9191/users', {
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
                console.log("USERS DATA: ", data);
                setUsers(data);
            } catch (error) {
                console.error("Fehler beim Laden des Feeds:", error);
            }
        }

        initUsers();
    }, []);


    return (
        <div>
            <h1>Все пользователи</h1>
            <ul>
                {
                    users.map(user => (
                        (user.avatar) ? <li key={user._id}>
                            <Link >
                                <img src={user.avatar} alt="avatar" className='miniAvatar' />
                                <span>{user.username}</span>

                            </Link>
                        </li> : null
                    ))
                }
            </ul>
        </div>
    );
};

export default User;