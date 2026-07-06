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

// حماية الصفحات المطور - كاشف الأخطاء الذكي
document.addEventListener("DOMContentLoaded", async () => {
    const protectedPages = ["dashboard.html", "wallet.html", "withdraw.html", "tasks.html", "referrals.html", "profile.html", "vip.html"];
    
    if (protectedPages.some(page => window.location.pathname.includes(page))) {
        // 1. التحقق من وجود حساب مسجل أولاً (هذا فقط ما يحدد الطرد لصفحة تسجيل الدخول)
        const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
        
        if (authError || !user) {
            console.log("لا توجد جلسة نشطة، تحويل إلى تسجيل الدخول.");
            window.location.href = "signin.html";
            return; // إنهاء التنفيذ هنا
        }
        
        // 2. إذا كان المستخدم مسجلاً، نحاول جلب بيانات البروفايل الخاص به
        const { data: profile, error: profileError } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
        if (profileError) {
            console.error("خطأ في قاعدة البيانات:", profileError.message);
            // إظهار تنبيه يشرح الثغرة أو المشكلة في قاعدة البيانات بدلاً من الطرد العشوائي
            alert("⚠️ تنبيه أمني من قاعدة البيانات:\n" + 
                  "أنت مسجل دخول بنجاح، ولكن فشلنا في جلب بياناتك الممالية.\n" + 
                  "السبب: " + profileError.message);
        }
    }
});
