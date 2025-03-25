import { createSlice } from "@reduxjs/toolkit";

let initialUser = '';

const initialState = {
    user: localStorage.getItem("user") || initialUser,
    token: localStorage.getItem("token") || null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.username  = action.payload.username ;
            localStorage.setItem("user", action.payload.user);
            localStorage.setItem("username", action.payload.username);
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { setToken, setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;