const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  birthday: String, // MM-DD format
  avatar: String
});

module.exports = mongoose.model('Employee', employeeSchema); // ✅ correct export
