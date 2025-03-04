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
    },
});

export const { setToken } = userSlice.actions;
export default userSlice.reducer;