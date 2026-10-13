import { NextResponse, after } from "next/server";
import { z } from "zod";
import { PRODUCT_CONFIG } from "@/config/product";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendOrderNotificationEmail } from "@/lib/email";
import { sendMetaConversionEvent, sendTikTokConversionEvent } from "@/lib/tracking";
import { sendOrderSMS } from "@/lib/sms";
import { checkRateLimit } from "@/lib/ratelimit";
import { createSamedayAWB } from "@/lib/courier/sameday";
import { createSmartBillInvoice } from "@/lib/billing/smartbill";
import { OrderRecord } from "@/types/order";

// Zod Validation Schema
const orderSchema = z.object({
    fullName: z.string().trim().min(3, "Numele și prenumele trebuie să aibă cel puțin 3 caractere."),
    phone: z.string().trim().refine((val) => {
        const clean = val.replace(/[\s\-\+\(\)]/g, "");
        return /^07\d{8}$/.test(clean);
    }, "Numărul de telefon este nevalid. Introduceți un număr din România (ex: 07xx xxx xxx)."),
    email: z.string().trim().email("Adresa de email este nevalidă.").optional().or(z.literal("")),
    county: z.string().trim().min(2, "Selectați județul."),
    city: z.string().trim().min(2, "Introduceți localitatea."),
    deliveryType: z.enum(["address", "easybox"]).default("address"),
    street: z.string().trim().min(2, "Introduceți strada sau lockerul.").default("Stradă Principală"),
    number: z.string().trim().min(1, "Introduceți numărul.").default("1"),
    building: z.string().trim().optional(),
    entrance: z.string().trim().optional(),
    apartment: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    easyboxId: z.string().trim().optional(),
    easyboxName: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    quantity: z.number().int().min(1).max(3),
    orderBumpIncluded: z.boolean().optional().default(false),
    idempotencyKey: z.string().trim().optional(),
    billingType: z.enum(["individual", "company"]).default("individual"),
    companyName: z.string().trim().optional(),
    cui: z.string().trim().optional().refine((val) => {
        if (!val) return true;
        const clean = val.replace(/^RO/i, "").trim();
        return /^\d{2,10}$/.test(clean);
    }, "Codul fiscal / CUI este nevalid (ex: RO12345678 sau 12345678)."),
    regCom: z.string().trim().optional(),
    gdprConsent: z.boolean().refine((val) => val === true, "Trebuie să acceptați Termenii și Condițiile și Politica de Confidențialitate pentru a plasa comanda.").optional().default(true),
});

