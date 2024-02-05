import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ticketIcon from '../assets/ticket-duotone.svg'
import magafoneImg from '../assets/calling-magafone.svg'


function UserDashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [ticketData, setTicketData] = useState({
        currentTicketNumber: null,
        ticketsAhead: null,
        expectedWaitingTime: null,
        phoneNumber: null,
        queueName: null,
        queueDescription: null,
        ticketNumber: null,
    });

    const { adminId, queueId, ticketId } = useParams();
    const avatarURL = `https://robohash.org/${ticketId}?set=set3`;

    useEffect(() => {
        const fetchTicketInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/ticket/${adminId}/queue/${queueId}/ticket/${ticketId}/info`);
                console.log(response)
                setTicketData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTicketInfo();

        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // Update every second

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [adminId, queueId, ticketId, ticketData.currentTicketNumber]); // Dependency array includes variables used in the API call


    useEffect(() => {
        // Set up WebSocket connection
        const ws = new WebSocket('ws://localhost:8080');

        // Send group information when connecting
        ws.addEventListener('open', () => {
            const groupInfo = {
                group: 'User', // Specify the group as 'User'
            };
            ws.send(JSON.stringify(groupInfo));
        });

        // Handle incoming WebSocket messages
        ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log("ws", data);

            // Check if the message is intended for the 'User' group
            if (data && data.ticketNumber) {
                setTicketData(prevTicketData => ({
                    ...prevTicketData,
                    currentTicketNumber: data.ticketNumber,
                }));
            }
        });

        // Cleanup WebSocket connection on component unmount
        return () => {
            ws.close();
        };
    }, []); // Empty dependency array, this effect runs once on mount

    const formatTime = (date) => {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };


    return (
        <>



            <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#2B3467]">
                <div className='w-[21rem] h-16 bg-[#FCFFE7] rounded-xl shadow-lg'>
                    <div className="container py-2 px-4">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full border border-[#2B3467]">
                                <img
                                    src={avatarURL}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                            <p className='font-bold truncate'>+65 {ticketData.phoneNumber}</p>

                        </div>

                    </div>
                </div>
                <div className='w-[21rem] h-[9.2rem] bg-[#FCFFE7] rounded-xl shadow-lg'>
                    <div className='container p-4'>
                        <div className="flex justify-between  text-gray-500">
                            <div>
                                {formatTime(currentDate).split(',')[0]}, {formatTime(currentDate).split(',')[1]}
                            </div>
                            <div>
                                {formatTime(currentDate).split(',')[2]}
                            </div>
                        </div>
                        <div className="py-1 font-bold text-xl truncate">
                            {ticketData.queueName}
                        </div>
                        <div className="font-medium truncate">
                            {ticketData.queueDescription}
                        </div>

                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-40 h-96 flex flex-col justify-between gap-4">
                        <div className="w-full h-[40%] bg-[#FCFFE7] rounded-xl shadow-lg">
                            <div className="container p-4 h-full flex flex-col gap-2">
                                <p className='text-[#2B3467] font-semibold'>Your Ticket Number:</p>

                                <div className="flex justify-start items-center gap-2">
                                    <p className='font-bold text-[#EB455F] text-2xl'>{ticketData.ticketNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-[60%] bg-[#FCFFE7] rounded-xl shadow-lg">
                            <div className="container p-4">
                                <p className='text-[#2B3467] font-semibold'>Number of People Ahead:</p>
                                <p className='font-bold text-4xl'>{ticketData.ticketsAhead}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-40 h-96 flex flex-col justify-between gap-4">
                        <div className="w-full h-[60%] bg-[#FCFFE7] rounded-xl shadow-lg">
                            <div className="container p-4 h-full flex flex-col gap-2">
                                <p className='text-[#2B3467] font-semibold'>Now calling:</p>
                                <p className='font-bold text-4xl text-[#EB455F]'>{ticketData.currentTicketNumber}</p>
                            </div>

                        </div>

                        <div className="w-full h-[40%] bg-[#FCFFE7] rounded-xl shadow-lg">

                            <div className="container p-4">
                                <p className='text-[#2B3467] font-semibold'>Est Wait Time:</p>
                                <p className='font-bold text-4xl inline-flex items-end gap-1'>{Math.round(ticketData.expectedWaitingTime)} <span className='text-xs'>minutes</span></p>
                            </div>

                        </div>
                    </div>
                </div>
                <button
                    className="w-[21rem] h-12 bg-red-600 rounded-md text-white text-xs font-black uppercase tracking-wide">
                    Leave
                </button>
            </div>

        </>

    );
}

export default UserDashboard;
