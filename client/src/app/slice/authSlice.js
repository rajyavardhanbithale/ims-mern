
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
const initialState = {
    user: null,
    status: 'idle',
    error: null,
    message: null,
    verifyJWT: null,

}

export const login = createAsyncThunk('auth/login', async (user, { rejectWithValue }) => {
    const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
    try {
        const userRES = user.identifier.includes('@')
            ? { email: user.identifier, password: user.password }
            : { username: user.identifier, password: user.password };


        const response = await axios.post(`${apiUrl}/api/v1/user/login`,
            userRES,
            { withCredentials: true }
        );

        // implement only for different domain deployment to be removed if both 
        // frontend and backend are on the same domain 
        if (response.status === 200) {
            Cookies.set('Ltoken', response.data.token, { expires: 7 });
            window.location.href = '/';
        }

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const signup = createAsyncThunk('auth/signup', async (user, { rejectWithValue }) => {
    const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
    try {
        const response = await axios.post(`${apiUrl}/api/v1/user/signup`, user);
        return response.data.message;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data);
    }
});

export const verifyToken = createAsyncThunk('auth/verifyToken', async (path, { rejectWithValue }) => {
    const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
    try {
        const response = await axios.get(`${apiUrl}/api/v1/user/verify-jwt`, { withCredentials: true });
        console.log(response);
        if (response.status === 200) {
            window.location.href = path ? path : '/';
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.message = null;
            })
            .addCase(signup.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.message = action.payload;
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.message = null;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
            });
    },
});

export default authSlice.reducer;
