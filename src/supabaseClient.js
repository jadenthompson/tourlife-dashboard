// /src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jorantgjxpsjetsyujkl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcmFudGdpeHBzamV0c3l1amtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNjU0MjcsImV4cCI6MjA1ODc0MTQyN30.QxPmwjTHxUru_GBT_EbxzkhOg2RCE4-4a5X_l8Ul0SYy'; // I can help retrieve it if needed


const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
