import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;

const initialState = {
    data: {},
    status: 'idle',
    error: null,
}

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (username, thunkAPI) => {
        try {
            const response = await axios.get(`${apiUrl}/api/v1/user/get?username=${username}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;
