import { createBrowserClient } from '@supabase/ssr'

// Đọc thông tin kết nối từ file .env.local (xem README.md để biết cách lấy)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export type Product = {
  id: string
  name: string
  brand: string
  price: number
  old_price: number | null
  image_url: string
  cpu: string
  ram: string
  storage: string
  gpu: string
  screen: string
  description: string
  stock: number
  featured: boolean
  created_at: string
}
