

const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user by id
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    console.log('Incoming update data:', updateData); // Log incoming data for debugging

    // Exclude email from updateData to prevent accidental updates
    const { email, ...fieldsToUpdate } = updateData;

    console.log('Fields to update:', fieldsToUpdate);

    // Validate required fields
    if (!fieldsToUpdate.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Update user document using _id
    console.log('Updating user with ID:', req.params.id);
    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({ error: 'Duplicate key error. Please ensure unique fields.' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;