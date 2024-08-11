import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import profileSlice from './slice/profileSlice'


export const store = configureStore({
    reducer: {
        auth: authSlice,
        profile: profileSlice,
    },
})