const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const MemberTeam = require('../models/MemberTeam');
const Coordinator = require('../models/Coordinator');
const MCO = require('../models/MCO');

const router = express.Router();


//team members misc start

// Create User (POST)
router.post('/addtmembers', async (req, res) => {
    try {
       let { name } = req.body;
       name = name.toLowerCase();
      // Basic validation
      if (!name) {
        return res.status(400).json({ result: 'error', message: 'All fields are required' });
      }
  
      // Check for uniqueness
      const existingUser = await MemberTeam.findOne({ name });
      if (existingUser) {
        return res.status(400).json({ result: 'error', message: 'Entity already exists' });
      }
  
      const newUser = new MemberTeam({
        name
      });
  
      await newUser.save();
      res.status(201).json({ result: 'success', message: 'Entity added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal server error' });
    }
  });

// Get Data (GET)
router.get('/gettmembers', async (req, res) => {
  try {
    const membert = await MemberTeam.find();
    if (!membert) {
      return res.status(404).json({ result: 'error', message: 'No Data Found' });
    }
    res.status(200).json({ result: 'success', message: `fetched total ${membert.length} entities`, data: membert });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});


// Partially Update (PATCH)
router.patch('/:id/updtmembers', async (req, res) => {
  try {
    const updates = req.body;

    const user = await MemberTeam.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ result: 'error', message: 'Data not found' });
    }

    res.status(200).json({ result: 'success', message: 'Entity updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

//team members misc end


//coordinator misc start

// Create User (POST)
router.post('/addcordinator', async (req, res) => {
    try {
       let { name } = req.body;
       name = name.toLowerCase();
      // Basic validation
      if (!name) {
        return res.status(400).json({ result: 'error', message: 'All fields are required' });
      }
  
      // Check for uniqueness
      const existingUser = await Coordinator.findOne({ name });
      if (existingUser) {
        return res.status(400).json({ result: 'error', message: 'Entity already exists' });
      }
  
      const newUser = new Coordinator({
        name
      });
  
      await newUser.save();
      res.status(201).json({ result: 'success', message: 'Entity added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal server error' });
    }
  });

// Get Data (GET)
router.get('/getcordinator', async (req, res) => {
  try {
    const membert = await Coordinator.find();
    if (!membert) {
      return res.status(404).json({ result: 'error', message: 'No Data Found' });
    }
    res.status(200).json({ result: 'success', message: `fetched total ${membert.length} entities`, data: membert });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});


// Partially Update (PATCH)
router.patch('/:id/updcordinator', async (req, res) => {
  try {
    const updates = req.body;

    const user = await Coordinator.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ result: 'error', message: 'Data not found' });
    }

    res.status(200).json({ result: 'success', message: 'Entity updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

//coordinator misc end

//MCO misc start

// Create User (POST)
router.post('/addmco', async (req, res) => {
    try {
       let { name,payer_id } = req.body;
       name = name.toLowerCase();
      // Basic validation
      if (!name) {
        return res.status(400).json({ result: 'error', message: 'All fields are required' });
      }
  
      // Check for uniqueness
      const existingUser = await MCO.findOne({ payer_id });
      if (existingUser) {
        return res.status(400).json({ result: 'error', message: 'Entity already exists' });
      }
  
      const newUser = new MCO({
        name,
        payer_id
      });
  
      await newUser.save();
      res.status(201).json({ result: 'success', message: 'Entity added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal server error' });
    }
  });

// Get Data (GET)
router.get('/getmco', async (req, res) => {
  try {
    const membert = await MCO.find();
    if (!membert) {
      return res.status(404).json({ result: 'error', message: 'No Data Found' });
    }
    res.status(200).json({ result: 'success', message: `fetched total ${membert.length} entities`, data: membert });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});


// Partially Update (PATCH)
router.patch('/:id/updmco', async (req, res) => {
  try {
    const updates = req.body;

    const user = await MCO.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ result: 'error', message: 'Data not found' });
    }

    res.status(200).json({ result: 'success', message: 'Entity updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

//MCO misc end

module.exports = router;
