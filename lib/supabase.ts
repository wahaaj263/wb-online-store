import { createClient } from '@supabase/supabase-js'

// We are telling Next.js to grab the secure keys we just put in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates the connection to your database that we will use throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)