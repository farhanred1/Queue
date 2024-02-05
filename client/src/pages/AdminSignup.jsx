import React, { useState } from 'react'
import axios from 'axios';

import useFetch from '../components/useFetch'

const AdminSignup = () => {
    
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const { isLoading, apiData, serverError } = useFetch('http://localhost:8080/admin-create', 'POST', formData, false);
    const validateForm = () => {
        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.username ||
            !formData.password ||
            !formData.password_confirmation
        ) {
            setError('All fields are required');
            return false;
        }

        if (!isValidEmail(formData.email)) {
            setError('Invalid email format');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Password and confirmation do not match');
            return false;
        }

        return true; // Form is valid
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        if (!validateForm()) {
            return;
        }

        if (apiData) {
            // Handle the response, for example, store the token
            console.log(apiData)
            setError('')
            
        }

        if (serverError) {
            // Handle the server error
            console.error('Failed to create user', serverError);
        }
    };

    const isValidEmail = (email) => {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    return (
        <section className="bg-white">
            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                <div className="max-w-xl lg:max-w-3xl">

                    <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                        Welcome
                    </h1>

                    <p className="mt-2 leading-relaxed text-gray-500">
                        Complete the form to sign up
                    </p>

                    <form 
                        action="#" 
                        className="mt-2 grid grid-cols-6 gap-6 mb-0 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                                First Name<span className="text-red-500">*</span>
                            </label>

                            <input
                                required
                                type="text"
                                id="FirstName"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md p-2 border border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
                                Last Name<span className="text-red-500">*</span>
                            </label>

                            <input
                                required
                                type="text"
                                id="LastName"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md p-2 border border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                                Email<span className="text-red-500">*</span>
                            </label>

                            <input
                                required
                                type="email"
                                id="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md p-2 border border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="Username" className="block text-sm font-medium text-gray-700">
                                Username<span className="text-red-500">*</span>
                            </label>

                            <input
                                required
                                type="text"
                                id="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md p-2 border border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                                Password<span className="text-red-500">*</span>
                            </label>

                            <input
                                required
                                type="password"
                                id="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md p-2 border border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
                                Password Confirmation<span className="text-red-500">*</span>
                            </label>

                            <input
                                required
                                type="password"
                                id="PasswordConfirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md p-2 border border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                            <button
                                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                            >
                                Create an account
                            </button>
                            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                Already have an account?
                                <a href="/login" className="text-gray-700 underline">Log in</a>.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </section>
    )
}

export default AdminSignup