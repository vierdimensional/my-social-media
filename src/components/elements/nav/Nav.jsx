import React from 'react';
import {Link} from "react-router-dom";
import Search from "../search/Search";

const Nav = () => {
    return (
        <div>
            <nav>
                <Link to="/" > SignIn</Link>
                <Link to="/profile" > Profile</Link>
                <Search/>
            </nav>
        </div>
    );
};

export default Nav;