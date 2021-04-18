const express = require("express");

const Room = require("../models/Room");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/room/publish", isAuthenticated, async (req, res) => {
  console.log("Je passe dans la route room/publish");
  try {
    const { title, description, price, location } = req.fields;
    const user = req.user;
    const room = new Room({
      title,
      description,
      price,
      location,
      user,
    });
    await room.save();

    user.rooms.push(room.id);
    await user.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/rooms", async (req, res) => {
  console.log("Je passe dans la route rooms");
  try {
    let rooms = await Room.find()
      .select("-description")
      .populate("user", "account.username");
    if (rooms.length > 0) {
      res.status(200).json(rooms);
    } else {
      res.status(200).json("Pas d'annonce");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/room/update/:id", isAuthenticated, async (req, res) => {
  console.log(`Je passe dans la route room/update/${req.params.id}`);
  try {
    const { title, price, description, location } = req.fields;
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json("Pas d'annonce");
    }
    const userId = req.user.id;
    const roomUserId = room.user;
    if (String(userId) !== String(roomUserId)) {
      return res.status(401).json("Pas autorisé");
    }
    if (title || price || description || location) {
      if (title) {
        room.title = title;
      }
      if (price) {
        room.price = Number(price);
      }
      if (description) {
        room.description = description;
      }
      if (location) {
        room.location.lat = Number(location.lat);
        room.location.lng = Number(location.lng);
      }
      await room.save();
      res.status(200).json(room);
    } else {
      res.status(400).json("Missing parameters");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/room/delete/:id", isAuthenticated, async (req, res) => {
  console.log(`Je passe dans la route room/delete/${req.params.id}`);
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json("Pas d'annonce");
    }
    const userId = req.user.id;
    const roomUserId = room.user;
    if (String(userId) !== String(roomUserId)) {
      return res.status(401).json("Pas autorisé");
    }

    const user = await User.findById(userId);
    const arr = user.rooms;
    const idRoom = arr.indexOf(req.params.id);

    arr.splice(idRoom, 1);

    await User.findByIdAndUpdate(user.id, { rooms: arr });
    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json(`room ${req.params.id} deleted`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/rooms/:id", async (req, res) => {
  console.log(`Je passe dans la route rooms/${req.params.id}`);
  try {
    const room = await Room.findById(req.params.id).populate(
      "user",
      "-hash -salt"
    );
    if (room) {
      console.log(room);
      res.status(200).json(room);
    } else {
      res.status(404).json("Pas d'annonce correspondante");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
