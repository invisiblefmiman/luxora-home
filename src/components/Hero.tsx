"use client";

import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CONFIG } from "@/config/product";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star } from "lucide-react";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-50 pt-8 pb-16 lg:py-24 bg-grid-pattern isolate">
            {/* Background glowing accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[100px] rounded-full point-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        className="lg:col-span-7 space-y-6 text-left relative z-10"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>{PRODUCT_CONFIG.badge}</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                            Curățenie <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">fără efort.</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-lg sm:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                            {PRODUCT_CONFIG.subtitle}
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700 pt-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg shadow-xs border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 5 Capete interschimbabile
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg shadow-xs border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Utilizare Baie & Bucătărie
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg shadow-xs border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Design Wireless
                            </span>
                        </motion.div>

                        <motion.div variants={fadeUp} className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href="/comanda"
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-blue-600/30 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative z-10">COMANDĂ ACUM</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a
                                href="#cum-functioneaza"
                                className="inline-flex items-center justify-center px-6 py-4 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 font-bold text-lg rounded-2xl shadow-sm hover:shadow-md transition-all text-center backdrop-blur-sm"
                            >
                                VEZI CUM FUNCȚIONEAZĂ
                            </a>
                        </motion.div>

                        <motion.div variants={fadeUp} className="pt-6 flex items-center gap-3">
                            <div className="flex bg-white px-3 py-1.5 rounded-lg shadow-xs border border-slate-100">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                                <span className="ml-2 text-xs font-bold text-slate-800">4.9/5</span>
                            </div>
                            <span className="text-sm text-slate-500 font-medium">
                                Concept premium orientat spre eficiență.
                            </span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-white p-3 shadow-2xl shadow-blue-900/10 border border-slate-100/60 transition-transform duration-500 hover:-translate-y-2 hover:shadow-3xl">
                            <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                                <Image
                                    src={PRODUCT_CONFIG.images.hero}
                                    alt={PRODUCT_CONFIG.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute -top-4 -right-4 bg-slate-900 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700/50 rotate-3 z-20"
                            >
                                <span className="text-xs font-semibold text-slate-400 block line-through mb-0.5">
                                    {PRODUCT_CONFIG.pricing.formattedOldPrice}
                                </span>
                                <span className="text-2xl font-black text-amber-400">
                                    {PRODUCT_CONFIG.pricing.formattedCurrentPrice}
                                </span>
                            </motion.div>

                            <div className="p-5 bg-gradient-to-b from-white to-slate-50 rounded-b-2xl flex items-center justify-between text-sm text-slate-600 font-bold border-t border-slate-100">
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" /> Plată la livrare
                                </span>
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Economisești {PRODUCT_CONFIG.pricing.saveAmount}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

