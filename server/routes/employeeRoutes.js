import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

/**
 * @route   GET /api/employees
 * @desc    Get all employees (any logged-in user)
 * @access  Private
 */
router.get("/", protect, getEmployees);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID (any logged-in user)
 * @access  Private
 */
router.get("/:id", protect, getEmployeeById);

/**
 * @route   POST /api/employees
 * @desc    Add a new employee (no admin, but use carefully)
 * @access  Private
 */
router.post("/", protect, createEmployee);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee (self only)
 * @access  Private
 */
router.put("/:id", protect, updateEmployee);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee (not recommended without admin, but allowed)
 * @access  Private
 */
router.delete("/:id", protect, deleteEmployee);

export default router;
