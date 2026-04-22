function hasAcceptedPdpaConsent() {
  return localStorage.getItem("cookie_consent") === "accepted";
}

window.initRoleGuard = async function ({
  appId = 'app',
  allowedRoles = [],
  redirectIfNotAllowed = true,
  onReady = null
} = {}) {
  try {
    if (!hasAcceptedPdpaConsent()) {
      window.location.href = "../index.html";
      return;
    }

    if (typeof supabaseClient === 'undefined') {
      throw new Error('ระบบเชื่อมต่อฐานข้อมูลไม่สำเร็จ');
    }

    const { data: authData, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !authData?.user) {
      throw new Error('กรุณาเข้าสู่ระบบก่อนใช้งาน');
    }

    const userId = authData.user.id;

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('ไม่พบข้อมูลผู้ใช้ในระบบ');
    }

    if (profile.is_active === false) {
      await supabaseClient.auth.signOut();
      throw new Error('บัญชีนี้ถูกระงับการใช้งาน');
    }

    if (allowedRoles.length && !allowedRoles.includes(profile.role)) {
      if (redirectIfNotAllowed) {
        const target =
          window.ROLE_HOME?.[profile.role] ||
          window.DEFAULT_HOME ||
          '../auth/login.html';

        window.location.href = target;
        return;
      }

      throw new Error('บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานหน้านี้');
    }

    document.getElementById('loadingScreen')?.classList.add('hidden');
    document.getElementById('errorScreen')?.classList.add('hidden');
    document.getElementById(appId)?.classList.remove('hidden');

    if (typeof onReady === 'function') {
      onReady(profile, authData.user);
    }
  } catch (err) {
    console.error('AuthGuard:', err);

    document.getElementById('loadingScreen')?.classList.add('hidden');
    document.getElementById(appId)?.classList.add('hidden');

    const errorText = document.getElementById('errorText');
    if (errorText) {
      errorText.textContent = err.message || 'เกิดข้อผิดพลาด';
    }

    document.getElementById('errorScreen')?.classList.remove('hidden');
  }
};
