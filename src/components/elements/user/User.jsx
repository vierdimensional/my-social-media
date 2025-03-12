import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./user.scss";

const User = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function initUsers() {
            try {
                const jwt = localStorage.getItem("token");

                if (!jwt) {
                    console.error("Kein Token gefunden. Benutzer nicht authentifiziert.");
                    return;
                }

                const response = await fetch("http://49.13.31.246:9191/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": jwt,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Fehler: ${response.status}`);
                }

                const data = await response.json();
                console.log("USERS DATA: ", data);
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fehler beim Laden der User:", error);
            }
        }

        initUsers();
    }, []);

    return (
        <div className="user-card">
            <h1>Alle User</h1>
            <ul>
                {users.length > 0 ? (
                    users.map((userItem) =>
                        userItem.avatar ? (
                            <li key={userItem._id} className={"user-item"}>
                                <Link to={`/profile/${userItem._id}`}>
                                    <img src={userItem.avatar} alt="avatar" className="miniAvatar" />
                                    <span>{userItem.username}</span>
                                </Link>
                            </li>
                        ) : null
                    )
                ) : (
                    <p>Keine Benutzer gefunden.</p>
                )}
            </ul>
        </div>
    );
};

export default User;
