


import React, { useState, useEffect } from 'react';
import axios from 'axios'; // <-- Uncommented axios for API call
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [foodItem, setFoodItem] = useState({
        // State variables are now only name, description, and videoFile
        name: '',
        description: '',
        videoFile: null,
    });

    // State to hold the temporary URL for video preview
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    // Effect to handle creating and cleaning up the video preview URL
    useEffect(() => {
        // If a file exists, create a temporary URL for the <video> element
        if (foodItem.videoFile) {
            const url = URL.createObjectURL(foodItem.videoFile);
            setVideoPreviewUrl(url);

            // Cleanup function to revoke the object URL when the component unmounts or file changes
            return () => URL.revokeObjectURL(url);
        } else {
            setVideoPreviewUrl(null);
        }
    }, [foodItem.videoFile]); // Re-run whenever the videoFile state changes

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            // Handles local file selection and stores it under the requested 'videoFile' key
            setFoodItem((prev) => ({
                ...prev,
                videoFile: files[0],
            }));
        } else {
            // Handles name and description text inputs
            setFoodItem((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!foodItem.videoFile) {
            setStatus('Please select a video file.');
            return;
        }

        setStatus('Submitting...');

        try {
            // --- API INTEGRATION START ---
            const formData = new FormData();
            formData.append('name', foodItem.name);
            formData.append('description', foodItem.description);
            formData.append('video', foodItem.videoFile); // Assumes backend expects 'video' field

            // This makes the actual API call using FormData for file upload
            await axios.post('http://localhost:3000/api/food', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data', // Crucial for file upload
                },
            });
            // --- API INTEGRATION END ---

            console.log('Food item created successfully!');
            navigate('/'); // Redirect to food partner dashboard after creation
            setStatus('Food item created successfully!');

            // Reset state after successful submission
            setFoodItem({
                name: '',
                description: '',
                videoFile: null,
            });

        } catch (error) {
            console.error('Error uploading food item:', error);
            // Display a more helpful error message if available
            setStatus(`Error saving food item: ${error.response?.data?.message || 'Check console.'}`);
        } finally {
            // Clear status message after 3 seconds
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const inputClass = "w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 transition-all duration-300 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-500 focus:border-pink-500";
    const labelClass = "text-sm font-medium text-gray-300 mb-1 block";

    return (
        // Outer dark blue background
        <div className="min-h-screen bg-slate-900 font-inter p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            {/* Form Container */}
            <div className="max-w-lg w-full bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8">
                <h1 className="text-3xl font-extrabold text-white mb-6 text-center">
                    Create New Food Item
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Status Message */}
                    {status && (
                        <p className={`text-center font-semibold p-2 rounded 
              ${status.includes('successfully') ? 'bg-green-600 text-white' :
                                status.includes('Submitting') ? 'bg-yellow-600 text-white' :
                                    'bg-red-600 text-white'}`}>
                            {status}
                        </p>
                    )}

                    {/* Food Name Input */}
                    <div>
                        <label htmlFor="name" className={labelClass}>Food Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={foodItem.name}
                            onChange={handleChange}
                            placeholder="e.g., Spicy Chicken Tacos"
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label htmlFor="description" className={labelClass}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={foodItem.description}
                            onChange={handleChange}
                            placeholder="Describe the ingredients, taste, and preparation..."
                            rows="4"
                            className={inputClass}
                            required
                        ></textarea>
                    </div>

                    {/* Video Upload Section (Simplified) */}
                    <div className="pt-2 border-t border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-3">Video Content</h2>

                        {/* Local File Upload Input */}
                        <div>
                            <label htmlFor="videoFile" className={labelClass}>Upload Food Video (Max 50MB)</label>
                            <input
                                id="videoFile"
                                type="file"
                                name="videoFile" // Use videoFile as the input name
                                accept="video/*"
                                onChange={handleChange}
                                // Styling for the file input button to make it look "fancy"
                                className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 transition-colors cursor-pointer`}
                                required
                            />
                            {foodItem.videoFile && (
                                <p className="mt-2 text-sm text-gray-400">Selected: **{foodItem.videoFile.name}**</p>
                            )}
                        </div>

                        {/* --- Video Preview --- */}
                        {videoPreviewUrl && (
                            <div className="mt-4 p-2 bg-slate-700 rounded-lg">
                                <h3 className="text-gray-300 text-sm mb-1">Preview:</h3>
                                <video
                                    src={videoPreviewUrl}
                                    controls
                                    className="w-full h-auto rounded-md shadow-lg"
                                    // Tailwind classes to ensure it fits and looks good
                                    style={{ maxHeight: '300px' }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        {/* --------------------- */}

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status.includes('Submitting')}
                        className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-pink-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-lg"
                    >
                        {status.includes('Submitting') ? 'Creating Food Item...' : 'Create Food Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;