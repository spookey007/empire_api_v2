const mongoose = require('mongoose');

const AuthHistorySchema = new mongoose.Schema({
  metadata: {
    id: { type: String, required: true },
    service_code: { type: String, required: true },
    service_type: { type: [String], required: true },
    service_code_type: { type: String, required: true },
    service_category: { type: String, required: true },
    from_date: { type: String, required: true },
    to_date: { type: String, required: true },
    auth_type: { type: String, required: true },
    hours_per_auth: { type: String, required: false },
    add_rules: { type: String, required: false },
    billing_diag_code: {
      code: { type: String, required: true },
      description: { type: String, required: true },
      admit: { type: String, required: true },
      primary: { type: String, required: true },
    },
    notes: { type: String, required: false },
  },
  MemberID: { type: String, required: true },
  insert_date: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AuthHistory', AuthHistorySchema);
