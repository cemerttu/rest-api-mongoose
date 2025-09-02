// models/User.js
const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },          // required string
  email: { type: String, required: true, unique: true }, // must be unique
  age: { type: Number, default: 18 },              // default = 18
  createdAt: { type: Date, default: Date.now }     // auto timestamp
});

// Export model
module.exports = mongoose.model("User", userSchema);
