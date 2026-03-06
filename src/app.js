const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./database/connection");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API rodando!");
});

module.exports = app;
