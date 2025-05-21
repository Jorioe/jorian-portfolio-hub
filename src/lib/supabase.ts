import { createClient } from '@supabase/supabase-js';

// Gebruik fallback waarden voor development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Verwijder de error throw zodat de app niet crasht tijdens development
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase credentials');
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Media storage bucket name
export const STORAGE_BUCKET = 'media';

// Helper function to get a public URL for a file
export const getPublicUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}; 