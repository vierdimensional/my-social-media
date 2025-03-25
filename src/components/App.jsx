import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
//import { jwtDecode } from "jwt-decode";//
import Feed from "./pages/feed/Feed";
import MyProfile from "./pages/myProfile/MyProfile";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import EditMyProfile from "./pages/editMyProfile/EditMyProfile";
import Search from "./elements/search/Search";
import Nav from "./elements/nav/Nav";
import Posts from "./elements/posts/Posts";
import "./app.scss";


/*
const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp && decoded.exp < currentTime) {
                        // Token ist abgelaufen -> auf "/signIn" weiterleiten
                        localStorage.removeItem("token");
                        navigate("/signIn");
                    } else {
                        // Token ist gültig -> auf "/feed" weiterleiten
                        navigate("/feed");
                    }
                } catch (error) {
                    console.error("Token-Fehler:", error);
                    localStorage.removeItem("token");
                    navigate("/signIn");
                }
            } else {
                navigate("/signIn");
            }
        };

        checkToken();
    }, [navigate]);

    return null;
};
*/

const App = () => {
    return (
        <BrowserRouter>
            <Nav/>
            <Routes>
                <Route path='/signIn' element={<SignIn />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='/myProfile' element={<MyProfile />} />
                <Route path='/feed' element={<Feed />} />
                <Route path='/search' element={<Search />} />
                <Route path='/editmyprofile' element={<EditMyProfile />} />
                <Route path='/posts' element={<Posts />} />


            </Routes>
        </BrowserRouter>
    );
};

export default App;
