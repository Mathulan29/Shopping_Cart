const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    nic: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    password: {
        type: String,
        // Password not required if using OAuth/Passkeys
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true,
    },
    // Store passkey credentials (WebAuthn)
    passkeyCredentials: [
        {
            credentialID: String,
            credentialPublicKey: String,
            counter: Number,
            transports: [String],
        },
    ],
    // Challenge for WebAuthn registration/login
    currentChallenge: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
