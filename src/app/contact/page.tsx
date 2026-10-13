"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";
import { Mail, Phone, MapPin, Building, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus({ type: "error", text: "Vă rugăm să completați toate câmpurile." });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setStatus({ type: "success", text: data.message });
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setStatus({ type: "error", text: data.error || "A apărut o eroare la trimitere." });
            }
        } catch {
            setStatus({ type: "error", text: "Nu s-a putut trimite mesajul. Verificați conexiunea la internet." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Suport Clienți
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Contactează-ne
                        </h1>
                        <p className="text-slate-600 text-sm max-w-lg mx-auto">
                            Echipa noastră îți stă la dispoziție pentru orice întrebare legată de comanda sau produsul tău.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Informații de Contact
                            </h2>

                            <div className="space-y-4 text-sm text-slate-700">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 text-xs uppercase tracking-wider">Email Support</strong>
                                        <a href={`mailto:${PRODUCT_CONFIG.contactInfo.email}`} className="text-blue-600 hover:underline">
                                            {PRODUCT_CONFIG.contactInfo.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 text-xs uppercase tracking-wider">Telefon</strong>
                                        <a href={`tel:${PRODUCT_CONFIG.contactInfo.phone}`} className="text-blue-600 hover:underline">
                                            {PRODUCT_CONFIG.contactInfo.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 text-xs uppercase tracking-wider">Adresă</strong>
                                        <span>{PRODUCT_CONFIG.contactInfo.address}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="block text-slate-900 text-xs uppercase tracking-wider">Date Companie</strong>
                                        <span>{PRODUCT_CONFIG.contactInfo.companyName} | CUI: {PRODUCT_CONFIG.contactInfo.cui}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Trimite un Mesaj
                            </h2>

                            {status && (
                                <div
                                    className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                                        status.type === "success"
                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                            : "bg-red-50 text-red-800 border border-red-200"
                                    }`}
                                >
                                    {status.type === "success" ? (
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                                    )}
                                    <span>{status.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Nume complet
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Numele tău"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nume@exemplu.ro"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Mesaj
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Scrie mesajul tău aici..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isSubmitting ? "SE TRIMITE..." : "TRIMITE MESAJUL"}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
