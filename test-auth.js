const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rjjsjxzoyxerztxxovjp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LtLhUq0cZNG-N49NXpUj2g_Lw9dPQo-';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function test() {
  console.log("Testing auth...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'eucalixtooficial1@gmail.com',
    password: 'wrongpassword' // Just to see if it reaches the service
  });
  console.log("Result:", data);
  console.log("Error:", error);
}

test();
