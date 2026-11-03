import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://bodijyjnkejirjxoboqf.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZGlqeWpua2VqaXJqeG9ib3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2ODI4OTgsImV4cCI6MjEwOTI1ODg5OH0.DXcfrxb5Nh_L1iXneGd83d-GZZgtoEWGNNvqbbuTZgw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
