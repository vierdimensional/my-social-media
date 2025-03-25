import React from "react";
import "./feed.scss";
import Profile from "../../elements/profile/Profile";
import User from "../../elements/user/User";
import Posts from "../../elements/posts/Posts";
import NewPost from "../../elements/newPost/NewPost";
import LastPost from "../../elements/lastpost/LastPost";
import Nav from "../../elements/nav/Nav";

const Feed = () => {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar-left">
                <Profile/>
            </aside>
            <main className="main-content">
                <NewPost/>
                <Posts/>
            </main>

            <aside className="sidebar-right">
                <User/>
            </aside>
        </div>
);
};

export default Feed;
