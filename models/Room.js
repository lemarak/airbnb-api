const mongoose = require("mongoose");

const Room = mongoose.model("Room", {
  title: {
    type: String,
    required: "Le titre est obligatoire",
  },
  description: {
    type: String,
    required: "La description est obligatoire",
  },
  price: {
    type: Number,
    required: "Le prix est obligatoire",
  },
  location: {
    lat: {
      type: Number,
      required: "Latitude requise",
    },
    lng: {
      type: Number,
      required: "Longitude requise",
    },
  },
  photos: Array,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Room;
