const mongoose = require('mongoose');

  // Define the MemberPOC schema
  const MemberTeam = new mongoose.Schema({
    name: String,
    status: { type: Number, default: 1 }
    });
  
  module.exports = mongoose.model('MemberTeam', MemberTeam);