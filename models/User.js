const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
    required: "{PATH} is required!",
  },
  username: {
    unique: true,
    type: String,
    required: "{PATH} is required!",
  },
  name: {
    type: String,
    required: "{PATH} is required!",
  },
  description: {
    type: String,
    required: "{PATH} is required!",
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
