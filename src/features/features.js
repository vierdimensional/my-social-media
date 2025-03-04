import { createSlice } from "@reduxjs/toolkit";

let initialUser = '';

const initialState = {
    user: localStorage.getItem("user") || initialUser, // pomenqtj
    token: localStorage.getItem("token") || null, // pomenqtj
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken: (state, action) => { // pomenqtj
            state.token = action.payload.token; // pomenqtj
            localStorage.setItem("token", action.payload.token); // pomenqtj
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
            localStorage.setItem("user", action.payload.user);
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