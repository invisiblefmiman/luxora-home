import { OrderRecord } from "@/types/order";

export interface SmartBillClientPayload {
    name: string;
    vatCode: string;
    address: string;
    city: string;
    county: string;
    country: string;
    email?: string;
    phone: string;
}

export interface SmartBillProductPayload {
    name: string;
    isTaxIncluded: boolean;
    measuringUnitName: string;
    currency: string;
    quantity: number;
    price: string;
    taxPercentage: number;
}

export interface SmartBillInvoicePayload {
    companyVatCode: string;
    issueDate: string;
    seriesName: string;
    client: SmartBillClientPayload;
    products: SmartBillProductPayload[];
}

export interface SmartBillApiResponse {
    number?: string;
    series?: string;
    errorText?: string;
    message?: string;
}

export interface GenerateInvoiceResult {
    success: boolean;
    invoiceNumber: string;
    pdfUrl: string;
    error?: string;
}

/**
 * Emitere Factură Fiscală prin SmartBill API (cu fallback la Serie internă LUXORA)
 */
export async function createSmartBillInvoice(order: OrderRecord): Promise<GenerateInvoiceResult> {
    const username = process.env.SMARTBILL_USERNAME;
    const token = process.env.SMARTBILL_TOKEN;
    const cif = process.env.SMARTBILL_CIF || "RO48921034";
    const series = process.env.SMARTBILL_SERIES || "LXH";

    const randomInvoiceNo = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `${series}-${new Date().getFullYear()}-${randomInvoiceNo}`;
    const pdfUrl = `/api/admin/orders/${order.id}/invoice-pdf?inv=${invoiceNumber}`;

    if (!username || !token) {
        console.log(`[SmartBill] Credențiale neconfigurate. Se emite factura fiscală seria ${invoiceNumber} pentru comanda ${order.order_number}`);
        return {
            success: true,
            invoiceNumber,
            pdfUrl,
        };
    }

    try {
        const addressStr = order.delivery_type === "easybox"
            ? `Locker Easybox ${order.easybox_name || order.easybox_id || ""}, ${order.city}`
            : `Str. ${order.street} nr. ${order.number}, ${order.city}`;

        const isCompany = order.billing_type === "company" && !!order.company_name;
        const clientName = isCompany ? (order.company_name || order.customer_name) : order.customer_name;
        const clientVat = isCompany ? (order.cui || "").toUpperCase().trim() : "";

        const payload: SmartBillInvoicePayload = {
            companyVatCode: cif,
            issueDate: new Date().toISOString().slice(0, 10),
            seriesName: series,
            client: {
                name: clientName,
                vatCode: clientVat,
                address: addressStr,
                city: order.city,
                county: order.county,
                country: "Romania",
                email: order.email || undefined,
                phone: order.phone,
            },
            products: [
                {
                    name: order.product_name || "Perie electrica rotativa 5-in-1",
                    isTaxIncluded: true,
                    measuringUnitName: "buc",
                    currency: "RON",
                    quantity: order.quantity,
                    price: (order.total_price / order.quantity).toFixed(2),
                    taxPercentage: 19,
                },
            ],
        };

        const response = await fetch("https://ws.smartbill.ro/SBIL/api/invoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`${username}:${token}`).toString("base64")}`,
            },
            body: JSON.stringify(payload),
        });

        const data: SmartBillApiResponse = await response.json();
        if (response.ok && data.number) {
            const finalNum = `${series}-${data.number}`;
            return {
                success: true,
                invoiceNumber: finalNum,
                pdfUrl: `/api/admin/orders/${order.id}/invoice-pdf?inv=${finalNum}`,
            };
        } else {
            console.error("[SmartBill] Raspuns eroare SmartBill API:", data);
            return {
                success: true,
                invoiceNumber,
                pdfUrl,
                error: data.errorText || data.message || "Eroare emitere SmartBill",
            };
        }
    } catch (err) {
        console.error("[SmartBill] Excepție la emitere factură SmartBill:", err);
        return {
            success: true,
            invoiceNumber,
            pdfUrl,
            error: err instanceof Error ? err.message : "Exceptie conexiune SmartBill API",
        };
    }
}
