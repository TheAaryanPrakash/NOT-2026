// One-off: set the demo account's password directly via the Supabase admin API.
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=xxx DEMO_EMAIL=aaryan.sprakash@gmail.com NEW_PASSWORD=xxx node scripts/reset-demo-password.js
//
// Reads REACT_APP_SUPABASE_URL from .env (already present). Never commit the
// service role key — pass it inline on the command line, it is not stored anywhere.

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.DEMO_EMAIL;
const newPassword = process.env.NEW_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !email || !newPassword) {
  console.error(
    "Missing required env vars. Need SUPABASE_SERVICE_ROLE_KEY, DEMO_EMAIL, NEW_PASSWORD (REACT_APP_SUPABASE_URL comes from .env)."
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  let userId;
  let page = 1;

  while (!userId) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((u) => u.email === email);
    if (found) {
      userId = found.id;
      break;
    }
    if (data.users.length < 1000) break;
    page += 1;
  }

  if (!userId) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (updateError) throw updateError;

  console.log(`Password updated for ${email} (user id: ${userId}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
