// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://niwoaxqveoliutdvatcu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pd29heHF2ZW9saXV0ZHZhdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzA5NTQsImV4cCI6MjA2MzM0Njk1NH0.SgFuFXvhsGexkXelPqA-BgQKoHlZiLqoa5PuQw_TezU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);