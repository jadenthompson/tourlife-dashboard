import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jorntgixpsjetsyujjkl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvcm5..."
  // (If this gets cut off, I’ll resend the full one.)

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
