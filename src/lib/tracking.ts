import crypto from "crypto";

interface TrackingOrderPayload {
    orderNumber: string;
    customerName: string;
    phone: string;
    email?: string;
    county: string;
    city: string;
    totalPrice: number;
    currency: string;
    clientIp?: string;
    userAgent?: string;
}

function hashSha256(value: string): string {
    const cleaned = value.trim().toLowerCase();
    return crypto.createHash("sha256").update(cleaned).digest("hex");
}

function formatPhoneRomania(phone: string): string {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("07") && clean.length === 10) {
        clean = "40" + clean;
    }
    return clean;
}

/**
 * Trimitere Server-Side Tracking către Meta Conversions API (FB CAPI)
 */
export async function sendMetaConversionEvent(data: TrackingOrderPayload) {
    const pixelId = process.env.META_PIXEL_ID;
    const capiToken = process.env.META_CAPI_TOKEN;

    if (!pixelId || !capiToken) {
        console.log("[Tracking] Meta CAPI omis: META_PIXEL_ID sau META_CAPI_TOKEN nu este configurat.");
        return;
    }

    try {
        const formattedPhone = formatPhoneRomania(data.phone);
        const hashedPhone = hashSha256(formattedPhone);
        const hashedEmail = data.email ? hashSha256(data.email) : undefined;
        const hashedCounty = hashSha256(data.county);
        const hashedCity = hashSha256(data.city);

        const payload = {
            data: [
                {
                    event_name: "Purchase",
                    event_time: Math.floor(Date.now() / 1000),
                    event_id: data.orderNumber,
                    action_source: "website",
                    user_data: {
                        ph: [hashedPhone],
                        em: hashedEmail ? [hashedEmail] : undefined,
                        st: [hashedCounty],
                        ct: [hashedCity],
                        client_ip_address: data.clientIp || undefined,
                        client_user_agent: data.userAgent || undefined,
                    },
                    custom_data: {
                        currency: data.currency || "RON",
                        value: data.totalPrice,
                        order_id: data.orderNumber,
                    },
                },
            ],
        };

        const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const resData = await response.json();
        if (!response.ok) {
            console.error("[Tracking] Eroare răspuns Meta CAPI:", resData);
        } else {
            console.log("[Tracking] Eveniment transmis cu succes către Meta CAPI:", data.orderNumber);
        }
    } catch (err) {
        console.error("[Tracking] Eroare la trimiterea evenimentului Meta CAPI:", err);
    }
}

/**
 * Trimitere Server-Side Tracking către TikTok Events API
 */
export async function sendTikTokConversionEvent(data: TrackingOrderPayload) {
    const pixelCode = process.env.TIKTOK_PIXEL_ID;
    const accessToken = process.env.TIKTOK_EVENTS_API_TOKEN;

    if (!pixelCode || !accessToken) {
        console.log("[Tracking] TikTok Events API omis: TIKTOK_PIXEL_ID sau TIKTOK_EVENTS_API_TOKEN nu este configurat.");
        return;
    }

    try {
        const formattedPhone = formatPhoneRomania(data.phone);
        const hashedPhone = hashSha256(formattedPhone);
        const hashedEmail = data.email ? hashSha256(data.email) : undefined;

        const payload = {
            pixel_code: pixelCode,
            event: "CompletePayment",
            event_id: data.orderNumber,
            timestamp: new Date().toISOString(),
            context: {
                user: {
                    phone_number: hashedPhone,
                    email: hashedEmail,
                },
                ip: data.clientIp || undefined,
                user_agent: data.userAgent || undefined,
            },
            properties: {
                currency: data.currency || "RON",
                value: data.totalPrice,
                order_id: data.orderNumber,
            },
        };

        const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Token": accessToken,
            },
            body: JSON.stringify(payload),
        });

        const resData = await response.json();
        if (!response.ok || resData.code !== 0) {
            console.error("[Tracking] Eroare răspuns TikTok Events API:", resData);
        } else {
            console.log("[Tracking] Eveniment transmis cu succes către TikTok Events API:", data.orderNumber);
        }
    } catch (err) {
        console.error("[Tracking] Eroare la trimiterea evenimentului TikTok Events API:", err);
    }
}
