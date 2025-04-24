import { createClient } from '@supabase/supabase-js';

// Gebruik fallback waarden voor development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Verwijder de error throw zodat de app niet crasht tijdens development
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase credentials');
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 