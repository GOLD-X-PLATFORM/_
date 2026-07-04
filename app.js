// ==========================================
// GOLD X - ملف الربط البرمجي الأساسي الموحد
// ==========================================

// تم تركيب بيانات مشروعك النهائية والكاملة بنجاح
const SUPABASE_URL = "https://uhhvdghvwmspxuuhpllc.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_zU1iBaERUa7KN71PBdbPdA_bRbzBdpm";

// تهيئة كائن السوبابيس ليصبح متاحاً في جميع الصفحات التي تستدعي app.js
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * دالة عالمية مصلحة لجلب بيانات الحساب الحالي (الملف المالي والرتبة)
 * تستخدم في واجهات: dashboard, wallet, withdraw, tasks
 */
async function getUserProfile() {
    try {
        // التحقق من وجود مستخدم مسجل دخول حالياً
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.log("لم يتم العثور على جلسة نشطة، تحويل إلى صفحة تسجيل الدخول...");
            window.location.href = "signin.html";
            return null;
        }

        // جلب البيانات المالية والرتبة من جدول الـ profiles مفرزة بالـ ID الخاص بالمستخدم
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        return profile;

    } catch (error) {
        console.error("خطأ أثناء جلب بيانات الملف الشخصي:", error.message);
        return null;
    }
}

/**
 * دالة تسجيل الخروج العالمية والمصلحة بنسبة 100%
 * تقوم بإنهاء الجلسة وتوجيه المستخدم فوراً إلى الصفحة الترحيبية الخارجية لمنع الدخول العشوائي
 */
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        alert("تم تسجيل الخروج بنجاح من منصة GOLD X. في أمان الله!");
        window.location.href = "index.html";
    } catch (error) {
        alert("حدث خطأ أثناء محاولة تسجيل الخروج: " + error.message);
    }
}

// قفل حماية تلقائي: منع المستخدم غير المسجل من تصفح لوحات التحكم الداخلية
document.addEventListener("DOMContentLoaded", async () => {
    const currentPath = window.location.pathname;
    
    // الصفحات المحمية التي تتطلب تسجيل دخول مسبق
    const protectedPages = ["dashboard.html", "wallet.html", "withdraw.html", "tasks.html", "referrals.html", "profile.html", "vip.html"];
    
    const isProtected = protectedPages.some(page => currentPath.includes(page));
    
    if (isProtected) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = "signin.html";
        }
    }
});
