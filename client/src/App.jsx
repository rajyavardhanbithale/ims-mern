import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
            try {
                await axios.get(`${apiUrl}/api/v1/user/verify-jwt`, {
                    withCredentials: true
                });
            } catch (err) {
                navigate("/login");
            }
        };

        verifyToken();
    }, []);

    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideNavbar && <Navbar />}
            <div className="p-4 bg-slate-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Signup />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
