// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const authRouter = require("./routes/auth");
const contactRouter = require("./routes/contact");
const cakemakerRouter = require("./routes/cakemaker");
const bakerRouter = require('./routes/baker');

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === API Routes ===
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/cakemaker", cakemakerRouter);
app.use("/api/baker" , bakerRouter);


// === Default Route ===
app.get('/', (req, res) => {
  res.send("🍰 CakeConnect API is running");
});

// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);

  });
})
.catch((err) => {
  console.log("❌ MongoDB Connection Error:", err.message);
});