import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  department: String,
  birthday: String,
  avatar: String,
  role: { type: String, default: "employee" },

  resetCode: String,
  resetCodeExpiry: Date,
});

// Hash password BEFORE saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// Compare passwords during login
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Employee", employeeSchema);
