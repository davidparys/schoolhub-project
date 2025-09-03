import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const config = useRuntimeConfig()

const supabaseUrl = config.supabaseUrl
const supabaseKey = config.supabaseAnonKey

console.log('🔧 Supabase Configuration:');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Database row types
export type StudentRow = Database['public']['Tables']['students']['Row']
export type ClassRow = Database['public']['Tables']['classes']['Row']
export type ClassAssignmentRow = Database['public']['Tables']['class_assignments']['Row']

// Insert types
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type ClassInsert = Database['public']['Tables']['classes']['Insert']
export type ClassAssignmentInsert = Database['public']['Tables']['class_assignments']['Insert']

// Update types
export type StudentUpdate = Database['public']['Tables']['students']['Update']
export type ClassUpdate = Database['public']['Tables']['classes']['Update']
