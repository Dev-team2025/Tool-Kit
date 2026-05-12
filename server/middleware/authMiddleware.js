import jwt from "jsonwebtoken";
import supabase from "../config/supabaseClient.js";
import { mapEmployeeFromDB } from "../utils/employeeMapper.js";

// PROTECT ROUTE (requires token)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { data: user, error } = await supabase
        .from("employees")
        .select(
          "id, employee_id, name, email, department, birthday, avatar, role, created_at, updated_at"
        )
        .eq("id", decoded.id)
        .maybeSingle();

      if (error) {
        console.error("Token error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.user = mapEmployeeFromDB(user);

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      return next();
    } catch (err) {
      console.error("Token error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  return res.status(401).json({ message: "No token provided" });
};

// ADMIN ONLY (role-based)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied: Admins only" });
};
