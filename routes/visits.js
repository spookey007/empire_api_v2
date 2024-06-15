const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Member = require('../models/Member');
const AuthHistory = require('../models/AuthHistory');
const VisitHistory = require('../models/VisitHistory');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper function to generate a random string
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

router.post('/', auth, async (req, res) => {
  try {
    let params = req.body;
   
    const contents = JSON.stringify(params);
    let arr = JSON.parse(contents);

    if (params.MemberID) {
      const MemberID = params.MemberID;

      const member = await Member.findOne({ 'PHIMemberID': MemberID });
      if (!member) {
        return res.status(404).json({ result: 'error', message: 'Member not found'});
      }

      const dd = member;
      try {
        const frm_date = new Date(params.ScheduleStartTime);
        if (isNaN(frm_date.getTime())) {
            throw new Error('Invalid date format');
        }

      } catch (error) {
          console.error('Error:', error);
          // Handle the error accordingly, for example:
          return res.status(400).json({ result: 'error', message: 'Invalid date format' });
      }
      const from_date = new Date(params.ScheduleStartTime);
      const fr_date = `${from_date.getMonth() + 1}-${from_date.getFullYear()}`;
      const ins_date = from_date.toISOString().split('T')[0];
      const to_date = new Date(params.ScheduleEndTime);

      

      const authHistory = await AuthHistory.findOne({
        MemberID: MemberID,
        insert_date: { $regex: fr_date },
      });

      if (authHistory) {
        const dds = authHistory;
        arr.auth = dds;
      } else {
        arr.auth = {
          id: generateRandomString(5),
          service_code: params.ProcedureCode,
          service_type: dd.AcceptedServices,
          service_code_type: 'Hourly (Mutual + Member Shift Overlap)',
          service_category: 'Home Health',
          from_date: from_date.toLocaleDateString('en-US'),
          to_date: to_date.toLocaleDateString('en-US'),
          auth_type: 'entire period',
          hours_per_auth: '',
          add_rules: '',
          billing_diag_code: { code: 'R69', description: 'Illness, unspecified', admit: 'Y', primary: 'Y' },
          notes: 'test',
        };

        const authEntry = new AuthHistory({
          metadata: arr.auth,
          MemberID: MemberID,
          insert_date: ins_date,
        });
        await authEntry.save();
      }

      const visitEntry = new Visit({
        metadata: arr,
      });
      await visitEntry.save();

      const visitHistoryEntry = new VisitHistory({
        id: visitEntry._id,
        metadata: arr,
      });
      await visitHistoryEntry.save();

      res.json({
        result: 'success',
        message: 'Visit posted',
        visit_id: visitEntry._id,
      });
    } else {
      res.status(400).json({ result: 'error', message: 'MemberID is required'});
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error', server_err: err });
  }
});

//getall visits
router.get('/', auth, async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json({ result: 'success', message: `fetched total ${visits.length} visits`, data: visits });
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

    const visits = await Visit.findById(id);
    
    if (!visits) {
      return res.status(404).json({ result: 'error', message: 'Visit not found' });
    }

    res.json({ result: 'success', data: visits });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});

//get visit against caregiver code
router.get('/:id/caregiver', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const caregiver = await Visit.findOne({ 'metadata.CaregiverCode': id });
    
    if (!caregiver) {
      return res.status(404).json({ result: 'error', message: 'Visit not found' });
    }

    res.json({ result: 'success', data: caregiver });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});


// Update a visit using PATCH
router.patch('/:id', auth, async (req, res) => {
  const updateData = req.body;

  try {
    const { id } = req.params;

    // Check if a visit with the given ID exists
    const existingVisit = await Visit.findById(id);

    if (existingVisit) {
      // Prepare the update object to include the nested field update
      const updateObject = {};
      for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          updateObject[`metadata.${key}`] = updateData[key];
        }
      }

      // Update the visit's data with the provided fields
      const updateVisit = await Visit.updateOne(
        { _id: id },
        { $set: updateObject }
      );

      res.json({
        result: 'success',
        message: 'Visit Updated'
      });
    } else {
      res.json({
        result: 'error',
        message: 'No visit found against id # ' + id
      });
    }
  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({
      result: 'error',
      message: 'Internal server error'
    });
  }
});

// Update a visit using PATCH
router.patch('/:id', auth, async (req, res) => {
  const updateData = req.body;

  try {
    const { id } = req.params;

    // Check if a visit with the given ID exists
    const existingVisit = await Visit.findById(id);

    if (existingVisit) {
      // Prepare the update object to include the nested field update
      const updateObject = {};
      for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          updateObject[`metadata.${key}`] = updateData[key];
        }
      }

      // Update the visit's data with the provided fields
      const updateVisit = await Visit.updateOne(
        { _id: id },
        { $set: updateObject }
      );

      res.json({
        result: 'success',
        message: 'Visit Updated'
      });
    } else {
      res.json({
        result: 'error',
        message: 'No visit found against id # ' + id
      });
    }
  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({
      result: 'error',
      message: 'Internal server error'
    });
  }
});


router.get('/:id/l3auth', auth, async (req, res) => {
  try {
    const { id } = req.params;


    const authHistory = await AuthHistory.find({ MemberID: id })
    .sort({ createdAt: -1 }) // Replace 'createdAt' with the correct timestamp field
    .limit(3);
    
    if (!authHistory) {
      return res.status(404).json({ result: 'error', message: 'Visit not found' });
    }

    res.json({ result: 'success', data: authHistory });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ result: 'error', message: 'Server error' });
  }
});

module.exports = router;
