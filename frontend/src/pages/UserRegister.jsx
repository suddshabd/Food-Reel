import React, { useState, } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

const UserRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '' // Added phone field
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, password, phone } = formData;

        try {
            // API call using the provided structure
            const res = await axios.post('http://localhost:3000/api/auth/user/register', {
                fullName,
                email,
                password,
                phone // Included phone
            }, { withCredentials: true });

            console.log('RegisterUser submit data:', res.data);

            navigate('/home')
            // Optionally reset form or redirect the user
            // setFormData({ fullName: '', email: '', password: '', phone: '' });

        } catch (error) {
            console.error('Registration Error:', error.response ? error.response.data : error.message);
            alert(`Registration Failed: ${error.response ? error.response.data.message : 'Network Error'}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 transform transition duration-500 hover:shadow-3xl">
                <h2 className="text-3xl font-bold text-center text-green-600 dark:text-green-400 mb-6">
                    🍽️ User Register
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-300 ease-in-out transform hover:scale-[1.01] bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-300 ease-in-out transform hover:scale-[1.01] bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="you@example.com"
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
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-300 ease-in-out transform hover:scale-[1.01] bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="e.g., 9876543210"
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
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-300 ease-in-out transform hover:scale-[1.01] bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            placeholder="Minimum 6 characters"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 active:shadow-inner"
                    >
                        Register Account
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account? <Link to="/user/login" className="font-medium text-green-600 hover:text-green-500">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;