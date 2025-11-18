import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Icon constants needed for the save button
const ICONS = {
    SAVE_FILLED: "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z",
};

const SavedVideos = () => {
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedVideos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/food/saved', { withCredentials: true });
            // The backend sends `savedFoodItems`, which contains the populated `food` object.
            const foodItems = response.data.savedFoodItems.map(item => item.food).filter(Boolean);
            setSavedItems(foodItems);
        } catch (error) {
            console.error('Error fetching saved videos:', error);
            setSavedItems([]); // Set to empty on error
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (foodId) => {
        try {
            // The save endpoint toggles the state, so we call it to unsave.
            await axios.post(`http://localhost:3000/api/food/save`, { foodId }, { withCredentials: true });
            // Remove the item from the local state for an instant UI update.
            setSavedItems(prevItems => prevItems.filter(item => item._id !== foodId));
        } catch (error) {
            console.error('Error unsaving video:', error);
        }
    };

    useEffect(() => {
        fetchSavedVideos();
    }, []);


    return (
        <div className="min-h-screen bg-slate-900 font-inter p-4 sm:p-6 lg:p-8 text-white pb-16">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-extrabold text-white mb-6 border-b border-slate-700 pb-2">
                    My Saved Reels
                </h1>

                {loading ? (
                    <p className="text-gray-400">Loading your saved reels...</p>
                ) : savedItems.length > 0 ? (
                    <div className="space-y-4">
                        {savedItems.map(item => (
                            <div key={item._id} className="bg-slate-800 rounded-xl shadow-md overflow-hidden">
                                {/* Video Player */}
                                <video
                                    src={item.video}
                                    className="w-full h-48 object-cover bg-black"
                                    controls
                                    preload="metadata"
                                    playsInline
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <div className="p-4 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-pink-400">{item.name}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{item.description.substring(0, 80)}...</p>
                                    </div>
                                    <button
                                        onClick={() => handleUnsave(item._id)}
                                        className="text-red-500 hover:text-red-400 p-2 rounded-full transition-colors flex-shrink-0 ml-4"
                                        title="Remove from saved"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={ICONS.SAVE_FILLED} /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-400 mb-6">
                            You haven't saved any reels yet.
                        </p>
                        <div className="text-center text-gray-500 pt-8">
                            Keep scrolling the feed to save more items!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedVideos;