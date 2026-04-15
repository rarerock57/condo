const SUPABASE_URL = 'https://fjvcqxqchluvmxnlvhwo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_LA_kOQbeNe7R-VS9J0IM0w__n9d8km_';

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
