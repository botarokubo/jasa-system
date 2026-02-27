const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "JASA backend running 🚀" });
});

async function start() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing in .env");
      }
  
      await mongoose.connect(process.env.MONGODB_URI, {
        family: 4
      });
  
      console.log("✅ MongoDB connected");
  
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () =>
        console.log("✅ Server running on port " + PORT)
      );
    } catch (err) {
      console.error("❌ Startup error:", err.message);
      process.exit(1);
    }
  }

start();