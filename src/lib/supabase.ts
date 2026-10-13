import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    // Server-side operations REQUIRE secret / service_role key to bypass RLS and prevent 42501 permission denied
    const supabaseKey =
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error(
            "[Supabase Critical Error] Cheia de server SUPABASE_SECRET_KEY sau SUPABASE_SERVICE_ROLE_KEY nu este configurată! Operațiunile administrative și comenzile sunt blocate pentru a preveni degradarea nesigură la anon key."
        );
        return null;
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
        },
    });
}
