
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://goucqtoqpxkuhkyjddpg.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdWNxdG9xcHhrdWhreWpkZHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDU5MjQsImV4cCI6MjA2NTU4MTkyNH0.L87XvdOauQ14L9O6y3xifwyQ1b6gyxqD92aosJP90MQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
