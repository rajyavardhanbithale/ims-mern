
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export default function Navbar() {
    const handleLogout = async () => {
        const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
        try {
            await axios.get(`${apiUrl}/api/v1/user/logout`, {
                withCredentials: true
            });

            Cookies.remove('token');
            Cookies.remove('Ltoken');
            window.location.href = '/';
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className="bg-slate-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">
                    IMS
                </Link>
                <ul className="flex space-x-4">
                    <li>
                        <Link
                            to="/"
                            className="font-semibold text-white hover:bg-slate-700 px-3 py-2 duration-500 rounded-2xl"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard"
                            className="font-semibold text-white hover:bg-slate-700 px-3 py-2 duration-500 rounded-2xl"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <span
                        onClick={handleLogout}
                            className="font-semibold text-white hover:bg-slate-700 px-3 py-2 duration-500 rounded-2xl"
                        >
                            Logout
                        </span>
                    </li>
                </ul>
            </div>
        </nav>
    );
};


