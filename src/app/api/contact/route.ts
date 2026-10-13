import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { PRODUCT_CONFIG } from "@/config/product";
import { checkRateLimit } from "@/lib/ratelimit";

const contactSchema = z.object({
    name: z.string().trim().min(2, "Introduceți un nume valid."),
    email: z.string().trim().email("Introduceți o adresă de email validă."),
    message: z.string().trim().min(5, "Mesajul trebuie să conțină cel puțin 5 caractere."),
});

export async function POST(request: Request) {
    try {
        const forwarded = request.headers.get("x-forwarded-for");
        const clientIp = (forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")) || "127.0.0.1";

        // Rate limit: max 4 mesaje de contact / 5 minute
        const rateCheck = await checkRateLimit(`contact-${clientIp}`, 4, 300000);
        if (!rateCheck.success) {
            return NextResponse.json(
                { success: false, error: "Ați trimis prea multe mesaje. Vă rugăm să așteptați câteva minute." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const parseResult = contactSchema.safeParse(body);

        if (!parseResult.success) {
            const firstError = parseResult.error.issues[0]?.message || "Date nevalide.";
            return NextResponse.json({ success: false, error: firstError }, { status: 400 });
        }

        const { name, email, message } = parseResult.data;

        // Trimitere email prin Resend daca este configurat
        const apiKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || PRODUCT_CONFIG.contactInfo.email;
        const fromEmail = process.env.RESEND_FROM_EMAIL || "contact@luxorahome.ro";

        if (apiKey && adminEmail) {
            try {
                const resend = new Resend(apiKey);
                await resend.emails.send({
                    from: `${PRODUCT_CONFIG.brandName} Contact <${fromEmail}>`,
                    to: [adminEmail],
                    replyTo: email,
                    subject: `[MESAJ SUPORT] De la ${name} (${email})`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h3 style="color: #2563eb; margin-top: 0;">Mesaj nou de contact de pe site</h3>
                            <p><strong>Nume:</strong> ${name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>IP:</strong> ${clientIp}</p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                            <p style="white-space: pre-wrap; color: #334155;">${message}</p>
                        </div>
                    `,
                });
            } catch (emailErr) {
                console.error("[Contact API] Eroare la trimiterea email-ului prin Resend:", emailErr);
            }
        } else {
            console.log(`[Contact API] Resend neconfigurat. Mesaj primit de la ${name} (${email}): ${message}`);
        }

        return NextResponse.json({
            success: true,
            message: "Mesajul tău a fost transmis cu succes! Te vom contacta în cel mai scurt timp.",
        });
    } catch (err) {
        console.error("Eroare API Contact:", err);
        return NextResponse.json(
            { success: false, error: "A apărut o eroare la trimiterea mesajului. Vă rugăm să încercați din nou." },
            { status: 500 }
        );
    }
}
