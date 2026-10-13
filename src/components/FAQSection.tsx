"use client";

import { useState } from "react";
import { PRODUCT_CONFIG } from "@/config/product";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "Ce conține pachetul?",
            a: PRODUCT_CONFIG.editableSpecs.packageContents.join(", "),
        },
        {
            q: "Pentru ce suprafețe este potrivită?",
            a: "Este potrivită pentru gresie, faianță, rosturi, cadă, chiuvetă, sticla cabinei de duș, precum și plite sau alte suprafețe dure din bucătărie.",
        },
        {
            q: "Cum se încarcă peria?",
            a: `Peria se încarcă prin cablul USB inclus în pachet. Timp de încărcare: ${PRODUCT_CONFIG.editableSpecs.chargingTime}.`,
        },
        {
            q: "Cât durează livrarea?",
            a: `Livrarea se face prin curier rapid pe tot teritoriul României și durează în medie ${PRODUCT_CONFIG.shipping.estimatedDays}.`,
        },
        {
            q: "Cum funcționează returul?",
            a: "Beneficiezi de drept de retur în termen de 14 zile calendaristice de la primirea coletului, conform legislației în vigoare.",
        },
        {
            q: "Există garanție pentru produs?",
            a: `Da, produsul beneficiază de ${PRODUCT_CONFIG.editableSpecs.warranty}.`,
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs uppercase tracking-widest font-bold text-blue-600">Claritate & Încredere</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        Întrebări Frecvente
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                layout
                                key={i}
                                className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${isOpen ? "border-blue-500 shadow-blue-500/10 ring-2 ring-blue-500/10" : "border-slate-200 hover:border-blue-300"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(i)}
                                    className="w-full text-left p-6 font-bold text-slate-800 flex items-center justify-between gap-4 transition-colors"
                                >
                                    <span className="flex items-center gap-4 text-lg">
                                        <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <HelpCircle className="w-5 h-5 shrink-0" />
                                        </div>
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                                            }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 pt-0 text-slate-600 text-base leading-relaxed ml-[3.25rem]">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

