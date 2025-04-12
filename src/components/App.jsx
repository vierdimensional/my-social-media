import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Search from "./elements/search/Search";
import Feed from "./pages/feed/Feed";
import Posts from "./elements/posts/Posts";
import MyProfile from "./pages/myProfile/MyProfile";
import UserProfile from "./pages/userProfile/UserProfile";
import EditMyProfile from "./pages/editMyProfile/EditMyProfile";
import Followers from "./pages/follow/Followers";
import Following from "./pages/following/Following";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";
import AllUser from "./pages/allUser/AllUser";
import "./app.scss";



const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                <Route path='/signIn' element={<SignIn />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='/myProfile' element={<MyProfile />} />
                <Route path='/alluser' element={<AllUser />} />
                <Route path="/followers/:username" element={<Followers />} />
                <Route path="/following/:username" element={<Following />} />
                <Route path='/feed' element={<Feed />} />
                <Route path='/search' element={<Search />} />
                <Route path='/editmyprofile' element={<EditMyProfile />} />
                <Route path='/posts' element={<Posts />} />
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/userprofile/:username' element={<UserProfile />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;