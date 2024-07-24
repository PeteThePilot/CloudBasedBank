const mongoose = require('mongoose');
const CashierSchema = new mongoose.Schema(
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
    { collection: "cashier" }
  );
  module.exports = mongoose.model('Cashier', CashierSchema);