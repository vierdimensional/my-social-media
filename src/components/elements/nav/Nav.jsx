import React from 'react';
import {Link} from "react-router-dom";

const Nav = () => {
    return (
        <div>
            <nav>
                <Link to="/" > Home</Link>
                <Link to="/profile" > Profile</Link>
                <Link to="/feed" > Feed</Link>
                <Link to="/search" > Serch</Link>
                <Link to="/signUp" > SignUp</Link>
            </nav>
        </div>
    );
};

export default Nav;