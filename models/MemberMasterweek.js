// models/MemberPOC.js
const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  day_of_week: String,
  hours: String,
  caregiver: String,
  ass_id: String,
  poc_id: String,
  hour: String,
  min: String,
  sec: String,
  service_code: String,
  mode: String
});

const MembermweekSchema = new mongoose.Schema({
  member_id: { type: String, required: true },
  from_date: String,
  to_date: String,
  days: [DaySchema]
});

module.exports = mongoose.model('MemberMasterweek', MembermweekSchema);
