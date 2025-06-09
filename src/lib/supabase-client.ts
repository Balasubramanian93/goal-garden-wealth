
import { createClient } from '@supabase/supabase-js';

// Use the proper Supabase URL and key from the project
const supabaseUrl = "https://niwoaxqveoliutdvatcu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pd29heHF2ZW9saXV0ZHZhdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzA5NTQsImV4cCI6MjA2MzM0Njk1NH0.SgFuFXvhsGexkXelPqA-BgQKoHlZiLqoa5PuQw_TezU";

// Create a client without strict typing to bypass corrupted types
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
