import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PartnerRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        contactName: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, phone, address, contactName } = formData;

        if (!name || !email || !password || !phone || !address || !contactName) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('https://food-reel-backend-nine.vercel.app/api/auth/foodpartner/register', {
                name,
                email,
                contactName,
                address,
                password,
                phone
            }, { withCredentials: true });
            console.log('Partner Registration Success:', res.data);
            navigate('/create-food');
        } catch (error) {
            console.error('Partner Registration Error:', error);
            alert(error?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 border-t-4 border-red-500 transform transition duration-500 hover:scale-[1.01] hover:shadow-3xl">
                <h2 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 mb-6">
                    🍜 Food Partner Register
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                            Restaurant Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Delicious Eats Co."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                            Partner Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="manager@restaurant.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contactName">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            id="contactName"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Primary contact person"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                placeholder="Secure password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                placeholder="e.g., 9876543210"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="address">
                            Restaurant Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Street, City, State, Zip"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-95 active:shadow-inner disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Become a Partner'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already a partner? <Link to="/foodpartner/login" className="font-medium text-red-600 hover:text-red-500">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PartnerRegister;