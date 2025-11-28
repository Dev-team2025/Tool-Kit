import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

// ================================
// Generate JWT
// ================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ================================
// Email Transporter
// ================================
console.log("\n=== EMAIL CONFIG ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED");
console.log("===================\n");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================================
// REGISTER Employee
// ================================
export const register = async (req, res) => {
  try {
    const { name, employeeId, email, password, department } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existing = await Employee.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Employee already exists" });

    const employee = await Employee.create({
      name,
      employeeId,
      email: normalizedEmail,
      password, // Model pre-save hook will hash
      department,
    });

    res.status(201).json({
      token: generateToken(employee._id),
      user: employee,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// LOGIN Employee
// ================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const employee = await Employee.findOne({ email: normalizedEmail });

    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(employee._id),
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        birthday: employee.birthday,
        avatar: employee.avatar,
        role: employee.role,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// GET All Employees
// ================================
export const getUsers = async (req, res) => {
  try {
    const employees = await Employee.find().select(
      "-password -resetCode -resetCodeExpiry"
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// FORGOT PASSWORD - SEND OTP
// ================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const normalizedEmail = email.toLowerCase().trim();
    const employee = await Employee.findOne({ email: normalizedEmail });

    if (!employee) return res.status(404).json({ message: "Email not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    employee.resetCode = resetCode;
    employee.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
    await employee.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: employee.email,
        subject: "DLithe ToolKit – Password Reset Code",
        text: `Your reset code is ${resetCode}. It expires in 10 minutes.`,
      });

      console.log("✉️ OTP sent to:", employee.email);
    } catch (err) {
      console.error("❌ Email send failed:", err);
      return res.status(502).json({ message: "Failed to send email" });
    }

    res.json({ success: true, message: "Reset code sent" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// VERIFY OTP
// ================================
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const employee = await Employee.findOne({ email: email.toLowerCase() });

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    if (employee.resetCode !== code || Date.now() > employee.resetCodeExpiry) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.json({ success: true, message: "Code verified" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// RESET PASSWORD
// ================================
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const employee = await Employee.findOne({ email: email.toLowerCase() });

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    if (employee.resetCode !== code || Date.now() > employee.resetCodeExpiry) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    employee.password = newPassword;  // 🔥 do NOT hash here — model hook will hash correctly
    employee.resetCode = null;
    employee.resetCodeExpiry = null;

    await employee.save();

    res.json({ success: true, message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
