import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_API_KEY;

if (!url || !apiKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(url, apiKey);

export default supabase;