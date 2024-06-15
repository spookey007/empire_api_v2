const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  metadata: { type: Object, required: true },
  status: {type:Number,default:"1"}
}, { timestamps: true });

module.exports = mongoose.model('Visit', VisitSchema);
