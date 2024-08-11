import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
            try {
                const res = await axios.get(`${apiUrl}/api/v1/user/get`, {
                    withCredentials: true,
                });

                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);
    const handleProfilePic = (imageURL) => {
        try {
            const image = imageURL.split(":");
            if (image.includes("http") || image.includes("https")) {
                return imageURL;
            }
        } catch (err) {}
        return `${import.meta.env.VITE_BACKEND_ENDPOINT_URL}/uploads/${imageURL}`;
    };
    return (
        <>
            {users && (
                <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10">
                    <div className="text-4xl font-bold mb-8 text-slate-800">
                        Available Users
                    </div>
                    <div className="w-full max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map(
                            (user, idx) =>
                                user.public && (
                                    <Link
                                        key={idx}
                                        to={`/profile/${user.username}`}
                                    >
                                        <div className="cursor-pointer bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                            <div className="p-4 w-full h-full flex justify-center items-center align-middle overflow-hidden">
                                                <img
                                                    className="w-full h-48 object-contain hover:scale-105 transform transition-transform duration-300"
                                                    src={handleProfilePic(
                                                        user.pic
                                                    )}
                                                    alt="User Profile"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h2 className="text-xl font-semibold mb-2 text-slate-800">
                                                    {user.username}
                                                </h2>
                                                <p className="text-slate-600 text-base truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                        )}
                    </div>
                </div>
            )}
            {!users && <Loading />}
        </>
    );
}
