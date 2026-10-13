"use client";

import Link from "next/link";
import { PRODUCT_CONFIG } from "@/config/product";
import { ArrowRight, Check, ShieldCheck, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function OfferCard() {
    return (
        <section className="py-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-14 shadow-2xl shadow-blue-900/20 border border-slate-700/50 overflow-hidden group"
                >
                    {/* Glowing Accent */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 text-center space-y-8">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-400/20"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-950 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-950"></span>
                            </span>
                            {PRODUCT_CONFIG.badge || "Ofertă Limitată"}
                        </motion.div>

                        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                            {PRODUCT_CONFIG.name}
                        </h2>

                        <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
                            Comandă acum și primești setul complet cu 5 capete interschimbabile la preț promoțional.
                        </p>

                        <div className="py-6 inline-flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl rounded-3xl px-12 border border-white/10 shadow-inner">
                            <span className="text-sm text-amber-400 font-semibold uppercase tracking-wider mb-2">Preț special de lansare</span>
                            <div className="flex items-baseline gap-4 mt-1">
                                <span className="text-5xl sm:text-7xl font-black text-white drop-shadow-md">
                                    {PRODUCT_CONFIG.pricing.formattedCurrentPrice}
                                </span>
                                <span className="text-xl text-slate-500 line-through decoration-red-500/50 decoration-2">
                                    {PRODUCT_CONFIG.pricing.formattedOldPrice}
                                </span>
                            </div>
                            <span className="text-sm text-emerald-400 font-bold mt-3 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                Ai salvat {PRODUCT_CONFIG.pricing.saveAmount}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-medium text-slate-300 max-w-2xl mx-auto py-4">
                            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                                <Clock className="w-5 h-5 text-amber-400" /> Stoc Limitat!
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                                <Truck className="w-5 h-5 text-amber-400" /> Expediere Rapidă 24h
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                                <ShieldCheck className="w-5 h-5 text-amber-400" /> Garanție 2 Ani
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="pt-4"
                        >
                            <Link
                                href="/comanda"
                                className="relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xl rounded-2xl shadow-xl shadow-amber-500/20 transition-all uppercase tracking-wider group overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative z-10">VREAU PERIA</span>
                                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <p className="text-[11px] text-slate-500 pt-4">
                            * Ofertă valabilă în limita stocului disponibil.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

