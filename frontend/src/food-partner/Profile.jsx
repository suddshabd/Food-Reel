



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    // 1. Fetching logic from URL parameters
    const { id } = useParams();
    const [profile, setProfile] = useState(null); // Full fetched profile object
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');

    // 2. State for Editable Fields (initialized to empty or static fallback)
    const [name, setName] = useState('Loading Name...');
    const [address, setAddress] = useState('Loading Address...');
    // Keeping these static for now, assuming they are derived/read-only stats
    const [totalMeals, setTotalMeals] = useState(51);
    const [customersServed, setCustomersServed] = useState("14K");

    // Create a static array of 15 video objects for the 5x3 grid
    const [videos, setVideos] = useState([])
    // Presentational component for stats
    const StatItem = ({ value, label }) => (
        <div className="flex flex-col items-center p-3 sm:p-4 w-1/2">
            <div className="font-bold text-xl sm:text-2xl text-gray-100">{value}</div>
            <div className="text-sm font-medium text-gray-300">{label}</div>
        </div>
    );

    // Styling for video grid items
    const videoClass = "aspect-square bg-slate-700 flex items-center justify-center text-gray-300 hover:opacity-80 transition duration-150 cursor-pointer overflow-hidden relative group";

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Adjust the endpoint path to match your API structure if necessary
                const response = await axios.get(`http://localhost:3000/api/foodpartner/${id}`, { withCredentials: true });
                const partner = response.data.foodPartner; // Assuming the profile data is nested under 'foodPartner'

                setProfile(partner);

                // Initialize editable state from fetched data
                setName(partner.name || 'Food Partner Name');
                setAddress(partner.address || 'Partner Address');
                setVideos(partner.foodItems || []);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setLoading(false);
                setName('Error Loading');
                setAddress('Error Loading');
            }
        };

        fetchProfile();
    }, [id]);

    // --- Update Function (PATCH Request) ---
    const handleUpdate = async () => {
        setUpdateStatus('Saving...');
        try {
            const updatePayload = {
                name: name,
                address: address,
                // Include other editable fields here if necessary
            };

            // Use PATCH for updating specific fields
            const response = await axios.patch(
                `http://localhost:3000/api/foodpartner/${id}`,
                updatePayload,
                { withCredentials: true }
            );

            // Update local state and exit edit mode
            setProfile(response.data.foodPartner);
            setIsEditing(false);
            setUpdateStatus('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile data:', error);
            setUpdateStatus('Error saving profile.');
        } finally {
            // Clear status message after 3 seconds
            setTimeout(() => setUpdateStatus(''), 3000);
        }
    };


    if (loading) {
        return <div className="min-h-screen bg-slate-900 font-inter p-4 sm:p-6 lg:p-8 text-white flex items-center justify-center">Loading Profile...</div>;
    }

    return (
        // Outer dark blue background
        <div className="min-h-screen bg-slate-900 font-inter p-4 sm:p-6 lg:p-8">
            {/* Container simulating the phone screen width */}
            <div className="max-w-xl mx-auto border border-gray-700 rounded-xl shadow-2xl overflow-hidden">

                {/* Profile Header and Details (Inner Card Section) */}
                <div className="bg-slate-800 p-6 sm:p-8">
                    {/* Edit/Status Bar */}
                    {/* <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${isEditing ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                        <p className={`text-sm font-medium ${updateStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                            {updateStatus}
                        </p>
                    </div> */}


                    <div className="flex items-center space-x-6 mb-6">
                        {/* Profile image with random PNG placeholder */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-pink-400 overflow-hidden shadow-md flex-shrink-0">
                            <img
                                src="https://images.pexels.com/photos/708488/pexels-photo-708488.jpeg"
                                alt="Profile Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Name and Address (Dynamic or Editable) */}
                        <div className="flex flex-col w-full min-w-0">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        className="text-2xl sm:text-3xl font-extrabold text-white bg-slate-700 p-1 rounded mb-1 focus:ring-pink-500 focus:border-pink-500 border-none"
                                    />
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Address"
                                        className="text-gray-400 text-sm bg-slate-700 p-1 rounded focus:ring-pink-500 focus:border-pink-500 border-none"
                                    />
                                    <button
                                        onClick={handleUpdate}
                                        disabled={updateStatus.includes('Saving')}
                                        className="mt-3 bg-green-500 text-white font-bold py-1 rounded hover:bg-green-600 disabled:bg-gray-500"
                                    >
                                        {updateStatus.includes('Saving') ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate">
                                        {name}
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-1 truncate">
                                        {address}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Card (Total Meals and Customer Served - Dynamic/State) */}
                    <div className="flex bg-slate-700 rounded-lg p-1 mt-4 shadow-inner">
                        <StatItem value={totalMeals} label="Total Meals" />
                        <StatItem value={customersServed} label="Customers Served" />
                    </div>
                </div>

                {/* Separator Line */}
                <div className="mx-auto w-full">
                    <hr className="border-t-2 border-slate-700" />
                </div>

                {/* Videos Grid Section (5 rows of 3, created using map) */}
                <div className="bg-slate-800">
                    <div className="grid grid-cols-3 gap-0.5">
                        {videos.map((video) => (
                            <div key={video.id} className={videoClass}>
                                <video src={video.video}
                                    muted></video>
                                <svg className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M6 3v18l15-9L6 3z" /></svg>
                                <span className="absolute bottom-1 left-1 text-xs text-white bg-black/40 px-1 rounded">{video.number}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;