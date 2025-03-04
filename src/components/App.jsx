import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Feed from "./pages/feed/Feed";
import Profile from "./pages/profile/Profile";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";

import './app.scss';
import Search from "./pages/search/Search";


const App = () => {
    return (
        <div>
            <BrowserRouter>

                <Routes>
                    <Route path='/'  element={<SignIn />} />
                    <Route path='/signUp'  element={<SignUp />} />
                    <Route path='/profile' index element={<Profile />} />
                    <Route path='/feed' element={<Feed />} />
                    <Route path='/search' element={<Search />} />

                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;