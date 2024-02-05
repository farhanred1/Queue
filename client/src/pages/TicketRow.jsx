import React from 'react'

const TicketRow = ({...ticket}) => {
    const formattedPhoneNumber = `${ticket.phoneNumber.substring(0, 4)} ${ticket.phoneNumber.substring(4)}`;
    const formattedTicketNumber = `${ticket.ticketNumber.substring(0, 2)} ${ticket.ticketNumber.substring(2)}`;
    const formattedStatus = `${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}`;

    const statusColorMap = {
        Served: 'bg-green-100 text-green-600',
        Pending: 'bg-yellow-100 text-yellow-600',
        Cancelled: 'bg-red-100 text-red-600',
    };
    const statusColor = statusColorMap[formattedStatus] || 'bg-gray-100 text-gray-600';

    return (
        <div>
            <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-2">
                <div>
                    <p className="text-sm text-gray-500">{formattedPhoneNumber}</p>

                    <p className="text-2xl font-medium text-gray-900">{formattedTicketNumber}</p>
                </div>

                <div className={`inline-flex gap-2 w-20 rounded w-30 p-1 ${statusColor}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                           strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                    </svg>

                    <span className="text-xs font-medium whitespace-nowrap">{formattedStatus}</span>
                </div>
            </article>
        </div>
    )
}

export default TicketRow