const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { types: String, required: true },
  email: { types: String, required: true, unique: true },
  password: { types: String },
  country: { types: String },
  resetPasswordToken: { types: String },
  resetPasswordTokenExpiry: { Date },
});

module.exports = mongoose.model("User", userSchema);
