import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import supabase from "../config/supabaseClient.js";
import { mapEmployeeFromDB, mapEmployeesFromDB } from "../utils/employeeMapper.js";

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

    const normalizedEmail = email?.toLowerCase();

    const { data: existing, error: existingError } = await supabase
      .from("employees")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingError) {
      return res.status(500).json({ message: existingError.message });
    }

    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: employee, error: insertError } = await supabase
      .from("employees")
      .insert([
        {
          name,
          employee_id: employeeId,
          email: normalizedEmail,
          password: hashedPassword,
          department,
        },
      ])
      .select("*")
      .single();

    if (insertError) {
      return res.status(500).json({ message: insertError.message });
    }

    res.status(201).json({
      token: generateToken(employee.id),
      user: mapEmployeeFromDB(employee),
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

    const normalizedEmail = email?.toLowerCase();

    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (employeeError) {
      return res.status(500).json({ message: employeeError.message });
    }

    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employee.password ?? "");
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(employee.id),
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employee_id,
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
    const { data: employees, error } = await supabase
      .from("employees")
      .select(
        "id, employee_id, name, email, department, birthday, avatar, role, created_at, updated_at"
      );

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(mapEmployeesFromDB(employees));
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
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (employeeError) {
      return res.status(500).json({ message: employeeError.message });
    }

    if (!employee) return res.status(404).json({ message: "Email not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from("employees")
      .update({
        reset_code: resetCode,
        reset_code_expiry: resetCodeExpiry,
      })
      .eq("email", normalizedEmail);

    if (updateError) {
      return res.status(500).json({ message: updateError.message });
    }

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

    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("reset_code, reset_code_expiry")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (employeeError) {
      return res.status(500).json({ message: employeeError.message });
    }

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const expiryMs = employee.reset_code_expiry
      ? new Date(employee.reset_code_expiry).getTime()
      : 0;
    if (employee.reset_code !== code || Date.now() > expiryMs) {
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

    const normalizedEmail = email.toLowerCase();

    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("reset_code, reset_code_expiry")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (employeeError) {
      return res.status(500).json({ message: employeeError.message });
    }

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const expiryMs = employee.reset_code_expiry
      ? new Date(employee.reset_code_expiry).getTime()
      : 0;
    if (employee.reset_code !== code || Date.now() > expiryMs) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("employees")
      .update({
        password: hashedPassword,
        reset_code: null,
        reset_code_expiry: null,
      })
      .eq("email", normalizedEmail);

    if (updateError) {
      return res.status(500).json({ message: updateError.message });
    }

    res.json({ success: true, message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
