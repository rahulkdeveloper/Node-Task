const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin']
    },

    forgotPasswordToken: {
        type: String
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
})

const User = new mongoose.model("User", UserSchema);

module.exports = User;