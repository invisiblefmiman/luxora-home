import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ratelimit";

function checkAdminAuth(request: Request): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.trim() === "") {
        console.error("[Securitate Admin] ADMIN_PASSWORD nu este configurat in mediul de rulare.");
        return false;
    }
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") || "";

    if (authHeader === `Bearer ${adminPassword}`) {
        return true;
    }

    if (cookieHeader.includes(`luxora_admin_token=${adminPassword}`)) {
        return true;
    }

    return false;
}

export async function GET(request: Request) {
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = (forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")) || "127.0.0.1";

    const rateLimitRes = await checkRateLimit(`admin-${clientIp}`, 10, 60000);
    if (!rateLimitRes.success) {
        return NextResponse.json({ success: false, error: "Prea multe încercări. Așteptați un minut." }, { status: 429 });
    }

    if (!checkAdminAuth(request)) {
        return NextResponse.json({ success: false, error: "Neautorizat. Parolă admin incorectă." }, { status: 401 });
    }

    try {
        const supabase = getSupabaseServerClient();
        if (!supabase) {
            return NextResponse.json({ success: false, error: "Supabase nu este configurat." }, { status: 500 });
        }

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Eroare preluare comenzi admin:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, orders: data || [] });
    } catch (err) {
        console.error("Eroare API Admin GET Orders:", err);
        return NextResponse.json({ success: false, error: "Eroare internă server." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    if (!checkAdminAuth(request)) {
        return NextResponse.json({ success: false, error: "Neautorizat." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, status, awbNumber, carrierName, invoiceNumber } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID comandă lipsă." }, { status: 400 });
        }

        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (awbNumber !== undefined) updateData.awb_number = awbNumber;
        if (carrierName !== undefined) updateData.carrier_name = carrierName;
        if (invoiceNumber !== undefined) updateData.invoice_number = invoiceNumber;

        const supabase = getSupabaseServerClient();
        if (!supabase) {
            return NextResponse.json({ success: false, error: "Supabase nu este configurat." }, { status: 500 });
        }

        const { error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", id);

        if (error) {
            console.error("Eroare actualizare comandă admin:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Comandă actualizată cu succes." });
    } catch (err) {
        console.error("Eroare API Admin PATCH Order:", err);
        return NextResponse.json({ success: false, error: "Eroare internă server." }, { status: 500 });
    }
}
