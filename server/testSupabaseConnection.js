import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("\n=== SUPABASE CONNECTION TEST ===\n");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  console.log("SUPABASE_URL:", supabaseUrl ? "✓ Found" : "✗ Missing");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✓ Found" : "✗ Missing");
  process.exit(1);
}

console.log("✓ Environment variables loaded");
console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_KEY:", supabaseKey.substring(0, 20) + "...");

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("\n--- Testing Connection ---\n");

async function testConnection() {
  try {
    // Test 1: Check if employees table exists
    console.log("Test 1: Checking employees table...");
    const { data, error, count } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: false })
      .limit(1);

    if (error) {
      console.error("❌ Error accessing employees table:", error.message);
      return false;
    }

    console.log("✓ Successfully connected to employees table");
    console.log(`✓ Table accessible (found ${count !== null ? count : 'unknown'} records)`);

    // Test 2: Try to fetch all employees
    console.log("\nTest 2: Fetching all employees...");
    const { data: allEmployees, error: fetchError } = await supabase
      .from("employees")
      .select("id, name, email, department, role");

    if (fetchError) {
      console.error("❌ Error fetching employees:", fetchError.message);
      return false;
    }

    console.log(`✓ Successfully fetched ${allEmployees.length} employees`);
    
    if (allEmployees.length > 0) {
      console.log("\nSample employee data:");
      allEmployees.slice(0, 3).forEach((emp, idx) => {
        console.log(`  ${idx + 1}. ${emp.name} (${emp.email}) - ${emp.department || 'No dept'}`);
      });
    } else {
      console.log("⚠ No employees found in database");
    }

    // Test 3: Check table structure
    console.log("\nTest 3: Verifying table structure...");
    const { data: structureTest, error: structureError } = await supabase
      .from("employees")
      .select("id, employee_id, name, email, password, department, birthday, avatar, role, reset_code, reset_code_expiry, created_at, updated_at")
      .limit(0);

    if (structureError) {
      console.error("❌ Table structure issue:", structureError.message);
      return false;
    }

    console.log("✓ Table structure verified - all columns accessible");

    console.log("\n=== ✓ ALL TESTS PASSED ===\n");
    console.log("Supabase is connected and working properly!");
    return true;

  } catch (err) {
    console.error("\n❌ Unexpected error:", err.message);
    return false;
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
