import { Resend } from "resend";
import { PRODUCT_CONFIG } from "@/config/product";

function escapeHtml(text?: string | null): string {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

interface OrderNotificationParams {
    orderNumber: string;
    createdAt: string;
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    productName: string;
    quantity: number;
    orderBumpIncluded?: boolean;
    unitPrice: number;
    shippingFee: number;
    totalPrice: number;
    paymentMethod: string;
    notes?: string;
    clientIp?: string;
}

export async function sendOrderNotificationEmail(order: OrderNotificationParams) {
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL;

    if (!apiKey || !adminEmail) {
        console.log("Resend email notification skipped: RESEND_API_KEY or ORDER_NOTIFICATION_EMAIL not configured.");
        return { success: false, reason: "NOT_CONFIGURED" };
    }

    try {
        const resend = new Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "comenzi@luxorahome.ro";
        const adminUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin` : "/admin";

        const safeCustomerName = escapeHtml(order.customerName);
        const safePhone = escapeHtml(order.phone);
        const safeEmail = escapeHtml(order.email);
        const safeAddress = escapeHtml(order.address);
        const safeNotes = escapeHtml(order.notes);
        const safeProductName = escapeHtml(order.productName);

        const emailContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
    <h2 style="color: #2563eb; margin-top: 0;">🎉 Comanda noua inregistrata: ${escapeHtml(order.orderNumber)}</h2>
    <p style="color: #64748b; font-size: 14px;"><strong>Data:</strong> ${new Date(order.createdAt).toLocaleString("ro-RO")}</p>

    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Date Client:</h3>
        <ul style="list-style: none; padding-left: 0; margin-bottom: 0; line-height: 1.6; color: #334155;">
            <li><strong>Nume:</strong> ${safeCustomerName}</li>
            <li><strong>Telefon:</strong> <a href="tel:${safePhone}" style="color: #2563eb; font-weight: bold;">${safePhone}</a></li>
            <li><strong>Email:</strong> ${safeEmail || "Nespecificat"}</li>
            <li><strong>Adresa Livrare:</strong> ${safeAddress}</li>
            ${order.notes ? `<li><strong>Observatii:</strong> ${safeNotes}</li>` : ""}
            ${order.clientIp ? `<li><strong>IP Client:</strong> ${escapeHtml(order.clientIp)}</li>` : ""}
        </ul>
    </div>

    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Detaliu Colet:</h3>
        <ul style="list-style: none; padding-left: 0; margin-bottom: 0; line-height: 1.6; color: #334155;">
            <li><strong>Produs:</strong> ${safeProductName}</li>
            <li><strong>Pachet / Cantitate:</strong> ${order.quantity} buc.</li>
            <li><strong>Order Bump (Capete rezerva 29.90 lei):</strong> ${order.orderBumpIncluded ? "<span style='color: #16a34a; font-weight: bold;'>DA (+29.90 lei)</span>" : "NU"}</li>
            <li><strong>Taxa livrare:</strong> ${order.shippingFee === 0 ? "<span style='color: #16a34a; font-weight: bold;'>GRATUIT</span>" : `${order.shippingFee.toFixed(2)} lei`}</li>
            <li style="font-size: 18px; margin-top: 10px;"><strong>TOTAL RAMBURS DE COLECTAT:</strong> <span style="color: #2563eb; font-weight: 900;">${order.totalPrice.toFixed(2)} lei</span></li>
            <li><strong>Metoda de plata:</strong> Plata la livrare (Ramburs)</li>
            <li><strong>Status initial:</strong> Nou (new)</li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 25px;">
        <a href="${adminUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Acceseaza Panoul Admin</a>
    </div>
</div>
        `;

        await resend.emails.send({
            from: `${PRODUCT_CONFIG.brandName} <${fromEmail}>`,
            to: [adminEmail],
            subject: `[COMANDA NOUA] ${order.orderNumber} - ${order.customerName} (${order.totalPrice.toFixed(2)} lei)`,
            html: emailContent,
        });

        return { success: true };
    } catch (err) {
        console.error("Eroare la trimiterea email-ului prin Resend:", err);
        return { success: false, error: err };
    }
}
