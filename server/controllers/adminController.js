const bcrypt = require('bcrypt')


const Admin = require('../models/admin');
const Queue = require('../models/queue');
const Ticket = require('../models/ticket');

const webSocketHandler = require('./webSocketHandler'); // Replace with the correct path


exports.createAdmin = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, password_confirmation } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = new Admin({
            firstname,
            lastname,
            username,
            password: hashedPassword,
            email,
            queues: [], // Initialize with an empty array of queues
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json(savedAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAdminUserData = async (req, res) => {
    const adminId = req.user._id;
    console.log(req.user)

    try {
        const admin = await Admin.findOne({ _id: adminId });

        if (!admin) {
            return res.status(402).json({ error: 'Admin user not found' });
        }

        const { password, ...sanitizedAdminData } = admin.toObject();

        // Broadcast the update to all connected clients
        webSocketHandler.broadcastUpdates(sanitizedAdminData);

        res.json(sanitizedAdminData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getSanitizedAdminData = async (adminId, res) => {
    try {
        // Find the admin user by ID, along with associated queues and tickets
        const admin = await Admin.findById(adminId).populate({
            path: 'queues',
            populate: {
                path: 'tickets',
            },
        });

        // If admin is not found, return an error response
        if (!admin) {
            return res.status(402).json({ error: 'Admin user not found' });
        }

        // Extract password and other data from the admin object
        const { password, ...sanitizedAdminData } = admin.toObject();

        // Calculate ticket statistics for each queue
        const queueStats = admin.queues.map((queue) => {
            const totalPendingTickets = queue.tickets.filter((ticket) => ticket.status === 'pending').length;
            const totalServedTickets = queue.tickets.filter((ticket) => ticket.status === 'served').length;
            const totalCancelledTickets = queue.tickets.filter((ticket) => ticket.status === 'cancelled').length;

            return {
                queueId: queue._id,
                queueName: queue.queueName,
                totalPendingTickets,
                totalServedTickets,
                totalCancelledTickets,
            };
        });

        // Add ticket statistics to sanitized admin data
        sanitizedAdminData.queueStats = queueStats;

        // Return the sanitized admin data
        return sanitizedAdminData;
    } catch (error) {
        // If an error occurs, return an error response
        return res.status(500).json({ error: error.message });
    }
};