export async function POST(request: Request) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const realIp = request.headers.get("x-real-ip");
        const clientIp = (forwarded ? forwarded.split(",")[0] : realIp) || "127.0.0.1";
        const userAgent = request.headers.get("user-agent") || "";

        // Rate Limiting Check (maxim 3 comenzi / minut per IP)
        const rateCheck = await checkRateLimit(clientIp, 3, 60000);
        if (!rateCheck.success) {
            return NextResponse.json(
                { success: false, error: "Ați depășit limita de comenzi. Vă rugăm să așteptați un minut înainte de a încerca din nou." },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Validate Body with Zod
        const parseResult = orderSchema.safeParse(body);
        if (!parseResult.success) {
            const firstError = parseResult.error.issues[0]?.message || "Datele introduse sunt nevalide.";
            return NextResponse.json(
                { success: false, error: firstError },
                { status: 400 }
            );
        }

        const data = parseResult.data;
        const supabase = getSupabaseServerClient();

        if (!supabase) {
            console.error("Supabase server client este null. Verificați variabilele de mediu.");
            return NextResponse.json(
                { success: false, error: "Serviciul de preluare comenzi este temporar indisponibil. Vă rugăm să încercați din nou." },
                { status: 503 }
            );
        }

        // Check Idempotency Key to prevent double submission
        if (data.idempotencyKey) {
            const { data: existingOrder } = await supabase
                .from("orders")
                .select("*")
                .eq("idempotency_key", data.idempotencyKey)
                .maybeSingle();

            if (existingOrder) {
                console.log(`[Idempotency] Comanda cu idempotencyKey ${data.idempotencyKey} a fost deja înregistrată: ${existingOrder.order_number}`);
                return NextResponse.json(
                    {
                        success: true,
                        orderNumber: existingOrder.order_number,
                        orderId: existingOrder.id,
                        order: existingOrder,
                    },
                    { status: 200 }
                );
            }
        }

        // Server-Side Pricing Calculation
        const bundle = PRODUCT_CONFIG.bundles.find((b) => b.quantity === data.quantity) || PRODUCT_CONFIG.bundles[0];
        const basePrice = bundle.price;
        const bumpPrice = data.orderBumpIncluded ? PRODUCT_CONFIG.orderBump.price : 0;
        const shippingFee = bundle.shippingFee;
        const totalPrice = Number((basePrice + bumpPrice + shippingFee).toFixed(2));

        // Order Number Generation: LH-YYYYMMDD-XXXX
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `LH-${todayStr}-${randomPart}`;
        const createdAt = new Date().toISOString();
        const cleanPhone = data.phone.replace(/[\s\-\+\(\)]/g, "");

        const orderData = {
            order_number: orderNumber,
            created_at: createdAt,
            customer_name: data.fullName,
            phone: cleanPhone,
            email: data.email || null,
            county: data.county,
            city: data.city,
            delivery_type: data.deliveryType,
            street: data.street,
            number: data.number,
            building: data.building || null,
            entrance: data.entrance || null,
            apartment: data.apartment || null,
            postal_code: data.postalCode || null,
            easybox_id: data.easyboxId || null,
            easybox_name: data.easyboxName || null,
            quantity: data.quantity,
            order_bump_included: data.orderBumpIncluded,
            product_name: `${PRODUCT_CONFIG.name} (${bundle.quantity} buc.)${data.orderBumpIncluded ? " + Set Rezervă 5 Capete" : ""}`,
            unit_price: Number((basePrice / bundle.quantity).toFixed(2)),
            total_price: totalPrice,
            payment_method: "cod",
            status: "new",
            billing_type: data.billingType,
            company_name: data.billingType === "company" ? (data.companyName || null) : null,
            cui: data.billingType === "company" ? (data.cui || null) : null,
            reg_com: data.billingType === "company" ? (data.regCom || null) : null,
            idempotency_key: data.idempotencyKey || null,
            client_ip: clientIp,
            notes: data.notes || null,
        };

        // Save order to Supabase
        const { data: insertedData, error: dbError } = await supabase
            .from("orders")
            .insert([orderData])
            .select("*")
            .single();

        if (dbError) {
            console.error("[Supabase INSERT Error]", {
                message: dbError.message,
                details: dbError.details,
                hint: dbError.hint,
                code: dbError.code,
                orderNumber,
                clientIp
            });
            // Check for potential constraint or RLS failures
            if (dbError.code === "42501") {
                console.error("[Security] RLS a blocat inserarea (Row Level Security). Verificați dacă cheia folosită este SERVICE_ROLE sau are drepturi INSERT.");
            }
            if (dbError.code === "23505") { // Unique violation
                return NextResponse.json(
                    { success: true, orderNumber, orderId: "dup", order: orderData },
                    { status: 200 }
                );
            }
            return NextResponse.json(
                { success: false, error: `Nu am putut finaliza comanda. Motiv tehnic: ${dbError.message}` },
                { status: 500 }
            );
        }

        const savedOrder: OrderRecord = insertedData;
        const fullAddress = data.deliveryType === "easybox"
            ? `Locker Sameday Easybox: ${data.easyboxName || data.easyboxId}, ${data.city}, ${data.county}`
            : `Str. ${data.street}, Nr. ${data.number}${data.building ? `, Bl. ${data.building}` : ""}${data.entrance ? `, Sc. ${data.entrance}` : ""}${data.apartment ? `, Ap. ${data.apartment}` : ""}, ${data.city}, ${data.county}`;

        // Next.js 16 Serverless-safe Background Task execution via after()
        after(async () => {
            await Promise.allSettled([
                (async () => {
                    try {
                        await sendOrderNotificationEmail({
                            orderNumber,
                            createdAt,
                            customerName: data.fullName,
                            phone: cleanPhone,
                            email: data.email || undefined,
                            address: fullAddress,
                            productName: orderData.product_name,
                            quantity: data.quantity,
                            orderBumpIncluded: data.orderBumpIncluded,
                            unitPrice: orderData.unit_price,
                            shippingFee,
                            totalPrice,
                            paymentMethod: "cod",
                            notes: data.notes || undefined,
                            clientIp,
                        });
                    } catch (err) {
                        console.error("[After Task Error] Email failed:", err);
                    }
                })(),
                (async () => {
                    try {
                        await sendOrderSMS({
                            phone: cleanPhone,
                            orderNumber,
                            totalPrice,
                        });
                    } catch (err) {
                        console.error("[After Task Error] SMS failed:", err);
                    }
                })(),
                (async () => {
                    try {
                        await sendMetaConversionEvent({
                            orderNumber,
                            customerName: data.fullName,
                            phone: cleanPhone,
                            email: data.email || undefined,
                            county: data.county,
                            city: data.city,
                            totalPrice,
                            currency: "RON",
                            clientIp,
                            userAgent,
                        });
                    } catch (err) {
                        console.error("[After Task Error] Meta CAPI failed:", err);
                    }
                })(),
                (async () => {
                    try {
                        await sendTikTokConversionEvent({
                            orderNumber,
                            customerName: data.fullName,
                            phone: cleanPhone,
                            email: data.email || undefined,
                            county: data.county,
                            city: data.city,
                            totalPrice,
                            currency: "RON",
                            clientIp,
                            userAgent,
                        });
                    } catch (err) {
                        console.error("[After Task Error] TikTok Events failed:", err);
                    }
                })(),
                (async () => {
                    try {
                        const awbResult = await createSamedayAWB(savedOrder);
                        if (awbResult.success) {
                            await supabase
                                .from("orders")
                                .update({ awb_number: awbResult.awbNumber, carrier_name: "Sameday Courier", awb_error: null })
                                .eq("id", savedOrder.id);
                        } else if (awbResult.error) {
                            await supabase
                                .from("orders")
                                .update({ awb_error: awbResult.error })
                                .eq("id", savedOrder.id);
                        }
                    } catch (err) {
                        console.error("[After Task Error] Sameday AWB generation failed:", err);
                    }
                })(),
                (async () => {
                    try {
                        const invoiceResult = await createSmartBillInvoice(savedOrder);
                        if (invoiceResult.success) {
                            await supabase
                                .from("orders")
                                .update({ invoice_number: invoiceResult.invoiceNumber, invoice_error: null })
                                .eq("id", savedOrder.id);
                        } else if (invoiceResult.error) {
                            await supabase
                                .from("orders")
                                .update({ invoice_error: invoiceResult.error })
                                .eq("id", savedOrder.id);
                        }
                    } catch (err) {
                        console.error("[After Task Error] SmartBill Invoice generation failed:", err);
                    }
                })(),
            ]);
        });

        return NextResponse.json(
            {
                success: true,
                orderNumber,
                orderId: savedOrder.id,
                order: {
                    orderNumber,
                    createdAt,
                    fullName: data.fullName,
                    phone: cleanPhone,
                    email: data.email,
                    county: data.county,
                    city: data.city,
                    deliveryType: data.deliveryType,
                    street: data.street,
                    number: data.number,
                    building: data.building,
                    entrance: data.entrance,
                    apartment: data.apartment,
                    postalCode: data.postalCode,
                    easyboxId: data.easyboxId,
                    easyboxName: data.easyboxName,
                    quantity: data.quantity,
                    orderBumpIncluded: data.orderBumpIncluded,
                    productName: orderData.product_name,
                    unitPrice: orderData.unit_price,
                    shippingFee,
                    totalPrice,
                    paymentMethod: "cod",
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Eroare neașteptată API Orders:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
