import React, { useState } from 'react';
import axios from 'axios';

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            // Make a request to your server to log out the user using axios
            const response = await axios.delete('/logout', {
                // You may need to include the user's token here, depending on your authentication setup
                // headers: { Authorization: `Bearer ${userToken}` },
            });

            if (response.status === 204) {
                // Logout successful
                // Optionally, you may want to redirect the user to the login page or update your local state
                console.log('Logout successful');
            } else {
                // Handle logout error
                console.error('Logout failed');
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };
    return (


        <header className="bg-gray-50">
            <div className=" px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <label className="sr-only" htmlFor="search"> Search </label>

                            <input
                                className="h-10 w-full rounded-full border-none bg-white pe-10 ps-4 text-sm shadow-sm sm:w-56"
                                id="search"
                                type="search"
                                placeholder="Search website..."
                            />

                            <button
                                type="button"
                                className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-gray-50 p-2 text-gray-600 transition hover:text-gray-700"
                            >
                                <span className="sr-only">Search</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <a
                            href="#"
                            className="block shrink-0 rounded-full bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700"
                        >
                            <span className="sr-only">Notifications</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </a>
                    </div>

                    <span aria-hidden="true" className="block h-6 w-px rounded-full bg-gray-200"></span>

                    <div className="relative">
                        <button href="#" className="block shrink-0" onClick={toggleDropdown}>
                            <span className="sr-only">Profile</span>
                            <img
                                alt="Man"
                                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div
                                className="absolute end-0 z-10 mt-4 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
                                role="menu"
                            >
                                <div className="p-2">
                                    <button
                                        href="#"
                                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        View on Storefront
                                    </button>

                                    <button
                                        href="#"
                                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                    >
                                        View Warehouse Info
                                    </button>

                                    <form method="POST" action="#" onSubmit={handleLogout}>
                                        <button
                                            type="submit"
                                            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                            role="menuitem"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>

                                            Logout
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header