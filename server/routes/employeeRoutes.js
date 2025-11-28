import express from "express";
import Employee from "../models/Employee.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/employees
 * @desc    Get all employees (any logged-in user)
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID (any logged-in user)
 * @access  Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

/**
 * @route   POST /api/employees
 * @desc    Add a new employee (no admin, but use carefully)
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const { name, department, birthday, avatar, employeeId, email, password, role } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const newEmployee = await Employee.create({
      name,
      department,
      birthday,
      avatar,
      employeeId,
      email,
      password,
      role: "employee"
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department
      },
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee (self only)
 * @access  Private
 */
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: "Not authorized - only your own profile can be updated" });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    Object.assign(employee, req.body);
    const updatedEmployee = await employee.save();

    res.json({
      message: "Employee updated successfully",
      employee: {
        id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        department: updatedEmployee.department
      },
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee (not recommended without admin, but allowed)
 * @access  Private
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    await employee.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

export default router;
