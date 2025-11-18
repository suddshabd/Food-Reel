
// export default Home;

import SavedVideos from './Saved.jsx';
import axios from 'axios';
import React, { useEffect, useRef, useState, } from 'react';
// We are using local state for navigation instead of react-router-dom

// =====================================================================
// HELPER COMPONENTS
// =====================================================================

// Helper component to display stars based on the rating
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="text-yellow-400 text-lg">★</span>
            ))}
            {hasHalfStar && <span className="text-yellow-400 text-lg">½</span>}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-400 text-lg">★</span>
            ))}
            <span className="ml-1 text-sm font-semibold">({rating})</span>
        </div>
    );
};

// Component for the vertical interaction buttons (Used in HomeFeed)
const InteractionButton = ({ icon, count, onClick, active = false }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-3 text-white transition-transform duration-200 active:scale-90"
    >
        <svg className={`w-8 h-8 ${active ? 'text-red-500' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d={icon} />
        </svg>
        <span className="text-xs font-semibold mt-1">{count}</span>
    </button>
);

// Component for the bottom navigation bar (Used in App)
const BottomNavBar = ({ currentPage, onNavigate }) => {
    // Only Home and Saved tabs are present
    const navItems = [
        { id: 'home', icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", label: "Home" },
        { id: 'saved', icon: "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z", label: "Saved" },
    ];

    return (
        <div className="w-full z-50 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700/50 shadow-2xl">
            <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center justify-center p-2 text-sm font-medium transition-colors duration-200 
                            ${currentPage === item.id ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d={item.icon} />
                        </svg>
                        <span className="mt-0.5">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Icon constants to improve readability and maintainability
const ICONS = {
    HEART_FILLED: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.15C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    HEART_OUTLINE: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.15C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM16.5 5c-1.54 0-3.04.99-3.57 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z",
    COMMENT: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
    SAVE_FILLED: "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z",
    SAVE_OUTLINE: "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18-5 2.18V5h10v13z"
};


// =====================================================================
// PAGE COMPONENTS
// =====================================================================

// 1. HOME FEED
const HomeFeed = ({ onNavigateToProfile }) => {
    const [videos, setVideos] = useState([]);
    const videoref = useRef(new Map())
    const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
    const containerRef = useRef(null);

    // Function to format numbers (e.g., 1200 -> 1.2K)
    const formatCount = (num) => {
        return Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(num);
    };

    // --- LOGIC FOR SHOW MORE/LESS DESCRIPTION ---
    const toggleDescription = (id) => {
        setExpandedDescriptions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // --- LOGIC FOR LIKE/UNLIKE ---
    const handleLike = async (foodId) => {
        const response = await axios.post(`http://localhost:3000/api/food/like`, { foodId: foodId }, { withCredentials: true });
        if (response.data.like) {
            console.log('Liked video:', foodId);
            setVideos(videos.map(v => v._id === foodId ? { ...v, isLiked: true, likeCount: v.likeCount + 1 } : v));
        }
        else {
            console.log('Unliked video:', foodId);
            setVideos(videos.map(v => v._id === foodId ? { ...v, isLiked: false, likeCount: v.likeCount - 1 } : v));
        }
    }


    // --- LOGIC FOR SAVE/UNSAVE ---
    const handleSave = async (foodId) => {
        const response = await axios.post(`http://localhost:3000/api/food/save`, { foodId: foodId }, { withCredentials: true });
        if (response.data.save) {
            console.log('Saved video:', foodId);
            setVideos(videos.map(v => v._id === foodId ? { ...v, isSaved: true, saveCount: v.saveCount + 1 } : v));
        } else {
            console.log('Unsaved video:', foodId);
            setVideos(videos.map(v => v._id === foodId ? { ...v, isSaved: false, saveCount: v.saveCount - 1 } : v));
        }
    };

    const handleComment = (id) => console.log(`Opened comments for video ${id}`);

    const setVideoRef = (id) => (el) => {
        if (el) {
            videoref.current.set(id, el);
        } else {
            videoref.current.delete(id);
        }
    }

    // Fetch video data using Axios (reverting to API call)
    useEffect(() => {
        axios.get('http://localhost:3000/api/food', { withCredentials: true }).then((response) => {
            const fetchedVideos = response.data.foodItems.map(item => ({
                ...item,
                // Mock interaction counts and state

                comments: Math.floor(Math.random() * 50) + 10,

            }));
            setVideos(fetchedVideos);
        }).catch((error) => {
            console.error('Error fetching video data:', error);
            // Fallback: Set videos to empty array if API fails
            setVideos([]);
        });
    }, [])

    if (videos.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-black text-white">
                <p className="text-xl">Loading delicious food reels or no videos available...</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-y-scroll snap-y snap-mandatory bg-black"
        >
            {videos.map((item) => (
                <div
                    key={item._id}
                    className="h-full w-full relative flex flex-col justify-end snap-start"
                >
                    {/* Video Element */}
                    <video
                        ref={setVideoRef(item._id)}
                        src={item.video}
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                        autoPlay
                        loop
                        preload='metadata'
                        muted
                        playsInline
                    >
                        Your browser does not support the video tag.
                    </video>

                    {/* Content Overlay & Interaction Bar Container */}
                    <div className="relative z-10 flex justify-between items-end p-4 pb-8">

                        {/* LEFT SIDE: Description and Partner Info - Max width reduced to 60% for spacing */}
                        <div className="flex flex-col text-white max-w-[60%]  to-transparent">
                            {/* Restaurant Name and Rating Section */}
                            <div className="mb-2">
                                <h3 className="text-3xl font-extrabold mb-1">
                                    {item.name}
                                </h3>
                                <StarRating rating={item.rating || 4.5} />
                            </div>

                            {/* Description Area with Show More */}
                            <div className="mb-4">
                                <p
                                    className={`text-lg leading-snug overflow-hidden ${!expandedDescriptions.has(item._id) ? 'line-clamp-2' : ''}`}
                                >
                                    {item.description}
                                </p>
                                {/* Show toggle button only if description is long enough to be clamped */}
                                {item.description.length > 80 && ( // A reasonable character limit to warrant a "show more"
                                    <button
                                        onClick={() => toggleDescription(item._id)}
                                        className="text-sm font-semibold text-gray-300 hover:text-white mt-1"
                                    >
                                        {expandedDescriptions.has(item._id) ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </div>

                            {/* Visit Store Button: Now uses the onNavigate prop */}
                            <button
                                onClick={() => onNavigateToProfile(item.foodPartner)}
                                className="inline-block w-full sm:w-auto py-2 px-4 bg-red-600 text-white font-bold rounded-xl shadow-lg text-center text-sm
                                         hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 
                                         transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Visit Store
                            </button>
                        </div>

                        {/* RIGHT SIDE: Interaction Bar (Like, Comment, Save) */}
                        <div className="flex flex-col space-y-4">

                            {/* Like Button (Heart) */}
                            <InteractionButton
                                icon={item.isLiked ? ICONS.HEART_FILLED : ICONS.HEART_OUTLINE}
                                count={formatCount(item.likeCount)}
                                onClick={() => handleLike(item._id)}
                                active={item.isLiked}
                            />

                            {/* Comment Button (Bubble) */}
                            <InteractionButton
                                icon={ICONS.COMMENT}
                                count={formatCount(item.comments)} // Display formatted count
                                onClick={() => handleComment(item)}
                            />

                            {/* Save Button (Bookmark) */}
                            <InteractionButton
                                icon={item.isSaved ? ICONS.SAVE_FILLED : ICONS.SAVE_OUTLINE}
                                count={formatCount(item.saveCount)}
                                onClick={() => handleSave(item._id)}
                                active={item.isSaved} // Green color for saved state
                            />
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-4 right-4 text-white opacity-50 text-sm">
                        Scroll Down
                    </div>
                </div>
            ))}
        </div>
    );
};


// 3. USER PROFILE 
const UserProfile = ({ foodPartnerId, onNavigateBack }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');

    const [name, setName] = useState('Loading Name...');
    const [address, setAddress] = useState('Loading Address...');
    const [totalMeals, setTotalMeals] = useState(51);
    const [customersServed, setCustomersServed] = useState("14K");

    // Create a static array of 15 video objects for the 5x3 grid
    const videos = Array(15).fill(null).map((_, i) => ({
        id: i,
        number: i + 1,
    }));

    // Presentational component for stats
    const StatItem = ({ value, label }) => (
        <div className="flex flex-col items-center p-3 sm:p-4 w-1/2">
            <div className="font-bold text-xl sm:text-2xl text-gray-100">{value}</div>
            <div className="text-sm font-medium text-gray-300">{label}</div>
        </div>
    );

    // Styling for video grid items
    const videoClass = "aspect-square bg-slate-700 flex items-center justify-center text-gray-300 hover:opacity-80 transition duration-150 cursor-pointer overflow-hidden relative group";

    // --- Data Fetching Effect (reverting to API call) ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!foodPartnerId) return; // Guard clause
            try {
                // Using the foodPartnerId passed as a prop/state
                const response = await axios.get(`http://localhost:3000/api/foodpartner/${foodPartnerId}`, { withCredentials: true });
                const partner = response.data.foodPartner;

                setProfile(partner);
                setName(partner.name || 'Food Partner Name');
                setAddress(partner.address || 'Partner Address');
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setLoading(false);
                setName('Error Loading');
                setAddress('Error Loading');
            }
        };

        fetchProfile();
    }, [foodPartnerId]);

    // --- Update Function (PATCH Request) (reverting to API call) ---
    const handleUpdate = async () => {
        setUpdateStatus('Saving...');
        try {
            const updatePayload = {
                name: name,
                address: address,
            };

            await axios.patch(
                `http://localhost:3000/api/foodpartner/${foodPartnerId}`,
                updatePayload,
                { withCredentials: true }
            );

            setIsEditing(false);
            setUpdateStatus('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile data:', error);
            setUpdateStatus('Error saving profile.');
        } finally {
            setTimeout(() => setUpdateStatus(''), 3000);
        }
    };


    if (loading) {
        return <div className="min-h-screen bg-slate-900 font-inter p-4 sm:p-6 lg:p-8 text-white flex items-center justify-center pb-16">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 font-inter p-4 sm:p-6 lg:p-8 pb-16">
            <div className="max-w-xl mx-auto border border-gray-700 rounded-xl shadow-2xl overflow-hidden">

                {/* Back Button */}
                <button
                    onClick={onNavigateBack}
                    // Adjusted position to stick to the top edge better now that the black bar is gone
                    className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition duration-150 z-20"
                    aria-label="Back to Home Feed"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                </button>

                {/* Profile Header and Image */}
                <div className="relative bg-slate-800 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-pink-500 flex items-center justify-center text-4xl font-bold text-white border-4 border-slate-700 shadow-xl">
                                {name[0] || 'FP'}
                            </div>
                        </div>

                        {/* Name and Address */}
                        <div className="flex-grow text-center sm:text-left pt-2">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="text-2xl sm:text-3xl font-extrabold text-white bg-slate-700 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="text-md text-gray-300 bg-slate-700 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{name}</h2>
                                    <p className="text-md text-gray-300 mt-1">{address}</p>
                                </>
                            )}

                            {/* Edit/Save Button */}
                            <div className="mt-4">
                                {isEditing ? (
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
                                    >
                                        Save Changes
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-pink-700 transition duration-150"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                                {updateStatus && (
                                    <p className={`mt-2 text-sm font-medium ${updateStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                        {updateStatus}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex justify-around border-t border-b border-gray-700 divide-x divide-gray-700 bg-slate-800">
                    <StatItem value={totalMeals} label="Total Meals" />
                    <StatItem value={customersServed} label="Customers Served" />
                </div>

                {/* Video Grid */}
                <div className="p-4 bg-slate-900">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
                        Food Reels ({videos.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {videos.map((video) => (
                            <div key={video.id} className={videoClass}>
                                {/* Placeholder Content */}
                                <img
                                    src={`https://placehold.co/150x150/334155/ffffff?text=Video+${video.number}`}
                                    alt={`Video thumbnail ${video.number}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/334155/ffffff?text=Video+${video.number}` }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};


// 4. MAIN APPLICATION COMPONENT
const App = () => {
    // State to manage which view is currently displayed
    const [currentPage, setCurrentPage] = useState('home');
    // State to hold the ID of the Food Partner when navigating to the profile
    const [foodPartnerId, setFoodPartnerId] = useState(null);

    // Function to handle navigation
    const handleNavigate = (page) => {
        setCurrentPage(page);
        // Reset profile ID when navigating away from profile view
        if (page !== 'profile') {
            setFoodPartnerId(null);
        }
    };

    // Function to navigate directly to a partner's profile
    const handleNavigateToProfile = (partnerId) => {
        setFoodPartnerId(partnerId);
        setCurrentPage('profile');
    };

    // Render the current page based on state
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomeFeed onNavigateToProfile={handleNavigateToProfile} />;
            case 'saved':
                return <SavedVideos />;
            case 'profile':
                return <UserProfile foodPartnerId={foodPartnerId} onNavigateBack={() => handleNavigate('home')} />;
            default:
                return <HomeFeed onNavigateToProfile={handleNavigateToProfile} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-black font-inter flex flex-col">
            {/* Main Content Area */}
            <div className="flex-grow overflow-hidden">
                {renderPage()}
            </div>

            {/* Bottom Navigation */}
            <BottomNavBar currentPage={currentPage} onNavigate={handleNavigate} />
        </div>
    );
};

export default App;