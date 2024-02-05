const mongoose = require('mongoose');
const { Schema } = mongoose;
const Ticket = require('./ticket');

const queueSchema = new Schema({
    queueName: {
        type: String,
        required: true,
    },
    description: String,
    // TODO: Decide if having admin ref is necessary 
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
    url:{
        type: String,
        required: true,
        default: 'https://your-website.com/create-ticket',
    },
    qrCode:{
        type: String,
        required: true,
        default: 'QR base64 String',
    },
    tickets: [Ticket.schema],
    statusCounts: {
        served: {
            type: Number,
            default: 0,
        },
        pending: {
            type: Number,
            default: 0,
        },
        cancelled: {
            type: Number,
            default: 0,
        },
    },

}, {
    timestamps: true,
});

// Middleware to update status counts before saving a queue
queueSchema.pre('save', function (next) {
    const statusCounts = {};

    // Initialize counts for all status types
    this.tickets.forEach(ticket => {
        statusCounts[ticket.status] = 0;
    });

    // Count tickets for each status
    this.tickets.forEach(ticket => {
        statusCounts[ticket.status]++;
    });

    this.statusCounts = statusCounts;
    next();
});

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
