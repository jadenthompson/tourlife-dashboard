// /src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txmiixuztmcwocudavjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bWlpeHV6dG1jd29jdWRhdmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjQzNjYsImV4cCI6MjA1OTA0MDM2Nn0.s2ugf8cn8YcbFp5SITGpTP0-8Ssr-DiiFEnJYqzoojc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
