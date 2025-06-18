const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  codeforces_username: { type: String, default: '' },
  codechef_username: { type: String, default: '' },
  leetcode_username: { type: String, default: '' },
});

module.exports = mongoose.model('User', UserSchema);