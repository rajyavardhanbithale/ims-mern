import { useDispatch, useSelector } from 'react-redux';
import { login, verifyToken } from '../app/slice/authSlice';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { status, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(verifyToken());
    }, []);
    
    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login({ identifier, password }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-full max-w-md p-8 bg-slate-200 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="identifier" className="block text-base font-medium text-gray-700 mb-2 ml-2">Email or Username</label>
                        <input id="identifier" type="text" placeholder="email or username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required className="w-full py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2 ml-2">Password</label>
                        <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-sm hover:bg-blue-600 duration-500">Login</button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link></p>
                </div>
                {status === 'failed' && (
                    <div className="mt-4 p-2 text-center text-sm font-medium text-red-500">
                        {error?.message}
                    </div>
                )}
            </div>
        </div>
    );
}
