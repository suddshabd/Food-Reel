import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-2 text-white">Zomato Reels</h1>
                <p className="text-lg text-gray-400">Discover and share the best food stories.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/user/register" className="w-64 py-3 px-6 bg-green-600 text-white font-bold rounded-xl shadow-lg text-center text-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105">
                    Sign up as User
                </Link>
                <Link to="/foodpartner/register" className="w-64 py-3 px-6 bg-red-600 text-white font-bold rounded-xl shadow-lg text-center text-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105">
                    Sign up as Food Partner
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;