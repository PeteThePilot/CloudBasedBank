const { json } = require('express');
const mongoose = require('mongoose');

const transSchema = new mongoose.Schema(
    {
      account_from: {
        type: String,
        required: true,
        trim: true,
      },
      account_to: {
        type: String,
        required: true,
        trim: true,
      },
      money: {
        type: Number,
        required: true,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now 
      },
      username: {
        type: String,
        required: true,
        trim: true,
      },
      typeofuser: {
        type: String,
        required: true,
        trim: true,
      }
    },
    { collection: "transactions" }
);

module.exports = mongoose.model('transaction', transSchema);
