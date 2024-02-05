import React from 'react'
import QueueStatusBadge from './QueueStatusBadge'

const Queue = ({ onClick, ...queue }) => {
    console.log("Queue: ", queue)
    return (
        <div className="block rounded-lg p-2 shadow-lg border border-gray-100 hover:border-gray-200 hover:ring-1 hover:ring-gray-200 w-64 overflow-hidden" onClick={onClick}>
            <img
                alt="QR Code"
                src={`data:image/png;base64,${queue.qrCode}`}  // Set the src attribute to the qrCode data
                className="h-full w-full rounded-md object-cover mb-2"
            />

            <div className="flex flex-col h-full">
                <dl className="flex-1">
                    <div className='flex gap-1 justify-between'>
                        <dt className="sr-only">Name</dt>
                        <dd className="font-medium truncate">{queue.queueName}</dd>
                        <QueueStatusBadge isOpen={queue.isOpen} />
                    </div>
                    <div>
                        <dt className="sr-only">Description</dt>
                        <dd className="text-sm text-gray-500 truncate">{queue.description}</dd>
                    </div>
                </dl>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">

                        <svg
                            className="text-indigo-700"
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="#eab308"
                                d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                            />
                        </svg>

                        <div className="mt-1.5 sm:mt-0">
                            <p className="text-gray-500">Pending</p>

                            <p className="font-medium">{queue.statusCounts.pending} tickets</p>
                        </div>
                    </div>

                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="#16a34a"
                                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
                            />
                        </svg>

                        <div className="mt-1.5 sm:mt-0">
                            <p className="text-gray-500">Served</p>

                            <p className="font-medium">{queue.statusCounts.served} tickets</p>
                        </div>
                    </div>

                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="#c82626"
                                d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
                            />
                        </svg>

                        <div className="mt-1.5 sm:mt-0">
                            <p className="text-gray-500">Canceled</p>

                            <p className="font-medium">{queue.statusCounts.cancelled} tickets</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Queue