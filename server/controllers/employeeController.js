import bcrypt from "bcryptjs";
import supabase from "../config/supabaseClient.js";
import { mapEmployeeFromDB, mapEmployeesFromDB } from "../utils/employeeMapper.js";
import { mapEmployeeToDB } from "../utils/employeeInputMapper.js";

const EMPLOYEE_SELECT_NO_PASSWORD =
  "id, employee_id, name, email, department, birthday, avatar, role, reset_code, reset_code_expiry, created_at, updated_at";

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const { data: employees, error } = await supabase
      .from("employees")
      .select(EMPLOYEE_SELECT_NO_PASSWORD);

    if (error) {
      console.error("Error fetching employees:", error);
      return res.status(500).json({ error: "Failed to fetch employees" });
    }

    return res.json(mapEmployeesFromDB(employees));
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// GET /api/employees/:id
export const getEmployeeById = async (req, res) => {
  try {
    const { data: employee, error } = await supabase
      .from("employees")
      .select(EMPLOYEE_SELECT_NO_PASSWORD)
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching employee:", error);
      return res.status(500).json({ error: "Failed to fetch employee" });
    }

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.json(mapEmployeeFromDB(employee));
  } catch (err) {
    console.error("Error fetching employee:", err);
    return res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const { name, department, birthday, avatar, employeeId, email, password } =
      req.body;

    const normalizedEmail = email?.toLowerCase();

    const { data: exists, error: existsError } = await supabase
      .from("employees")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existsError) {
      console.error("Error creating employee:", existsError);
      return res.status(500).json({ error: "Failed to create employee" });
    }

    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const employeeData = mapEmployeeToDB({
      name,
      department,
      birthday,
      avatar,
      employeeId,
      email: normalizedEmail,
      role: "employee",
    });

    if (password) {
      employeeData.password = await bcrypt.hash(password, 10);
    }

    const { data: newEmployee, error: insertError } = await supabase
      .from("employees")
      .insert([employeeData])
      .select("id, name, email, department")
      .single();

    if (insertError) {
      console.error("Error creating employee:", insertError);
      return res.status(500).json({ error: "Failed to create employee" });
    }

    return res.status(201).json({
      message: "Employee created successfully",
      employee: {
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
      },
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    return res.status(500).json({ error: "Failed to create employee" });
  }
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    if (req.user?._id?.toString() !== req.params.id) {
      return res.status(403).json({
        error: "Not authorized - only your own profile can be updated",
      });
    }

    const { data: existing, error: existingError } = await supabase
      .from("employees")
      .select("id")
      .eq("id", req.params.id)
      .maybeSingle();

    if (existingError) {
      console.error("Error updating employee:", existingError);
      return res.status(500).json({ error: "Failed to update employee" });
    }

    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const updateData = mapEmployeeToDB(req.body);

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { data: updatedEmployee, error: updateError } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", req.params.id)
      .select("id, name, email, department")
      .single();

    if (updateError) {
      console.error("Error updating employee:", updateError);
      return res.status(500).json({ error: "Failed to update employee" });
    }

    return res.json({
      message: "Employee updated successfully",
      employee: {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        department: updatedEmployee.department,
      },
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    return res.status(500).json({ error: "Failed to update employee" });
  }
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id")
      .eq("id", req.params.id)
      .maybeSingle();

    if (employeeError) {
      console.error("Error deleting employee:", employeeError);
      return res.status(500).json({ error: "Failed to delete employee" });
    }

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { error: deleteError } = await supabase
      .from("employees")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) {
      console.error("Error deleting employee:", deleteError);
      return res.status(500).json({ error: "Failed to delete employee" });
    }

    return res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res.status(500).json({ error: "Failed to delete employee" });
  }
};
