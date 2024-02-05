const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;








/*  #################################################################################################################

const mongoose = require('mongoose');
const { Schema } = mongoose;

const queueUserSchema = new Schema( 
    { 
        phone_no : {
            type: String,
            required : true,
        },
    },
    {
        timestamps : true,
    }
);
    
    
module.exports = mongoose.model('User', queueUserSchema); 

##################################################################################################################   */