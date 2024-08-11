import React, { useState } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

const ConfirmPopup = ({ isOpen, onClose, onConfirm, action }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (email && password) {
            onConfirm({ email, password });
        } else {
            setError("Email and password are required.");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                    >
                        <AiOutlineClose className="text-2xl" />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">
                        Confirm {action}
                    </h2>
                    <div className="mb-4">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-2 px-4 border border-gray-300 rounded-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-2 px-4 border border-gray-300 rounded-full"
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-full"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-full"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmPopup;
