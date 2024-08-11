import { useDispatch, useSelector } from 'react-redux';
import { signup, verifyToken } from '../app/slice/authSlice';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localMessage, setLocalMessage] = useState(""); // Local state for validation messages
    const dispatch = useDispatch();
    const { status, error, message } = useSelector((state) => state.auth);

    const handleSignup = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setLocalMessage("Passwords do not match.");
            return;
        }

        setLocalMessage("");
        dispatch(signup({ username, email, password }));
    };

    useEffect(() => {
        dispatch(verifyToken());
    }, []);


    
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-full max-w-md p-8 bg-slate-200 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2 ml-2">Username</label>
                        <input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2 ml-2">Email</label>
                        <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2 ml-2">Password</label>
                        <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-2 ml-2">Confirm Password</label>
                        <input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-sm hover:bg-blue-600 duration-500">Signup</button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
                </div>
                {localMessage && (
                    <div className="capitalize mt-4 p-2 text-center text-xl font-medium text-red-500">
                        {localMessage}
                    </div>
                )}
                {status === 'failed' && (
                    <div className="capitalize mt-4 p-2 text-center text-xl font-medium text-red-500">
                        {error?.message}
                    </div>
                )}
                {status === 'succeeded' && (
                    <div className="capitalize mt-4 p-2 text-center text-xl font-medium text-green-500">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
