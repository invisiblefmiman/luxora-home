interface SMSParams {
    phone: string;
    orderNumber: string;
    totalPrice: number;
}

/**
 * Trimite SMS de confirmare comanda catre client (SMSLink / Twilio / Custom Provider)
 */
export async function sendOrderSMS(params: SMSParams): Promise<{ success: boolean; reason?: string }> {
    const smsApiKey = process.env.SMS_API_KEY;
    const smsConnectionId = process.env.SMSLINK_CONNECTION_ID || process.env.SMS_CONNECTION_ID;

    const message = `Comanda ta LUXORA HOME ${params.orderNumber} in valoare de ${params.totalPrice.toFixed(2)} lei a fost inregistrata. Vei primi coletul in 1-2 zile lucratoare.`;

    if (!smsApiKey) {
        console.log(`[SMS] Provider SMS neconfigurat. SMS-ul catre ${params.phone} a fost omis: "${message}"`);
        return { success: false, reason: "NOT_CONFIGURED" };
    }

    try {
        let cleanPhone = params.phone.replace(/\D/g, "");
        if (cleanPhone.startsWith("07") && cleanPhone.length === 10) {
            cleanPhone = "40" + cleanPhone;
        }

        const url = new URL("https://secure.smslink.ro/sms/gateway/communicate/index.php");
        url.searchParams.append("connection_id", smsConnectionId || "");
        url.searchParams.append("password", smsApiKey);
        url.searchParams.append("to", cleanPhone);
        url.searchParams.append("message", message);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(url.toString(), {
            method: "GET",
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const resText = await response.text();

        if (response.ok) {
            console.log(`[SMS] SMS trimis cu succes catre ${cleanPhone} (Ordin: ${params.orderNumber})`);
            return { success: true };
        } else {
            console.error(`[SMS] Eroare la trimitere SMS (${response.status}):`, resText);
            return { success: false, reason: resText };
        }
    } catch (err) {
        console.error("[SMS] Exceptie la trimitere SMS:", err);
        return { success: false, reason: String(err) };
    }
}
