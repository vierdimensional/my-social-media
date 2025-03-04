import React from 'react';
import {Link} from "react-router-dom";

const Nav = () => {
    return (
        <div>
            <nav>
                <Link to="/" > SignIn</Link>
                <Link to="/profile" > Profile</Link>
                <Link to="/feed" > Feed</Link>
                <Link to="/search" > Search</Link>
            </nav>
        </div>
    );
};

export default Nav;