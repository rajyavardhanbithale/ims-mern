import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../app/slice/profileSlice';
import Loading from './Loading';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function Profile() {
    const { id: username } = useParams();
    const dispatch = useDispatch();
    const { data: profile, status, error } = useSelector((state) => state.profile);
    const [localProfile, setLocalProfile] = useState(null);

    useEffect(() => {
        setLocalProfile(null);
        dispatch(fetchProfile(username));
    }, []);

    useEffect(() => {
        if (profile) {
            setLocalProfile(profile);
        }
    }, [profile]);


    const handleProfilePic = () => {
        const image = profile.pic?.split(":");

        if (image?.includes("http") || image?.includes("https")) {
            return profile.pic;
        }
        return `${import.meta.env.VITE_BACKEND_ENDPOINT_URL}/uploads/${profile.pic}`;
    };

    if (status === 'loading') return <Loading />;
    if (status === 'failed') return <div className="text-red-500 text-center">Error: {error?.message}</div>;


    return (
        <>
            {localProfile &&
                <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-10 px-4">
                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="w-full h-64 flex justify-center items-center align-middle overflow-hidden">
                            <img
                                className="w-64 h-full rounded-2xl object-cover hover:scale-105 transform transition-transform duration-300"
                                src={handleProfilePic()}
                                alt={`${localProfile.username}'s profile`}
                            />
                        </div>
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-extrabold text-slate-900">
                                    {profile.username}
                                </h1>
                                <p className="text-lg text-slate-600 mt-1">
                                    {profile.email}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-100 p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-sm" />
                                        Country
                                    </h3>
                                    <p className="text-xl text-slate-700">
                                        {profile.country === "nda"
                                            ? "No Data Available"
                                            : profile.country}
                                    </p>
                                </div>
                                <div className="bg-slate-100 p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                        <FaPhone className="mr-2 text-sm" />
                                        Contact
                                    </h3>
                                    <p className="text-xl text-slate-700">
                                        {profile.contact === 0
                                            ? "Contact not available"
                                            : profile.contact}
                                    </p>
                                </div>
                                <div className="col-span-full bg-slate-100 p-6 rounded-lg shadow-sm w-full">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Bio
                                    </h3>
                                    <p className="text-xl text-slate-700">
                                        {profile.bio?.length > 0
                                            ? profile.bio
                                            : "No bio available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {!localProfile && <Loading />}
        </>
    );
}
