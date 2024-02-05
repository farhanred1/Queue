const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    phoneNumber: {
        type: String,
        required : true,
    },
    // TODO: Decide if having queue ref is necessary 
    queue: {
        type: Schema.Types.ObjectId,
        ref: 'Queue',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'served', 'cancelled'],
        default: 'pending',
    },
    ticketNumber: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
