// ==========================================
// المحرك الأساسي الموحد (Production Optimized)
// ==========================================

const SUPABASE_URL = "https://uhhvdghvwmspxuuhpllc.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_zU1iBaERUa7KN71PBdbPdA_bRbzBdpm";

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let userCache = null;

async function getUserProfile() {
    try {
        const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
        if (authError || !user) return null;

        // 1. تشغيل دالة الفحص الأمني الذكي للتأكد من عدم انتهاء الـ 75 يوماً في الـ Database
        await window.supabaseClient.rpc('check_and_update_vip_status');

        // 2. جلب بيانات الحساب المحدثة والآمنة بعد الفحص
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;
        return profile;
    } catch (err) {
        console.error("خطأ أثناء جلب وإدارة صلاحية الحساب:", err);
        return null;
    }
}


// دالة تسجيل الخروج (تمت إضافتها لإصلاح العطل)
async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.href = "signin.html";
}

function updateUI(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = value;
}

document.addEventListener("DOMContentLoaded", async () => {
    const protectedPages = ["dashboard.html", "wallet.html", "withdraw.html", "tasks.html", "referrals.html", "profile.html", "vip.html"];
    
    if (protectedPages.some(page => window.location.pathname.includes(page))) {
        const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
        
        if (authError || !user) {
            window.location.href = "signin.html";
            return; 
        }
        
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
        if (profileError) {
            alert("⚠️ تنبيه أمني:\nتعذر جلب البيانات المالية.\nالسبب: " + profileError.message);
        }
    }
});
