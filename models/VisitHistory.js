const mongoose = require('mongoose');

const VisitHistorySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Visit' },
  metadata: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('VisitHistory', VisitHistorySchema);
