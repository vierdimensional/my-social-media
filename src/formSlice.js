import { createSlice } from '@reduxjs/toolkit';

export const formSlice = createSlice({
    name: 'form',
    initialState: {
        isSignUpActive: false,
    },
    reducers: {
        toggleForm: (state) => {
            state.isSignUpActive = !state.isSignUpActive;
        },
    },
});

export const { toggleForm } = formSlice.actions;

export default formSlice.reducer;