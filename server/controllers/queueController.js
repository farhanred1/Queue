const Admin = require('../models/admin');
const Queue = require('../models/queue');

const QRCode = require('qrcode');
const webSocketHandler = require('./webSocketHandler');

const generateQRCode = async (data) => {
    try {
        // Generate QR code as a data URI
        const qr_code_data_uri = await QRCode.toDataURL(data);

        // Convert the data URI to a buffer
        const data_buffer = Buffer.from(qr_code_data_uri.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        return data_buffer;
    } catch (error) {
        throw new Error(`Failed to generate QR code: ${error.message}`);
    }
}

const findAdminByIdAndBroadcastUpdates = async (admin_id, res) => {
    try {
        const broadcast_data_admin = await Admin.findById(admin_id);
        if (!broadcast_data_admin) {
            return res.status(404).json({ error: 'Broadcast data for admin not found' });
        }
        
        webSocketHandler.broadcastUpdates(broadcast_data_admin, 'Admin');
        
        return broadcast_data_admin;
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.addQueueToAdmin = async (req, res) => {
    try {
        const adminId = req.user._id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found ' });
        }

        const { queueName, description } = req.body;

        const newQueue = new Queue({
            queueName,
            description,
            creator: adminId,
            tickets: [],
        });

        // Generate URL with specific Queue ID and Admin ID
        const queueId = newQueue._id;
        const adminIdForURL = encodeURIComponent(adminId);
        const queueIdForURL = encodeURIComponent(queueId);
        const url = `http://localhost:3000/create-ticket/${adminIdForURL}/${queueIdForURL}`;
        const qrCodeBuffer = await generateQRCode(url);// Generate QR code

        // Add URL and QR code to the Queue info
        newQueue.url = url;
        newQueue.qrCode = qrCodeBuffer.toString('base64');

        admin.queues.push(newQueue);

        const updatedAdmin = await admin.save();

        const broadcast = await findAdminByIdAndBroadcastUpdates(adminId, res);
        if (broadcast) {
            res.status(201).json(updatedAdmin);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getQueueById = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const { queueId } = req.body;
        const queue = admin.queues.id(queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        res.json(queue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQueueById = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const { queueId } = req.body;
        const queue = admin.queues.id(queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        // Update queue properties based on your requirements
        queue.queueName = req.body.queueName || queue.queueName;
        queue.description = req.body.description || queue.description;

        const updatedAdmin = await admin.save();

        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteQueueById = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const { queueId } = req.body;
        const queue = admin.queues.id(queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        queue.remove();
        const updatedAdmin = await admin.save();

        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.callNextTicket = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const { queueId } = req.body;
        const queue = admin.queues.id(queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        // Find the next pending ticket in the queue
        const nextPendingTicket = queue.tickets.find((ticket) => ticket.status === 'pending');

        if (!nextPendingTicket) {
            return res.status(404).json({ error: 'No pending tickets in the queue' });
        }

        // Update the status of the ticket to 'served'
        nextPendingTicket.status = 'served';

        // Save the updated admin (which includes the updated queue and ticket)
        await admin.save();

        const broadcast = await findAdminByIdAndBroadcastUpdates(adminId, res);
        webSocketHandler.broadcastUpdates(nextPendingTicket, 'User');
        if (broadcast) {
            res.status(200).json(nextPendingTicket);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLastCalledTicket = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const { queueId } = req.body;
        const queue = admin.queues.id(queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        // Find the last called ticket with 'served' status
        const lastCalledTicket = queue.tickets
            .filter(ticket => ticket.status === 'served')
            .sort((a, b) => b.updatedAt - a.updatedAt)[0];

        if (!lastCalledTicket) {
            return res.status(404).json({ error: 'No served tickets in the queue' });
        }
        res.status(200).json(lastCalledTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

