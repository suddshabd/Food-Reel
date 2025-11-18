import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PartnerLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/auth/foodpartner/login', { email, password }, { withCredentials: true });
            console.log('Login successful:', res.data);
            navigate('/food');
        } catch (err) {
            console.error('Login failed', err);
            alert(err?.response?.data?.message || 'Login failed — check credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 p-4">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 border-t-4 border-red-500 transform transition duration-500 hover:shadow-3xl">
                <h2 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 mb-6">
                    👨‍💼 Partner Portal Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out transform hover:scale-[1.01] bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="manager@restaurant.com"
                        />
                    </div>
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
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-300 ease-in-out transform hover:scale-[1.01] bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Your secure password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 active:shadow-inner disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Log In to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PartnerLogin;