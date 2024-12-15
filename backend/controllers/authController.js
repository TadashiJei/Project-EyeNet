// backend/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                status: 'success',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User already exists'
                });
            }

            // Create new user
            const newUser = new User({
                name,
                email,
                password
            });

            // Save user
            await newUser.save();

            res.status(201).json({
                status: 'success',
                message: 'User created successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json({
                status: 'success',
                user
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.user.id, req.body, {
                new: true,
                runValidators: true
            }).select('-password');
            res.json({
                status: 'success',
                user
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = authController;
