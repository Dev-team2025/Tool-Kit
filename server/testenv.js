import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';

// Load environment variables
dotenv.config();

// Debug log
console.log('🧩 MONGO_URI from .env:', process.env.MONGO_URI ? 'Loaded ✅' : '❌ Not Found');
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing. Please check your .env file.');
  process.exit(1);
}

// Employee data
const employees = [
  { name: "Arun Rajpurohit", email: "arun@dlithe.com", employeeId: "EMP001", password: "password", birthday: "10-29", department: "Director & Co-Founder" },
  { name: "Sridhar Murthy", email: "sridhar@dlithe.com", employeeId: "EMP002", password: "password", birthday: "11-05", department: "Director & Co-Founder" },
  { name: "Vijay G H", email: "vijay@dlithe.com", employeeId: "EMP003", password: "password", birthday: "01-29", department: "Head of Technology" },
  { name: "Dhanya", email: "dhanya@dlithe.com", employeeId: "EMP004", password: "password", birthday: "07-23", department: "Customer Success Lead" },
  { name: "Archana S Mugali", email: "archana@dlithe.com", employeeId: "EMP005", password: "password", birthday: "05-30", department: "Senior Software Engineer" },
  { name: "Madhu Sudhan", email: "madhu@dlithe.com", employeeId: "EMP006", password: "password", birthday: "10-13", department: "Embedded System Engineer" },
  { name: "Kaveri Bammanakatti", email: "kaveri@dlithe.com", employeeId: "EMP007", password: "password", birthday: "09-11", department: "Software Engineer" },
  { name: "Harshith", email: "harshith@dlithe.com", employeeId: "EMP008", password: "password", birthday: "07-10", department: "Embedded Engineer" },
  { name: "Anjali Mishra", email: "anjali@dlithe.com", employeeId: "EMP009", password: "password", birthday: "07-26", department: "Training Assistant Manager - India" },
  { name: "Sahana B Ilager", email: "sahana@dlithe.com", employeeId: "EMP010", password: "password", birthday: "01-29", department: "Embedded Engineer" },
  { name: "Sushma I Sangolli", email: "sushma@dlithe.com", employeeId: "EMP011", password: "password", birthday: "07-15", department: "Software Engineer" },
  { name: "Shreya V", email: "shreya@dlithe.com", employeeId: "EMP012", password: "password", birthday: "12-14", department: "Training Assistant Manager - Global" },
];

// Add avatar initials dynamically
const employeesWithAvatar = employees.map(emp => {
  const parts = emp.name.trim().split(/\s+/);
  const avatar = parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return { ...emp, avatar };
});

// Seeder function
async function seedDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Employee.deleteMany({});
    await Employee.insertMany(employeesWithAvatar);

    console.log('✅ Employee database seeded successfully with avatars and login credentials!');
    console.log('➡️ Default password for all users: "password"');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedDB();
