const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();

// import Model User
const User = require("../models/User");

// Signup
router.post("/user/sign_up", async (req, res) => {
  console.log("Je passe dans la route user/sign_up");
  try {
    // get body values
    const { email, password, username, name, description } = req.fields;
    if (!password) {
      return res.status(200).json({
        message: "Le mot de passe est obligatoire.",
      });
    }
    if (
      await User.findOne({ $or: [{ email: email }, { username: username }] })
    ) {
      return res.status(200).json({
        message: "Email et/ou Utilisateur existent déjà dans notre base",
      });
    }

    // create salt
    const salt = uid2(16);
    // create hash
    const hash = SHA256(salt + password).toString(encBase64);
    // create token
    const token = uid2(64);

    // save User
    const newUser = new User({
      email,
      username,
      name,
      description,
      token,
      hash,
      salt,
    });
    await newUser.save();

    // Display
    const result = {
      _id: newUser.id,
      token: newUser.token,
      email: newUser.email,
      username: newUser.username,
      description: newUser.description,
      name: newUser.name,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/user/log_in", async (req, res) => {
  console.log("Je passe dans la route user/sign_in");
  try {
    const { email, password } = req.fields;
    if (!email || !password) {
      return res.status(401).json("missing parameters");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json("email non reconnu");
    }
    const newHash = SHA256(user.salt + password).toString(encBase64);
    if (newHash !== user.hash) {
      return res.status(401).json("Mot de passe invalide !");
    }
    const result = {
      _id: user.id,
      token: user.token,
      email: user.email,
      username: user.username,
      description: user.description,
      name: user.name,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// export
module.exports = router;
