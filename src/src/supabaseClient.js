// /src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jorantgixpsjetsyujkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcmFudGdpeHBzamV0c3l1amtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjU0MjcsImV4cCI6MjA1ODc0MTQyN30.QxPmwjTHxUru_GBT_EbxzkhOg2RCE4-4a5X_l8Ul0SY';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);

