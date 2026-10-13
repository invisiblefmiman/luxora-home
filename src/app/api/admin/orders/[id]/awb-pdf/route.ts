import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getSupabaseServerClient } from "@/lib/supabase";

function checkAdminAuth(request: Request): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.trim() === "") return false;
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") || "";

    if (authHeader === `Bearer ${adminPassword}`) return true;
    if (cookieHeader.includes(`luxora_admin_token=${adminPassword}`)) return true;
    
    // Allow query param for direct browser PDF download links
    const url = new URL(request.url);
    if (url.searchParams.get("token") === adminPassword) return true;

    return false;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!checkAdminAuth(request)) {
        return NextResponse.json({ success: false, error: "Neautorizat." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const supabase = getSupabaseServerClient();
        if (!supabase) {
            return NextResponse.json({ success: false, error: "Supabase indisponibil." }, { status: 500 });
        }

        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !order) {
            return NextResponse.json({ success: false, error: "Comandă negăsită." }, { status: 404 });
        }

        const urlParams = new URL(request.url).searchParams;
        const awbNumber = urlParams.get("awb") || order.awb_number || `101${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        // Generate PDF using PDFKit
        const doc = new PDFDocument({ size: "A6", margin: 20 });
        const buffers: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => buffers.push(chunk));

        // Header / Logo
        doc.fontSize(16).font("Helvetica-Bold").fillColor("#2563eb").text("SAMEDAY COURIER", { align: "center" });
        doc.fontSize(10).font("Helvetica").fillColor("#64748b").text("Etichetă Expediere AWB", { align: "center" });
        doc.moveDown(0.5);

        doc.lineWidth(1).strokeColor("#cbd5e1").moveTo(20, doc.y).lineTo(278, doc.y).stroke();
        doc.moveDown(0.5);

        // AWB Number Box
        doc.rect(20, doc.y, 258, 45).fillAndStroke("#f1f5f9", "#94a3b8");
        doc.fillColor("#0f172a").fontSize(10).font("Helvetica-Bold").text("AWB NUMBER:", 30, doc.y - 38);
        doc.fillColor("#2563eb").fontSize(16).font("Helvetica-Bold").text(awbNumber, 30, doc.y + 2);
        doc.moveDown(1.5);

        // Sender Info
        doc.fillColor("#0f172a").fontSize(9).font("Helvetica-Bold").text("EXPEDITOR:");
        doc.font("Helvetica").fontSize(8).text("LUXORA HOME S.R.L. - Depozit Central");
        doc.text("Str. Industriilor nr. 5, Sector 3, Bucuresti");
        doc.text("Tel: 0700 000 000");
        doc.moveDown(0.5);

        // Recipient Info
        doc.fillColor("#0f172a").fontSize(9).font("Helvetica-Bold").text("DESTINATAR:");
        doc.font("Helvetica-Bold").fontSize(9).text(order.customer_name);
        doc.font("Helvetica").fontSize(8).text(`Tel: ${order.phone}`);
        doc.text(`Adresa: Str. ${order.street} nr. ${order.number}${order.building ? `, Bl. ${order.building}` : ""}${order.apartment ? `, Ap. ${order.apartment}` : ""}`);
        doc.text(`Localitate: ${order.city}, Jud. ${order.county}`);
        doc.moveDown(0.5);

        doc.lineWidth(1).strokeColor("#cbd5e1").moveTo(20, doc.y).lineTo(278, doc.y).stroke();
        doc.moveDown(0.5);

        // Package & COD Summary
        doc.fillColor("#0f172a").fontSize(9).font("Helvetica-Bold").text(`Comanda ID: ${order.order_number}`);
        doc.text(`Continut: ${order.product_name || "Perie electrica rotativa"}`);
        doc.text(`Colete: 1 / Greutate: 1.0 kg`);

        doc.moveDown(0.5);
        doc.rect(20, doc.y, 258, 30).fillAndStroke("#ecfdf5", "#059669");
        doc.fillColor("#047857").fontSize(10).font("Helvetica-Bold").text("RAMBURS DE COLECTAT:", 30, doc.y - 24);
        doc.fillColor("#047857").fontSize(14).font("Helvetica-Bold").text(`${Number(order.total_price).toFixed(2)} LEI`, 170, doc.y - 18);

        doc.end();

        await new Promise((resolve) => doc.on("end", resolve));

        const pdfBuffer = Buffer.concat(buffers);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="AWB_${awbNumber}.pdf"`,
            },
        });
    } catch (err) {
        console.error("Eroare generare PDF AWB:", err);
        return NextResponse.json({ success: false, error: "Eroare la generarea fișierului PDF." }, { status: 500 });
    }
}
