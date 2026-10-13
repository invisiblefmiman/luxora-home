import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    // Prefer SUPABASE_SECRET_KEY (new Supabase standard) or fallback to legacy SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY / SUPABASE_PUBLISHABLE_KEY
    const supabaseKey =
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return null;
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
        },
    });
}
