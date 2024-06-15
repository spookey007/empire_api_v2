const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const MemberPOC = require('../models/MemberPOC');
const MemberMasterweek = require('../models/MemberMasterweek');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');



// Add a new member
router.post('/',auth, async (req, res) => {
  try {
    const { PHIMemberID } = req.body;

    // Check if the member already exists
    const existingMember = await Member.findOne({ 'PHIMemberID': PHIMemberID });
    if (existingMember) {
      return res.status(400).json({ result: 'error', message: 'entity already exists' });
    }

    // Create a new member
    const newMember = new Member(req.body);
    await newMember.save();

    res.status(201).json({ result: 'success', message: 'Entity created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

// Update a member using PATCH
router.patch('/:id',auth, async (req, res) => {
    const updateData = req.body;

    try {
        const { id } = req.params;

        // Check if a member with the given ID exists
        const existingMember = await Member.findById(id);

        if (existingMember) {
            // Update the member's data with the provided fields
            const updatedMember = await Member.updateOne(
                { _id: id },
                { $set: updateData }
            );

            res.json({
                result: 'success',
                message: 'Entity updated'
            });
        } else {
            res.json({
                result: 'error',
                message: 'No entity found against id # ' + id
            });
        }
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({
            result: 'error',
            message: 'Internal server error'
        });
    }
});


//getall members
router.get('/', auth, async (req, res) => {
  try {
    const members = await Member.find();
    res.json({ result: 'success', message: `fetched total ${members.length} members`, data: members });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});




//get member
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ result: 'error', message: 'Invalid ID format' });
    }

    const members = await Member.findById(id);
    
    if (!members) {
      return res.status(404).json({ result: 'error', message: 'Member not found' });
    }

    res.json({ result: 'success', data: members });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});


router.post('/assignpoc', auth, async (req, res) => {
  try {
    const { member_id, is_primary, ...params } = req.body;
    // Check if the member already exists
    const existingMembers = await MemberPOC.find({
      member_id: member_id,
    });

    if (existingMembers.length > 0) {
      if (is_primary === 'Y') {
        for (const member of existingMembers) {
          await MemberPOC.updateOne(
            { _id: member._id },
            { $set: { is_primary: 'N' } }
          );
        }
      }
    }

    const newMemberPOC = new MemberPOC({
      is_primary,
      member_id,
      ...params
    });

    await newMemberPOC.save();

    res.status(201).json({ result: 'success', message: 'Entity created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});


//get member
router.get('/:id/mpclist', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const memberPOC = await MemberPOC.findOne({ member_id: id });
    
    if (!memberPOC) {
      return res.status(404).json({ result: 'error', message: 'Member not found' });
    }

    res.json({ result: 'success', data: memberPOC });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});

//get Masterweek
router.get('/:id/getmasterweek', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const membermweek = await MemberMasterweek.find({ 'member_id': id });
    if (!membermweek) {
      return res.status(404).json({ result: 'error', message: 'Member not found' });
    }

    res.json({ result: 'success', data: membermweek });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});

//add masterweek
router.post('/addmasterweek', auth, async (req, res) => {
  try {
    const { member_id, ...params } = req.body;
    // Check if the member already exists
    const existingMembers = await Member.findOne({ 'PHIMemberID': member_id });
    if (!existingMembers) {
      return res.status(404).json({ result: 'error', message: 'Member not found' });
    }
    const newMemberPOC = new MemberMasterweek({
      member_id,
      ...params
    });

    await newMemberPOC.save();

    res.status(201).json({ result: 'success', message: 'Entity created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'error', message: 'Internal server error' });
  }
});

// Update a member masterweek using PATCH
router.patch('/:id/updatemasterweek',auth, async (req, res) => {
  const updateData = req.body;

  try {
      const { id } = req.params;

      // Check if a member with the given ID exists
      const existingMember = await MemberMasterweek.findById(id);

      if (existingMember) {
          // Update the member's data with the provided fields
          const updatedMember = await MemberMasterweek.updateOne(
              { _id: id },
              { $set: updateData }
          );

          res.json({
              result: 'success',
              message: 'Entity updated'
          });
      } else {
          res.json({
              result: 'error',
              message: 'No entity found against id # ' + id
          });
      }
  } catch (error) {
      console.error('Error updating member:', error);
      res.status(500).json({
          result: 'error',
          message: 'Internal server error'
      });
  }
});



module.exports = router;
