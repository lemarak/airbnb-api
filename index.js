const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ error: "Je suis perdu" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
