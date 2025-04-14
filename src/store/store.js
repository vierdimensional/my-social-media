import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/features'

export const store = configureStore({
    reducer: {
        user: userReducer,
    }
});