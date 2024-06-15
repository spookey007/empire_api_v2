const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

// Create User (POST)
router.post('/create-user', async (req, res) => {
    try {
      const { user_name, pwd, email, phone, user_type, date_of_birth, address } = req.body;
  
      // Basic validation
      if (!user_name || !pwd || !email || !phone || !user_type || !date_of_birth || !address) {
        return res.status(400).json({ result: 'error', message: 'All fields are required' });
      }
  
      // Check for uniqueness
      const existingUser = await User.findOne({ user_name });
      if (existingUser) {
        return res.status(400).json({ result: 'error', message: 'Username already exists' });
      }
  
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ result: 'error', message: 'Email already exists' });
      }
  
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ result: 'error', message: 'Phone number already exists' });
      }
  
      const hashedPwd = await bcrypt.hash(pwd, 10);
  
      const newUser = new User({
        user_name,
        pwd: hashedPwd,
        email,
        phone,
        user_type,
        date_of_birth,
        address
      });
  
      await newUser.save();
      res.status(201).json({ result: 'success', message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal server error' });
    }
  });

// Login (POST)
router.post('/login', async (req, res) => {
  try {
    const { user_name,user_type,pwd } = req.body;
    const user = await User.findOne({ user_name, user_type,status:1 });
    if (!user_name || !user_type) {
        return res.status(400).json({ result: 'error', message: 'user_name and user_type are required' });
      }
    if (!user) {
      return res.status(400).json({ result: 'error', message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);

    if (!isMatch) {
      return res.status(400).json({ result: 'error', message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ result: 'success', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

// Get User (GET)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ result: 'error', message: 'User not found' });
    }

    res.status(200).json({ result: 'success', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});


// Partially Update User (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ result: 'error', message: 'User not found' });
    }

    res.status(200).json({ result: 'success', message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

// Forgot Password (POST)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ result: 'error', message: 'User not found' });
    }

    // Generate a random password reset token (you can use a more secure way)
    const resetToken = Math.random().toString(36).substr(2);

    // Here, you should store the reset token and its expiration in the database.
    // For simplicity, we're not doing that.

    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password'
      }
    });

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Your password reset token is: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ result: 'success', message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

// Reset Password (POST)
router.post('/reset-password', async (req, res) => {
    try {
      const { email, user_type, pwd, new_pwd } = req.body;
  
      // Validate input
      if (!email || !user_type || !pwd || !new_pwd) {
        return res.status(400).json({ result: 'error', message: 'All fields are required' });
      }
  
      // Find the user by email and user_type
      const user = await User.findOne({ email, user_type });
      if (!user) {
        return res.status(400).json({ result: 'error', message: 'User not found' });
      }
  
      // Compare the old password
      const isMatch = await bcrypt.compare(pwd, user.pwd);
      if (!isMatch) {
        return res.status(400).json({ result: 'error', message: 'Invalid old password' });
      }
  
      // Hash the new password
      const hashedNewPwd = await bcrypt.hash(new_pwd, 10);
  
      // Update the password
      user.pwd = hashedNewPwd;
      await user.save();
  
      res.status(200).json({ result: 'success', message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal server error' });
    }
  });

module.exports = router;
