const mongoose = require('mongoose');

  // Define the MemberPOC schema
  const MCO = new mongoose.Schema({
    name: String,
    payer_id: Number,
    status: { type: Number, default: 1 }
    });
  
  module.exports = mongoose.model('MCO', MCO);