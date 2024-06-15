// routes/caregivers.js
const express = require('express');
const router = express.Router();
const Caregiver = require('../models/Caregiver');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

//getall caregivers
router.get('/', auth, async (req, res) => {
  try {
    const caregivers = await Caregiver.find().select('_id status datetime metadata');
    const data = caregivers.map(caregiver => {
      const metadata = caregiver.metadata;
      metadata.id = caregiver.id;
      metadata.member_status = caregiver.status;
      return metadata;
    });
    res.json({ result: 'success', message: `fetched total ${caregivers.length} caregivers`, data });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});



//get caregiver
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ result: 'error', message: 'Invalid ID format' });
    }

    const caregiver = await Caregiver.findById(id).select('_id status datetime metadata');
    console.log(JSON.stringify(caregiver.metadata));
    if (!caregiver) {
      return res.status(404).json({ result: 'error', message: 'Caregiver not found' });
    }

    let metadata;
    try {
      metadata = caregiver.metadata;
      
    } catch (jsonParseError) {
      return res.status(500).json({ result: 'error', message: 'Failed to parse metadata', server_err: jsonParseError.message });
    }

    metadata.id = caregiver.id;
    metadata.member_status = caregiver.status;

    res.json({ result: 'success', data: metadata });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
})


//create caregiver
router.post('/', auth, async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Request Body:', req.body);

    const caregiver = new Caregiver({ metadata: req.body, status: 1 });

    // Log the caregiver object before saving
    console.log('Caregiver Object:', caregiver);

    await caregiver.save();
    res.json({ result: 'success', message: 'caregiver posted' });
  } catch (err) {
    // Log the error
    console.error('Error:', err);

    res.status(500).json({ result: 'error', message: 'Failed to post caregiver', server_err: err });
  }
});



//update caregiver
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const caregiver = await Caregiver.findOne({ _id: id });
    if (!caregiver) {
      return res.status(404).json({ result: 'error', message: 'No caregiver found against provided id',server_err: err });
    }

    caregiver.metadata = req.body;
    await caregiver.save();
    res.json({ result: 'success', message: 'caregiver updated' });
  } catch (err) {
    res.status(500).json({ result: 'error', message: 'Failed to update caregiver', server_err: err });
  }
});

//soft delete caregiver
router.patch('/:id/deactivate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const caregiver = await Caregiver.findOne({ _id: id});
    if (!caregiver) {
      return res.status(404).json({ result: 'error', message: 'No caregiver found against provided id',server_err: err });
    }
    caregiver.status = 0;
    await caregiver.save();
    res.json({ result: 'success', message: 'caregiver deactivated' });
  } catch (err) {
    res.status(500).json({ result: 'error', message: 'Failed to deactivate caregiver',server_err: err });
  }
});

module.exports = router;
