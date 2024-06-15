const mongoose = require('mongoose');

const POCSchema = new mongoose.Schema({
    duty: String,
    task_id: String,
    category: String,
    as_needed: String,
    instruction: String,
    days_of_week: String,
    times_a_week_max: String,
    times_a_week_min: String,
  });
  
  // Define the MemberPOC schema
  const MemberPOCSchema = new mongoose.Schema({
    is_primary: String,
    start_date: String,
    end_date: String,
    shift: String,
    member_id: { type: String, required: true },
    POC: [POCSchema],
  });
  
  module.exports = mongoose.model('MemberPOC', MemberPOCSchema);