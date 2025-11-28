

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config(); 

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED");
 // Load environment variables BEFORE anything else

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// --------------------
// MongoDB Connection
// --------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Dlithe_Toolkit";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err)
  );

