const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, password, name, address, nic, phoneNumber } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            address,
            nic,
            phoneNumber,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                email: user.email,
                name: user.name,
                address: user.address,
                nic: user.nic,
                phoneNumber: user.phoneNumber,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (Local)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            user.nic = req.body.nic || user.nic;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
                nic: updatedUser.nic,
                phoneNumber: updatedUser.phoneNumber,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Passkey (WebAuthn) ---
// Simplified implementation

const rpName = 'Fresh Cart';
const rpID = 'localhost'; // Change for production
const origin = `http://${rpID}:3000`; // Change for production

// 1. Register Challenge
const registerPasskeyChallenge = async (req, res) => {
    // User must be logged in or identified first usually, but for strict passkey flow:
    // If user is already logged in (adding passkey):
    // If valid user found via session/token

    // For this example, let's assume this is adding a passkey to a logged in user
    // or registering a new user via passkey (requires email first ideally)
    const user = await User.findById(req.user.id);

    if (!user) return res.status(401).json({ message: 'User not found' });

    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: user.id,
        userName: user.email,
        // Don't exclude credentials so they can add multiple devices, 
        // or exclude existing to prevent duplicates.
        // excludeCredentials: ... 
        authenticatorSelection: {
            userVerification: 'preferred',
            residentKey: 'required',
        },
    });

    // Save challenge to DB
    user.currentChallenge = options.challenge;
    await user.save();

    res.json(options);
};

// 2. Register Verify
const registerPasskeyVerify = async (req, res) => {
    const user = await User.findById(req.user.id);
    const { body } = req;

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    if (verification.verified) {
        const { registrationInfo } = verification;

        user.passkeyCredentials.push({
            credentialID: registrationInfo.credentialID,
            credentialPublicKey: registrationInfo.credentialPublicKey,
            counter: registrationInfo.counter,
        });

        user.currentChallenge = undefined; // clear challenge
        await user.save();

        res.json({ verified: true });
    } else {
        res.status(400).json({ verified: false });
    }
};

// 3. Login Challenge
const loginPasskeyChallenge = async (req, res) => {
    // For passkey login (usernameless or not), we need to generate options.
    // If usernameless (resident key), we don't need user ID yet.

    const options = await generateAuthenticationOptions({
        rpID,
        userVerification: 'preferred',
        // allowCredentials: ... // leave empty for discoverable credential
    });

    // We need to store this challenge somewhere linked to the session or request. 
    // Since we don't know the user yet, storing in a temporary collection or cookie signature is common.
    // For simplicity here, we'll return it and expect the client to send the user ID or we find user by credential ID in verify step.
    // HOWEVER: `verifyAuthenticationResponse` needs the expected challenge.
    // We should use a session or a temp store.
    // Let's assume we find user by email first for this implementation to keep it simple, OR use a global challenge store (less secure).
    // Better: Client sends email first -> we set challenge on user -> return options.

    // Let's accept email in body to find user
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.currentChallenge = options.challenge;
    await user.save();

    res.json(options);
};

// 4. Login Verify
const loginPasskeyVerify = async (req, res) => {
    const { email, response: body } = req.body; // Client sends email + WebAuthn response

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let dbCredential;
    // Find which credential was used
    const credIdBuffer = Buffer.from(body.id, 'base64url'); // simplewebauthn uses base64url
    // ... matching logic can be complex depending on library version.
    // SimpleWebAuthn verify takes the authenticator, we just need the expected challenge from user.

    /* Note: In a real app, you'd look up the user BY the credential ID returned in 'body.id' 
       if doing passwordless/usernameless. 
       Here we rely on email being sent with the request.
    */

    // Find the credential in user's list
    const credential = user.passkeyCredentials.find(cred => cred.credentialID === body.id);

    if (!credential) {
        // Try to find by checking all? No, ID must match.
        // If body.id is base64url, our stored might be different format. 
        // Let's assume strict match or conversion needed.
    }

    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                credentialID: credential.credentialID,
                credentialPublicKey: credential.credentialPublicKey,
                counter: credential.counter,
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    if (verification.verified) {
        // Update counter
        credential.counter = verification.authenticationInfo.newCounter;
        user.currentChallenge = undefined;
        await user.save();

        res.json({
            verified: true,
            _id: user.id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ verified: false });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    registerPasskeyChallenge,
    registerPasskeyVerify,
    loginPasskeyChallenge,
    loginPasskeyVerify
};
