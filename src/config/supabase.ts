import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgpwsuyfraqihlsahpge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncHdzdXlmcmFxaWhsc2FocGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Mzg2NjEsImV4cCI6MjA3NzUxNDY2MX0.Bisl3N1bkjgBnRNgWpEnJ-z3ZFCVR4UVQxPUcHb0I90';

export const supabase = createClient(supabaseUrl, supabaseKey);