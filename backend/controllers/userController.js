const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      department: req.body.department
    });

    const savedUser = await newUser.save();

    // Send welcome email
    const welcomeMessage = `
      <h1>Welcome to EyeNet!</h1>
      <p>Thank you for registering with EyeNet. We are excited to have you on board.</p>
    `;
    await sendEmail(savedUser.email, 'Welcome to EyeNet', welcomeMessage);

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.role) {
      user.role = req.body.role;
    }
    if (req.body.department) {
      user.department = req.body.department;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('auth-token', token).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`; // Replace with your frontend URL
    const resetMessage = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    await sendEmail(user.email, 'Password Reset Request', resetMessage);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
