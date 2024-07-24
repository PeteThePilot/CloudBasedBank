const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { collection: "user" }
);

module.exports = mongoose.model('User', UserSchema);



