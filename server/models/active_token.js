const mongoose = require('mongoose');

const activeTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const ActiveToken = mongoose.model('ActiveToken', activeTokenSchema);

module.exports = ActiveToken;
