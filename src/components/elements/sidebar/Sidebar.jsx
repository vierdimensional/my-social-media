import React from 'react';
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <ul>
                <li>
                    <Link to="/profile"> Profile</Link>
                </li>
                <li>
                    <Link to="/feed"> Feed</Link>
                </li>

            </ul>


        </div>
    );
};

export default Sidebar;