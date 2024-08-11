import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AiOutlineUser, AiOutlineDelete, AiOutlineMail, AiOutlinePhone, AiOutlinePayCircle } from "react-icons/ai";
import { HiOutlineEyeOff } from "react-icons/hi";
import ConfirmPopup from "./ConfirmPopup";
import Loading from "./Loading";

export default function Dashboard() {
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        password: "",
        public: false,
        pic: "",
        contact: "",
        bio: "",
        country: "",
        isActive: false,
    });
    const [editableFields, setEditableFields] = useState({
        contact: "",
        bio: "",
        country: "",
    });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [actionType, setActionType] = useState("");
    const navigate = useNavigate();

    console.log(document.cookie);
    

    useEffect(() => {
        const fetchProfile = async () => {
            const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
            const userJWT = Cookies.get("Ltoken");
            const decoded = jwtDecode(userJWT);

            console.log(decoded);

            try {
                const res = await axios.get(
                    `${apiUrl}/api/v1/user/get?username=${decoded.username}`,
                    { withCredentials: true }
                );
                setProfile(res.data);
                setEditableFields({
                    contact: res.data.contact || "",
                    bio: res.data.bio || "",
                    country: res.data.country || "",
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        const updatedFields = { ...editableFields, public: profile.public };
        const userUpdates = Object.fromEntries(
            Object.entries(updatedFields).filter(
                ([key, value]) => value !== "" && value !== null
            )
        );

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
            const res = await axios.put(
                `${apiUrl}/api/v1/user/update/${profile.username}`,
                userUpdates,
                { withCredentials: true }
            );
            setMessage(res.data.message);
            setIsError(false);
        } catch (err) {
            setMessage(err.response?.data?.message || "An error occurred.");
            setIsError(true);
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    const handlePublicChange = (e) => {
        setProfile({ ...profile, public: e.target.checked });
    };

    const handleDelete = () => {
        setActionType("delete");
        setShowPopup(true);
    };

    const handleDeactivate = () => {
        setActionType("deactivate");
        setShowPopup(true);
    };

    const confirmAction = async ({ email, password }) => {
        const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
        try {
            if (actionType === "delete") {
                await axios.delete(`${apiUrl}/api/v1/user/delete`, {
                    data: { email, password },
                    withCredentials: true,
                });
                navigate("/");
            } else if (actionType === "deactivate") {
                await axios.patch(
                    `${apiUrl}/api/v1/user/deactivate`,
                    { email, password },
                    { withCredentials: true }
                );
                setProfile({ ...profile, isActive: false });
            }
            setMessage(`Profile ${actionType}d successfully.`);
            setIsError(false);

            Cookies.remove("token");
            window.location.href = "/login";
        } catch (err) {
            console.error(`Error ${actionType}ing profile:`, err);
            setMessage(`Error ${actionType}ing profile.`);
            setIsError(true);
        } finally {
            setShowPopup(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_ENDPOINT_URL;
            const res = await axios.post(
                `${apiUrl}/api/v1/upload/image`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };

    const handleProfilePic = () => {
        const image = profile.pic.split(":");

        if (image.includes("http") || image.includes("https")) {
            return profile.pic;
        }
        return `${import.meta.env.VITE_BACKEND_ENDPOINT_URL}/uploads/${profile.pic}`;
    };

    return (
        <>
            {profile.username.length !== 0 &&
                <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
                        <h1 className="text-3xl font-bold mb-6 text-center text-slate-900">
                            Profile Dashboard
                        </h1>
                        <div className="space-y-6">
                            <div className="text-center">
                                <label className="block text-base font-medium text-slate-700 mb-2 ml-2">
                                    Profile Picture
                                </label>
                                <div className="flex justify-center items-center">
                                    <img
                                        src={handleProfilePic()}
                                        alt="Profile"
                                        className="w-32 h-32 object-cover rounded-full border border-slate-300"
                                    />
                                </div>

                                <div className="flex justify-center items-center gap-5 mt-5">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="py-1 px-4"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-base font-medium text-slate-700 mb-2 ml-2">
                                    <AiOutlineUser className="inline-flex mb-0.5 mr-2 text-lg" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    readOnly
                                    className="w-full py-2 px-4 border border-slate-300 rounded-full shadow-sm bg-slate-100 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-medium text-slate-700 mb-2 ml-2">
                                    <AiOutlineMail className="inline-flex mb-0.5 mr-2 text-lg" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    readOnly
                                    className="w-full py-2 px-4 border border-slate-300 rounded-full shadow-sm bg-slate-100 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="block text-base font-medium text-slate-700 ml-2">
                                    Public
                                </label>
                                <input
                                    type="checkbox"
                                    checked={profile.public}
                                    onChange={handlePublicChange}
                                    className="mr-2"
                                />
                            </div>

                            <div className="flex gap-5 justify-between">
                                <div className="w-1/2">
                                    <label
                                        htmlFor="contact"
                                        className="block text-base font-medium text-slate-700 mb-2 ml-2"
                                    >
                                        <AiOutlinePhone className="inline-flex mb-0.5 mr-2 text-lg" />
                                        Contact
                                    </label>
                                    <input
                                        id="contact"
                                        type="text"
                                        placeholder="Enter your contact information"
                                        value={editableFields.contact}
                                        onChange={(e) =>
                                            setEditableFields({
                                                ...editableFields,
                                                contact: e.target.value,
                                            })
                                        }
                                        className="w-full py-2 px-4 border border-slate-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label
                                        htmlFor="country"
                                        className="block text-base font-medium text-slate-700 mb-2 ml-2"
                                    >
                                        <AiOutlinePayCircle className="inline-flex mb-0.5 mr-2 text-lg" />
                                        Country
                                    </label>
                                    <input
                                        id="country"
                                        type="text"
                                        placeholder="Enter your country"
                                        value={editableFields.country}
                                        onChange={(e) =>
                                            setEditableFields({
                                                ...editableFields,
                                                country: e.target.value,
                                            })
                                        }
                                        className="w-full py-2 px-4 border border-slate-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-base font-medium text-slate-700 mb-2 ml-2"
                                >
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    placeholder="Tell us about yourself"
                                    value={editableFields.bio}
                                    onChange={(e) =>
                                        setEditableFields({
                                            ...editableFields,
                                            bio: e.target.value,
                                        })
                                    }
                                    className="w-full py-2 px-4 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="py-2 px-4 bg-slate-300 text-slate-800 font-semibold rounded-full shadow-sm hover:bg-slate-400 duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-sm hover:bg-blue-600 duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeactivate}
                                    className="py-2 px-4 bg-yellow-500 text-white font-semibold rounded-full shadow-sm hover:bg-yellow-600 duration-300"
                                >
                                    <HiOutlineEyeOff className="inline-flex mb-0.5 mr-2 text-lg" />
                                    Deactivate
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded-full shadow-sm hover:bg-red-600 duration-300"
                                >
                                    <AiOutlineDelete className="inline-flex mb-0.5 mr-2 text-lg" />
                                    Delete
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div
                                className={`capitalize mt-4 p-2 text-center text-xl font-medium ${isError ? "text-red-500" : "text-green-500"}`}
                            >
                                {message}
                            </div>
                        )}
                    </div>

                    <ConfirmPopup
                        isOpen={showPopup}
                        onClose={() => setShowPopup(false)}
                        onConfirm={confirmAction}
                        action={actionType}
                    />
                </div>
            }

            {profile.username.length === 0 && <Loading />}
        </>
    );
}