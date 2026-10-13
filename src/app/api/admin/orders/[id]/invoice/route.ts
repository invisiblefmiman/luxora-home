import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { createSmartBillInvoice } from "@/lib/billing/smartbill";
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

        // Fetch order
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ success: false, error: "Comanda nu a fost găsită." }, { status: 404 });
        }

        // Emit invoice
        const invResult = await createSmartBillInvoice(order as OrderRecord);

        if (!invResult.success || !invResult.invoiceNumber) {
            await supabase
                .from("orders")
                .update({ invoice_error: invResult.error || "Eroare la emiterea facturii SmartBill." })
                .eq("id", id);
            return NextResponse.json({ success: false, error: invResult.error || "Eroare la emiterea facturii." }, { status: 500 });
        }

        // Update invoice_number in Supabase & clear error
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                invoice_number: invResult.invoiceNumber,
                invoice_error: null,
            })
            .eq("id", id);

        if (updateError) {
            console.error("Eroare salvare număr factură Supabase:", updateError);
            return NextResponse.json({ success: false, error: "Nu s-a putut actualiza numărul facturii." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            invoiceNumber: invResult.invoiceNumber,
            pdfUrl: invResult.pdfUrl,
        });
    } catch (err) {
        console.error("Eroare API Invoice Route:", err);
        return NextResponse.json({ success: false, error: "A apărut o eroare la emiterea facturii." }, { status: 500 });
    }
}
