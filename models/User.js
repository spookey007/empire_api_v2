const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true, maxlength: 50, unique: true },
  pwd: { type: String, required: true, maxlength: 60 },
  email: { type: String, required: true, maxlength: 50, unique: true },
  phone: { type: String, required: true, maxlength: 12, unique: true },
  status: { type: Number, default: 1 },
  user_type: { type: Number, required: true },
  date_of_birth: { type: Date, required: true },
  address: { type: String, required: true },
  creation_date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
