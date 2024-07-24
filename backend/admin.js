const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { collection: "admin" }
  );
  module.exports = mongoose.model('Admin', AdminSchema);