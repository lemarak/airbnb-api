const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
    required: "{PATH} is required!",
  },
  account: {
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
    photo: Object,
  },
  token: String,
  hash: String,
  salt: String,
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
});

module.exports = User;
