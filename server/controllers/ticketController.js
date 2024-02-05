const Admin = require('../models/admin');
const Queue = require('../models/queue');
const Ticket = require('../models/ticket');

const otpGenerator = require('otp-generator');
const otpStorage = {};

const webSocketHandler = require('./webSocketHandler');
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


// Step 1: Check if the phone number is unique in the queue
exports.checkPhoneNumberUnique = async (req, res) => {
    try {
        const { phone_no } = req.body;
        const { adminId, queueId } = req.params;

        // Find the admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Find the specified queue under the admin
        const queue = admin.queues.find(q => q._id.toString() === queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found under the specified admin' });
        }

        // Check if the phone number already exists in the queue
        const isPhoneNumberUnique = !queue.tickets.some(ticket => ticket.phoneNumber === phone_no);

        // Return the result
        res.status(200).json({ success: isPhoneNumberUnique });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Step 2: Generate OTP
exports.generateOTP = async (req, res) => {
    try {
        const { phone_no } = req.body;

        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        otpStorage[phone_no] = otp;

        console.log(`Generated OTP for ${phone_no}: ${otp}`);

        res.status(200).json({ message: 'OTP generated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Step 3: Send OTP via SMS
exports.sendOTPviaSMS = async (req, res) => {
    try {
        const { phone_no } = req.body;

        // Assume the previous step was successful (OTP generated)
        const isOTPGenerated = true;

        if (isOTPGenerated) {
            // Mock sending OTP via SMS (replace with actual implementation)
            // This is just an example, you would integrate with an SMS gateway in a real-world scenario
            console.log(`Sending OTP via SMS to ${phone_no}`);

            // Return the result
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ error: 'OTP generation failed' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Step 4: Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { phone_no, otp } = req.body;
        console.log(phone_no, typeof (phone_no), otp, typeof (otp))

        const storedOtp = otpStorage[phone_no];
        if (!storedOtp || otp !== storedOtp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        delete otpStorage[phone_no];

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to generate a unique ticket number
const generateUniqueTicketNumber = async () => {
    const alphabetChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';

    while (true) {
        // Generate a random ticket number
        const randomAlphabets = Array.from({ length: 2 }, () => alphabetChars.charAt(Math.floor(Math.random() * alphabetChars.length)));
        const randomNumbers = Array.from({ length: 3 }, () => numericChars.charAt(Math.floor(Math.random() * numericChars.length)));
        const ticketNumber = randomAlphabets.join('') + randomNumbers.join('');

        // Check if the ticket number is unique
        const existingTicket = await Ticket.findOne({ ticketNumber });
        if (!existingTicket) {
            return ticketNumber;
        }
    }
};

// Step 5: Generate Ticket
exports.createTicket = async (req, res) => {
    try {
        const { phone_no } = req.body;
        const { adminId, queueId } = req.params;

        // Find the admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const queue = admin.queues.find(q => q._id.toString() === queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found under the specified admin' });
        }

        const newTicket = new Ticket({
            phoneNumber: phone_no,
            queue: queueId,
            ticketNumber: await generateUniqueTicketNumber(),
        });

        queue.tickets.push(newTicket);

        await admin.save();

        const broadcast = await findAdminByIdAndBroadcastUpdates(adminId, res);
        if (broadcast) {
            res.status(201).json({ ticket: newTicket });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const calculateAverageTimeToCallOneTicket = (servedTickets) => {
    if (!servedTickets || servedTickets.length === 0) {
        return null; // No served tickets to calculate average
    }

    const sortedServedTickets = servedTickets.sort((a, b) => a.updatedAt - b.updatedAt);

    const timeGaps = sortedServedTickets.map((ticket, index) => {
        if (index === 0) {
            return 0; // for the first ticket, time gap is 0
        }

        const previousUpdatedAt = sortedServedTickets[index - 1].updatedAt;
        const currentUpdatedAt = ticket.updatedAt;

        const timeGap = (currentUpdatedAt - previousUpdatedAt) / (1000 * 60); // Convert time gap to minutes
        return timeGap;
    });

    const averageTimeGap = timeGaps.reduce((total, gap) => total + gap, 0) / timeGaps.length;

    return averageTimeGap;
};

exports.getTicketInfo = async (req, res) => {
    try {
        const { adminId, queueId, ticketId } = req.params;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const queue = admin.queues.find((q) => q._id.toString() === queueId);
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        const ticket = queue.tickets.find((t) => t._id.toString() === ticketId);

        const servedTickets = queue.tickets.filter((ticket) => ticket.status === 'served');
        const currentTicket = servedTickets.length > 0 ? servedTickets[servedTickets.length - 1] : null;


        const totalServedTickets = servedTickets.length;
        console.log('totalServedTickets', totalServedTickets)
        const avgTimeToCallOneTicket = calculateAverageTimeToCallOneTicket(servedTickets);
        console.log('avgTimeToCallOneTicket', avgTimeToCallOneTicket)

        let ticketsAhead = 0;
        let expectedWaitingTime = 0;
        
        if (currentTicket && ticketId) {
            const ticketIndex = queue.tickets.findIndex((ticket) => ticket._id.toString() === ticketId);
            console.log('ticketIndex', ticketIndex);
        
            if (ticketIndex !== -1 && ticketIndex <= queue.tickets.length - 1) {
                ticketsAhead = Math.max(0, ticketIndex - totalServedTickets);
                let ticketsAheadRaw = (ticketIndex+1) - totalServedTickets
                console.log(ticketsAheadRaw)
                expectedWaitingTime = ticketsAheadRaw <= 0 ? 0 : (ticketsAhead + 1) * avgTimeToCallOneTicket;
            }
            console.log('expectedWaitingTime', expectedWaitingTime);
        } else if (ticketId) {
            const ticketIndex = queue.tickets.findIndex((ticket) => ticket._id.toString() === ticketId);
            console.log('ticketIndex', ticketIndex);
        
            ticketsAhead = Math.max(0, ticketIndex);
            expectedWaitingTime = ticketsAhead === 0 ? 0 : (ticketsAhead + 1) * avgTimeToCallOneTicket;
            console.log('expectedWaitingTime', expectedWaitingTime);
        }
        
        console.log('ticketsAhead', ticketsAhead);
        res.status(200).json({
            phoneNumber: ticket.phoneNumber,
            ticketNumber: ticket.ticketNumber,
            queueName: queue.queueName,
            queueDescription: queue.description,
            currentTicketNumber: currentTicket ? currentTicket.ticketNumber : null,
            ticketsAhead: ticketsAhead,
            expectedWaitingTime: expectedWaitingTime,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

