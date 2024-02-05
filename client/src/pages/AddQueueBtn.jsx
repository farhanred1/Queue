import React, { useState } from 'react'
import axios from 'axios';

const AddQueueBtn = () => {
    const [isHovered, setHovered] = useState(false);
    const handleHover = () => {
        setHovered(!isHovered);
    };


    const [isModalOpen, setModalOpen] = useState(false);
    const [queueName, setQueueName] = useState('');
    const [description, setDescription] = useState('');

    const handleButtonClick = () => {
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        // You can reset the form fields if needed
        setQueueName('');
        setDescription('');
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const userToken = localStorage.getItem('accessToken');
            const response = await axios.post(
                'http://localhost:8080/queue-create',
                {
                    queueName,
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            console.log('Queue created successfully:', response.data);
            handleModalClose();
        } catch (error) {
            console.error('Error creating queue:', error.response?.data?.error || error.message);
        }
    };

    return (
        <>
            <button
                className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:relative"
                title="Create Queue"
                onClick={handleButtonClick}
                onMouseEnter={handleHover}
                onMouseLeave={handleHover}
            >
                <span className="inline-block border-e px-4 py-2 text-sm font-medium">
                    Create Queue
                </span>

                <span className="inline-flex items-center px-4 py-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 448 448"
                    >
                        <path
                            fill={`${isHovered ? '#374151' : '#6b7280'}`}
                            d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                        />
                    </svg>
                </span>
            </button>



            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-lg">
                            <span
                                className="modal-close cursor-pointer p-2 flex flex-row-reverse"
                                onClick={handleModalClose}
                            >
                                {/* Replace the close span with an SVG icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </span>
                            <div className="bg-white px-4 sm:pt-2 pb-4">

                                <form className='flex flex-col gap-2' onSubmit={handleFormSubmit}>

                                    <label
                                        htmlFor="queueName"
                                        className="block overflow-hidden rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                                    >
                                        <span className="text-sm font-medium text-gray-700"> Name </span>

                                        <input
                                            type="text"
                                            id="queueName"
                                            placeholder="Queue Name"
                                            value={queueName}
                                            onChange={(e) => setQueueName(e.target.value)}
                                            className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                            required
                                        />
                                    </label>

                                    <label
                                        htmlFor="description"
                                        className="block overflow-hidden rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                                    >
                                        <span className="text-sm font-medium text-gray-700"> Description </span>

                                        <textarea
                                            id="description"
                                            value={description}
                                            placeholder="Queue Description"
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                            required
                                        ></textarea>
                                    </label>

                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        Create Queue
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </>

    )
}

export default AddQueueBtn