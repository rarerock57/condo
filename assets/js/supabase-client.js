// แก้ในไฟล์ assets/js/supabase-client.js ให้ใช้โปรเจกต์ใหม่ตัวนี้นะครับ 🚀
const SUPABASE_URL = 'https://ebmhyjzbfgqppcenvstw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_tGetlUKft2kLbjOsHliWrQ_bnGDD7XY';

if (!window.supabase) {
  console.error('❌ Supabase library โหลดไม่สำเร็จ');
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

console.log('✅ Supabase connected');
