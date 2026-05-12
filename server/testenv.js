import "dotenv/config";
import supabase from "./config/supabaseClient.js";

async function testConnection() {
  const { data, error } = await supabase.from("employees").select("id").limit(1);

  if (error) {
    console.error("Supabase connection failed:", error.message);
    process.exit(1);
  }

  console.log("Supabase connected successfully");
  console.log("Sample row:", data?.[0] ?? null);
}

testConnection();
