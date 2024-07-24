const mongoose = require('mongoose');
const moneySchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
      },
      money: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    { collection: "money" }
  );
module.exports = mongoose.model('Money', moneySchema);
