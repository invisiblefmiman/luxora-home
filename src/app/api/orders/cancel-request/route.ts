import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ratelimit";

const cancelSchema = z.object({
    orderNumber: z.string().trim().min(5, "Introduceți un număr de comandă valid."),
    phone: z.string().trim().min(8, "Introduceți numărul de telefon folosit la comandă."),
    reason: z.string().trim().optional(),
});

export async function POST(request: Request) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const clientIp = (forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")) || "127.0.0.1";

        // Rate Limiter: max 5 cereri pe minut per IP
        const rateCheck = await checkRateLimit(`cancel-${clientIp}`, 5, 60000);
        if (!rateCheck.success) {
            return NextResponse.json(
                { success: false, error: "Prea multe solicitări de anulare. Vă rugăm să așteptați un minut." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const parseResult = cancelSchema.safeParse(body);

        if (!parseResult.success) {
            const firstError = parseResult.error.issues[0]?.message || "Date nevalide.";
            return NextResponse.json({ success: false, error: firstError }, { status: 400 });
        }

        const { orderNumber, phone, reason } = parseResult.data;
        const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, "");

        const supabase = getSupabaseServerClient();
        if (!supabase) {
            return NextResponse.json({ success: false, error: "Serviciul de anulate este indisponibil." }, { status: 503 });
        }

        // Find order
        const { data: order, error: findError } = await supabase
            .from("orders")
            .select("*")
            .eq("order_number", orderNumber)
            .single();

        if (findError || !order) {
            return NextResponse.json(
                { success: false, error: "Comanda nu a fost găsită. Verificați numărul de comandă." },
                { status: 404 }
            );
        }

        // Check phone match
        const orderPhoneClean = (order.phone || "").replace(/[\s\-\+\(\)]/g, "");
        if (!orderPhoneClean.endsWith(cleanPhone.slice(-8))) {
            return NextResponse.json(
                { success: false, error: "Numărul de telefon nu se potrivește cu cel din comandă." },
                { status: 400 }
            );
        }

        // Check if cancellable
        if (order.status === "shipped" || order.status === "delivered") {
            return NextResponse.json(
                { success: false, error: "Comanda a fost deja expediată și nu mai poate fi anulată automat. Vă rugăm să ne contactați la suport." },
                { status: 400 }
            );
        }

        if (order.status === "cancelled") {
            return NextResponse.json({ success: true, message: "Comanda este deja anulată." });
        }

        // Update status to cancelled
        const noteUpdate = reason ? `${order.notes || ""}\n[Cerere Anulare Client]: ${reason}`.trim() : order.notes;

        const { error: updateError } = await supabase
            .from("orders")
            .update({
                status: "cancelled",
                notes: noteUpdate,
            })
            .eq("id", order.id);

        if (updateError) {
            console.error("Eroare la anularea comenzii:", updateError);
            return NextResponse.json({ success: false, error: "Eroare la actualizarea comenzii." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Comanda a fost anulată cu succes. Vă mulțumim că ne-ați anunțat!",
        });
    } catch (err) {
        console.error("Eroare API Cancel Request:", err);
        return NextResponse.json({ success: false, error: "A apărut o eroare la procesarea cererii de anulare." }, { status: 500 });
    }
}
