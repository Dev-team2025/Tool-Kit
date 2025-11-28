import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyCode,
  resetPassword,
  getUsers,
} from "../controllers/authController.js";

const router = express.Router();

// ====================== AUTH ROUTES ======================
router.post("/register", register);          // Create new employee
router.post("/login", login);                // Employee login

// ====================== PASSWORD RESET FLOW ======================
router.post("/forgot-password", forgotPassword);  // Send 6-digit code
router.post("/verify-code", verifyCode);          // Verify OTP
router.post("/reset-password", resetPassword);    // Reset password

// ====================== EMPLOYEE ROUTES ======================
router.get("/users", getUsers);              // Get all employees (no password)

export default router;
