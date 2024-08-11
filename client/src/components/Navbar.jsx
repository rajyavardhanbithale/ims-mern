// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
