import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zewxinjatbyeelqcjntk.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpld3hpbmphdGJ5ZWVscWNqbnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTA2NTAsImV4cCI6MjA5NzEyNjY1MH0.FZVHhpStQZZvQDHaoyXdIGaHX-bNgfPak7CpKR-sELM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
