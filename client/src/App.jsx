import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import { useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
            try {
                const res = await axios.get(
                    `${apiUrl}/api/v1/user/verify-jwt`,
                    { withCredentials: true }
                );
            } catch (err) {
                navigate("/login");
            }
        };
        verifyToken();
    }, []);

    return (
        <>
            <Navbar />
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
