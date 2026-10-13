import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { createSamedayAWB } from "@/lib/courier/sameday";
import { OrderRecord } from "@/types/order";

function checkAdminAuth(request: Request): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.trim() === "") return false;
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") || "";

    if (authHeader === `Bearer ${adminPassword}`) return true;
    if (cookieHeader.includes(`luxora_admin_token=${adminPassword}`)) return true;
    return false;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!checkAdminAuth(request)) {
        return NextResponse.json({ success: false, error: "Neautorizat." }, { status: 401 });
    }

    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, error: "ID comandă lipsă." }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();
        if (!supabase) {
            return NextResponse.json({ success: false, error: "Supabase nu este configurat." }, { status: 500 });
        }

        // Fetch Order
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ success: false, error: "Comanda nu a fost găsită." }, { status: 404 });
        }

        // Generate AWB via Sameday API
        const awbResult = await createSamedayAWB(order as OrderRecord);

        if (!awbResult.success || !awbResult.awbNumber) {
            await supabase
                .from("orders")
                .update({ awb_error: awbResult.error || "Eroare la generarea AWB-ului Sameday." })
                .eq("id", id);
            return NextResponse.json({ success: false, error: awbResult.error || "Eroare la generarea AWB-ului." }, { status: 500 });
        }

        // Update Supabase
        const newStatus = order.status === "new" || order.status === "confirmed" ? "shipped" : order.status;
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                awb_number: awbResult.awbNumber,
                carrier_name: "sameday",
                awb_error: null,
                status: newStatus,
            })
            .eq("id", id);

        if (updateError) {
            console.error("Eroare actualizare Supabase AWB:", updateError);
            return NextResponse.json({ success: false, error: "Nu s-a putut salva AWB-ul în baza de date." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            awbNumber: awbResult.awbNumber,
            pdfUrl: awbResult.pdfUrl,
            status: newStatus,
        });
    } catch (err) {
        console.error("Eroare API Generate AWB:", err);
        return NextResponse.json({ success: false, error: "A apărut o eroare internă la generarea AWB-ului." }, { status: 500 });
    }
}
