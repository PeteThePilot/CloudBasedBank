const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
      },
      accountnum: {
        type: String,
        required: true,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now 
      },
      typeofuser: {
        type: String,
        required: true,
        trim: true,
      },
      nameofuserWhoSubmittedit: {
        type: String,
        required: true,
        trim: true,
      }
    },
    { collection: "deposits" }
);

module.exports = mongoose.model('deposits', DepositSchema);
