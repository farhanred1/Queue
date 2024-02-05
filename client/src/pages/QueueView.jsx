import axios from 'axios';
import React, { useState, useEffect } from 'react'
import TicketRow from './TicketRow'

const QueueView = ({ queue }) => {
    console.log("queueView: ", queue)
    const [selectedOption, setSelectedOption] = useState('View');
    const [nextTicket, setNextTicket] = useState("-- ---");
    const [isEditSelected, setIsEditSelected] = useState(false);

    const [editedName, setEditedName] = useState(queue.queueName);
    const [editedDescription, setEditedDescription] = useState(queue.description);
    const [editedStatus, setEditedStatus] = useState(queue.isOpen);

    useEffect(() => {
        const fetchLastCalledTicket = async () => {
            try {
                const userToken = localStorage.getItem('accessToken');
                const response = await axios.post(
                    'http://localhost:8080/get-last-called-ticket',
                    { queueId: queue._id },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                if (response.data && response.data.ticketNumber) {
                    setNextTicket(response.data.ticketNumber);
                }
            } catch (error) {
                setNextTicket("-----")
                console.error('Error fetching last called ticket:', error);
            }
        };

        fetchLastCalledTicket();
    }, [queue]);

    const handleCallNext = async () => {
        try {
            const userToken = localStorage.getItem('accessToken');
            const response = await axios.post(
                'http://localhost:8080/call-next-ticket',
                { queueId: queue._id },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setNextTicket(response.data.ticketNumber);
        } catch (error) {
            console.error('Error calling next ticket:', error);
        }
    };

    const handleSave = async () => {
        // Implement your logic to save the edited data
        console.log("Save clicked! Implement your logic here.");
    };

    const InformationItem = ({ title, content, colSpan = 3 }) => (
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-4 sm:gap-4">
            <dt className="font-medium text-gray-900">{title}</dt>
            <dd className={`text-gray-700 break-all sm:col-span-${colSpan}`}>
                {isEditSelected ? (
                    // Render input fields for editing
                    (title === "Name" || title === "Description") ? (
                        <input
                        className={`w-full rounded-md sm:text-sm focus:ring-inset-0 ${title === "Description" ? "resize-y" : ""}`}
                        type={title === "Description" ? "textarea" : "text"}
                        value={title === "Name" ? editedName : editedDescription}
                        onChange={(e) => {
                            if (title === "Name") setEditedName(e.target.value);
                            else if (title === "Description") setEditedDescription(e.target.value);
                        }}
                    />
                    ) : (
                        // Render plain text for other fields
                        content
                    )
                ) : (
                    // Render plain text when not editing
                    content
                )}
            </dd>
        </div>
    );
    const RadioButton = ({ id, value, label, color, onChange }) => (
        <div>
            <input
                type="radio"
                name="OperationOptions"
                value={value}
                id={id}
                className="peer hidden"
                onChange={onChange}
                checked={selectedOption === value}
            />
            <label
                htmlFor={id}
                className={`inline-block rounded-md px-4 py-2 text-sm focus:relative peer-checked:shadow-sm peer-checked:bg-white ${selectedOption === value ? (color === 'green' ? 'text-green-500 hover:text-green-700' : (color === 'blue' ? 'text-blue-500 hover:text-blue-700' : 'text-red-500 hover:text-red-700')) : 'text-gray-500 hover:text-gray-700'}`}
            >
                <p className={`text-sm font-medium ${selectedOption === value && `text-${color}-500`}`}>{label}</p>
            </label>
        </div>
    );


    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setIsEditSelected(event.target.value === 'Edit');
    };
    const OperationOptionsGroup = ({ selectedOption, onChange }) => (
        <fieldset className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
            <legend className="sr-only">Operation</legend>

            <RadioButton id="view" value="View" label="View" color="green" onChange={onChange} />
            <RadioButton id="edit" value="Edit" label="Edit" color="blue" onChange={onChange} />
            <RadioButton id="delete" value="Delete" label="Delete" color="red" onChange={onChange} />
        </fieldset>
    );
    const StatusToogleSwitch = ({ status }) => {
        const [isChecked, setIsChecked] = useState(!status)

        const handleCheckboxChange = () => {
            setIsChecked(!isChecked)
        }

        return (
            <>
                <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
                    <input
                        type='checkbox'
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className='sr-only'
                        disabled={!isEditSelected}

                    />
                    <span className='label flex items-center text-sm font-medium text-black'>
                        Open
                    </span>
                    <span
                        className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-red-600' : 'bg-green-600'
                            }`}
                    >
                        <span
                            className={`dot h-6 w-6 rounded-full bg-white duration-200 ${isChecked ? 'translate-x-[28px]' : ''
                                }`}
                        ></span>
                    </span>
                    <span className='label flex items-center text-sm font-medium text-black'>
                        Close
                    </span>
                </label>
            </>
        )
    }




    return (
        <div className="flow-root rounded-lg border border-gray-100 pb-3 shadow-sm bg-white">
            <div className='w-full flex items-center justify-center'>
                <OperationOptionsGroup
                    selectedOption={selectedOption}
                    onChange={handleOptionChange}
                />
            </div>

            <dl className="divide-y divide-gray-100 text-sm">

                <InformationItem title="Name" content={queue.queueName} />

                <InformationItem title="Description" content={queue.description} />

                <InformationItem title="Status" content={<StatusToogleSwitch status={queue.isOpen} />} />

                <InformationItem
                    title="QR Code"
                    content={
                        <img
                            alt="QR Code"
                            src={`data:image/png;base64,${queue.qrCode}`}  // Set the src attribute to the qrCode data
                            className="h-24 w-24 rounded-md object-cover"
                        />
                    }
                />

                <InformationItem title="URL" content={<a href={queue.url} target="_blank" rel="noopener noreferrer">{queue.url}</a>} />



                <InformationItem
                    title="Now Calling"
                    content={
                        <div className="grid grid-cols-1 gap-4 h-auto overflow-auto">
                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                                href="/accountant"
                            >
                                <h2 className="font-bold"></h2>
                                <span className="w-full inline-flex justify-center rounded-lg bg-gray-50 p-3 ">
                                    {nextTicket && (
                                        <h1 className='font-bold text-2xl'>
                                            {`${nextTicket.substring(0, 2)} ${nextTicket.substring(2)}`}
                                        </h1>
                                    )}
                                </span>

                                <button
                                    className="w-full mt-2 inline-flex items-center justify-between gap-1 rounded border border-indigo-600 p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                                    onClick={handleCallNext}
                                >
                                    <span className="text-sm font-medium"> Call Next </span>

                                    <svg
                                        className="h-5 w-5 rtl:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    }
                />

                <InformationItem
                    title="Tickets"
                    content={
                        <div className='flex flex-col gap-1 h-80 overflow-auto'>
                            {queue.tickets.map((ticket) => (
                                <TicketRow key={ticket._id} {...ticket} />
                            ))}
                        </div>
                    }
                />

            </dl>
            <button
                className={`w-full inline-flex justify-center rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500 ${isEditSelected ? 'visible' : 'hidden'}`}
                onClick={handleSave}
            >
                Save
            </button>
        </div>
    )
}

export default QueueView