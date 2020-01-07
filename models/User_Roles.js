const mongoose = require("mongoose");

const userroleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    default: "basic"
  }
});

module.exports = userRoles = mongoose.model("userRoles", userroleSchema);
