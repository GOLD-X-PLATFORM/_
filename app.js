// ==========================================
// GOLD X - المحرك الأساسي الموحد (Production Optimized)
// ==========================================

const SUPABASE_URL = "https://uhhvdghvwmspxuuhpllc.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_zU1iBaERUa7KN71PBdbPdA_bRbzBdpm";

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// مخزن مؤقت لبيانات المستخدم لتقليل عدد الاستعلامات
let userCache = null;

async function getUserProfile() {
    if (userCache) return userCache;
    
    const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
    
    if (authError || !user) {
        window.location.href = "signin.html";
        return null;
    }

    const { data: profile, error: profileError } = await window.supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error("خطأ في جلب الملف:", profileError);
        return null;
    }

    userCache = profile;
    return profile;
}

// دالة موحدة لتحديث واجهة المستخدم (UI)
function updateUI(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = value;
}

// حماية الصفحات
document.addEventListener("DOMContentLoaded", async () => {
    const protectedPages = ["dashboard.html", "wallet.html", "withdraw.html", "tasks.html", "referrals.html", "profile.html", "vip.html"];
    if (protectedPages.some(page => window.location.pathname.includes(page))) {
        const profile = await getUserProfile();
        if (!profile) window.location.href = "signin.html";
    }
});

async function handleLogout() {
    await window.supabaseClient.auth.signOut();
    window.location.href = "index.html";
}
