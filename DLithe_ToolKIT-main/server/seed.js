const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');


dotenv.config();

const employees = [
  { name: "Arun Rajpurohit", birthday: "10-29", department: "Director & Co-Founder" },
  { name: "Sridhar Murthy", birthday: "11-05", department: "Director & Co-Founder" },
  { name: "Vijay G H", birthday: "01-29", department: "Head of Technology" },
  { name: "Dhanya", birthday: "07-23", department: "Customer Success Lead" },
  { name: "Archana S Mugali", birthday: "05-30", department: "Senior Software Engineer" },
  { name: "Madhu Sudhan", birthday: "10-13", department: "Embedded System Engineer" },
  { name: "Kaveri Bammanakatti", birthday: "09-11", department: "Software Engineer" },
  { name: "Harshith", birthday: "07-10", department: "Embedded Engineer" },
  { name: "Anjali Mishra", birthday: "07-26", department: "Training Assistant Manager - India" },
  { name: "Sahana B Ilager", birthday: "01-29", department: "Embedded Engineer" },
  { name: "Sushma I Sangolli", birthday: "07-15", department: "Software Engineer" },
  { name: "Shreya V", birthday: "12-14", department: "Training Assistant Manager - Global" },
];

// Add avatar initials dynamically
const employeesWithAvatar = employees.map(emp => {
  const parts = emp.name.trim().split(/\s+/);
  let avatar = parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return { ...emp, avatar };
});

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Employee.deleteMany({});
    await Employee.insertMany(employeesWithAvatar);
    console.log('✅ Employee database seeded successfully with avatars!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedDB();
