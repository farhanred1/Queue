import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Queue from './Queue';
import Header from './Header';
import QueueView from './QueueView';
import AddQueueBtn from './AddQueueBtn';

import useFetch from '../components/useFetch'

const AdminDashboard = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedQueue, setSelectedQueue] = useState(null); // State to track the selected queue
    console.log("selectedQueue: ", selectedQueue)

    const [queues, setQueues] = useState([]);
    console.log("queues", queues)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        // Send group information when connecting
        ws.addEventListener('open', () => {
            const groupInfo = {
                group: 'Admin',
            };
            ws.send(JSON.stringify(groupInfo));
        });

        ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log("ws", data.queues);

            const updatedQueues = data.queues || [];
            setQueues(updatedQueues);

            // Update selectedQueue if it's currently selected and has changed
            if (selectedQueue) {
                const updatedSelectedQueue = updatedQueues.find(queue => queue._id === selectedQueue._id);
                if (updatedSelectedQueue) {
                    setSelectedQueue(updatedSelectedQueue);
                }
            }
        });

        return () => {
            ws.close();
        };
    }, [selectedQueue]);


    const { isLoading, apiData, serverError } = useFetch('http://localhost:8080/admin-get-data', 'GET', true);

    // Effect to fetch admin data on component mount
    useEffect(() => {
        if (!isLoading && apiData !== null) {
            console.log(apiData);
            setQueues(apiData.queues || []); // Ensure you are extracting queues from apiData
        }
    }, [isLoading, apiData]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };


    const handleQueueClick = (queue) => {
        setSelectedQueue(queue);
        setSidebarOpen(true); // Open the sidebar when a queue is clicked
    };
    return (

        <div className="">

            <div className="w-full">
                {/* Admin Profile */}
                <Header />
                <div className='p-4'>
                    <div className='flex justify-end'>
                        <AddQueueBtn />
                    </div>
                    <div className='md:flex justify-center items-start'>
                        {/* List of Queues */}
                        <div className='py-4 flex flex-wrap items-end justify-center gap-4'>
                            {queues.map((queue) => (
                                <Queue key={queue._id} {...queue} onClick={() => handleQueueClick(queue)} />
                            ))}
                        </div>
                        {/* Right Sidebar */}
                        <div className="py-4 flex justify-end">
                            {/* Content of the Right Sidebar */}
                            <div className={`overflow-scroll md:overflow-auto bg-gray fixed top-0 right-0 bottom-0 w-3/4 transition-transform transform ${isSidebarOpen ? 'translate-x-0 md:relative ' : 'md:hidden translate-x-full'}`} >
                                <button className="absolute top-0 right-0 p-2 bg-gray-400 text-white" onClick={toggleSidebar}> &times; </button>
                                {selectedQueue && <QueueView queue={selectedQueue} />}
                            </div>

                            {/* Add more sections as needed for additional functionalities */}
                        </div>
                    </div>
                </div>




            </div>


        </div>
    );
}

export default AdminDashboard