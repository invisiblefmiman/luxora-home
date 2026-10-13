import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getSupabaseServerClient } from "@/lib/supabase";
import { PRODUCT_CONFIG } from "@/config/product";

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
        const invoiceNumber = urlParams.get("inv") || order.invoice_number || `LXH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // PDF Generation via PDFKit
        const doc = new PDFDocument({ size: "A4", margin: 40 });
        const buffers: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => buffers.push(chunk));

        // Header Title
        doc.fontSize(20).font("Helvetica-Bold").fillColor("#1e293b").text("FACTURĂ FISCALĂ", { align: "right" });
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#2563eb").text(`Seria / Nr: ${invoiceNumber}`, { align: "right" });
        doc.fontSize(9).font("Helvetica").fillColor("#64748b").text(`Data emiterii: ${new Date(order.created_at).toLocaleDateString("ro-RO")}`, { align: "right" });
        doc.text(`Referință comandă: ${order.order_number}`, { align: "right" });

        doc.moveDown(1);
        doc.lineWidth(1).strokeColor("#cbd5e1").moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(1);

        // Supplier & Buyer Columns
        const topY = doc.y;

        // Supplier Box (Left)
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#0f172a").text("FURNIZOR:", 40, topY);
        doc.fontSize(9).font("Helvetica").fillColor("#334155");
        doc.text("LUXORA HOME S.R.L.");
        doc.text("CUI: RO12345678 | Reg. Com: J40/1234/2024");
        doc.text("Sediu: Str. Exemplu nr. 1, Bucuresti");
        doc.text("Capital social: 200 RON");
        doc.text("Email: contact@luxorahome.ro | Tel: 0700 000 000");

        // Buyer Box (Right)
        doc.fontSize(10).font("Helvetica-Bold").fillColor("#0f172a").text("CUMPARATOR (CLIENT):", 320, topY);
        doc.fontSize(9).font("Helvetica").fillColor("#334155");
        doc.text(order.customer_name, 320);
        doc.text(`Telefon: ${order.phone}`, 320);
        if (order.email) doc.text(`Email: ${order.email}`, 320);
        doc.text(`Adresa: Str. ${order.street} nr. ${order.number}${order.building ? `, Bl. ${order.building}` : ""}`, 320);
        doc.text(`Localitate: ${order.city}, Jud. ${order.county}`, 320);

        doc.moveDown(2);
        const tableTop = Math.max(doc.y, 220);

        // Table Header
        doc.rect(40, tableTop, 515, 24).fill("#f1f5f9");
        doc.fillColor("#0f172a").fontSize(9).font("Helvetica-Bold");
        doc.text("Nr.", 45, tableTop + 7);
        doc.text("Denumire Produs / Serviciu", 75, tableTop + 7);
        doc.text("U.M.", 320, tableTop + 7);
        doc.text("Cant.", 360, tableTop + 7);
        doc.text("Pret Unitar", 410, tableTop + 7);
        doc.text("Valoare (RON)", 480, tableTop + 7);

        let currentY = tableTop + 30;
        doc.font("Helvetica").fontSize(9).fillColor("#334155");

        // Line 1: Main Product
        const bundle = PRODUCT_CONFIG.bundles.find((b) => b.quantity === order.quantity) || PRODUCT_CONFIG.bundles[0];
        const basePrice = bundle.price;

        doc.text("1", 45, currentY);
        doc.text(`${PRODUCT_CONFIG.name} (${order.quantity} buc.)`, 75, currentY, { width: 230 });
        doc.text("buc", 320, currentY);
        doc.text(String(order.quantity), 360, currentY);
        doc.text((basePrice / order.quantity).toFixed(2), 410, currentY);
        doc.text(basePrice.toFixed(2), 480, currentY);

        currentY += 22;

        // Line 2: Order Bump (if included)
        if (order.order_bump_included) {
            doc.text("2", 45, currentY);
            doc.text("Set 5 Capete Interschimbabile Rezerva", 75, currentY, { width: 230 });
            doc.text("set", 320, currentY);
            doc.text("1", 360, currentY);
            doc.text(PRODUCT_CONFIG.orderBump.price.toFixed(2), 410, currentY);
            doc.text(PRODUCT_CONFIG.orderBump.price.toFixed(2), 480, currentY);
            currentY += 22;
        }

        // Line 3: Shipping Fee (if applicable)
        const shippingFee = bundle.shippingFee;
        if (shippingFee > 0) {
            doc.text(order.order_bump_included ? "3" : "2", 45, currentY);
            doc.text("Servicii de Livrare si Transport Curier", 75, currentY, { width: 230 });
            doc.text("serv", 320, currentY);
            doc.text("1", 360, currentY);
            doc.text(shippingFee.toFixed(2), 410, currentY);
            doc.text(shippingFee.toFixed(2), 480, currentY);
            currentY += 22;
        }

        doc.lineWidth(1).strokeColor("#cbd5e1").moveTo(40, currentY + 5).lineTo(555, currentY + 5).stroke();
        currentY += 15;

        // Total Box
        const totalPrice = Number(order.total_price);
        const vatRate = 0.19;
        const netTotal = Number((totalPrice / (1 + vatRate)).toFixed(2));
        const vatTotal = Number((totalPrice - netTotal).toFixed(2));

        doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f172a");
        doc.text("Valoare Neta (fara TVA):", 340, currentY);
        doc.text(`${netTotal.toFixed(2)} RON`, 480, currentY);

        currentY += 16;
        doc.text("TVA (19%):", 340, currentY);
        doc.text(`${vatTotal.toFixed(2)} RON`, 480, currentY);

        currentY += 20;
        doc.rect(330, currentY - 4, 225, 28).fill("#2563eb");
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#ffffff");
        doc.text("TOTAL DE PLATĂ (RAMBURS):", 340, currentY + 3);
        doc.text(`${totalPrice.toFixed(2)} RON`, 480, currentY + 3);

        // Footer Legal Notes
        doc.font("Helvetica").fontSize(8).fillColor("#94a3b8").text("Factura circula fara semnatura si stampila conform art. 319 alin. 29 din Codul Fiscal.", 40, 750, { align: "center" });

        doc.end();

        await new Promise((resolve) => doc.on("end", resolve));

        const pdfBuffer = Buffer.concat(buffers);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="Factura_${invoiceNumber}.pdf"`,
            },
        });
    } catch (err) {
        console.error("Eroare generare PDF Factura:", err);
        return NextResponse.json({ success: false, error: "Eroare la generarea fișierului PDF." }, { status: 500 });
    }
}
