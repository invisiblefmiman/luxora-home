"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { PRODUCT_CONFIG } from "@/config/product";
import { Check, ShieldCheck, Truck, ArrowRight, Minus, Plus, RefreshCw } from "lucide-react";

export default function ProductPage() {
    const [selectedImage, setSelectedImage] = useState(PRODUCT_CONFIG.images.hero);
    const [quantity, setQuantity] = useState(1);

    const images = [
        PRODUCT_CONFIG.images.hero,
        PRODUCT_CONFIG.images.attachments,
        PRODUCT_CONFIG.images.before,
        PRODUCT_CONFIG.images.after,
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
                        <Link href="/" className="hover:text-slate-900">Acasă</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-semibold">{PRODUCT_CONFIG.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
                        {/* Gallery */}
                        <div className="lg:col-span-6 space-y-4">
                            <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                <Image
                                    src={selectedImage}
                                    alt={PRODUCT_CONFIG.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                                {PRODUCT_CONFIG.badge}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {PRODUCT_CONFIG.name}
                            </h1>

                            <p className="text-slate-600 text-sm leading-relaxed">
                                {PRODUCT_CONFIG.subtitle}
                            </p>

                            {/* Pricing */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-slate-500 block">Preț special</span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-slate-900">
                                            {PRODUCT_CONFIG.pricing.formattedCurrentPrice}
                                        </span>
                                        <span className="text-base text-slate-400 line-through">
                                            {PRODUCT_CONFIG.pricing.formattedOldPrice}
                                        </span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                    Economisești {PRODUCT_CONFIG.pricing.saveAmount}
                                </span>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Selectează cantitatea
                                </label>
                                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-slate-100 text-slate-700 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-6 font-extrabold text-slate-900 text-base">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-slate-100 text-slate-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="space-y-3 pt-2">
                                <Link
                                    href={`/comanda?qty=${quantity}`}
                                    className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/25 active:scale-98 transition-all uppercase tracking-wide text-center"
                                >
                                    <span>COMANDĂ ACUM ({quantity > 1 ? `${(PRODUCT_CONFIG.pricing.currentPrice * quantity).toFixed(2)} lei` : PRODUCT_CONFIG.pricing.formattedCurrentPrice})</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                                    <span className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/60 justify-center">
                                        <Truck className="w-4 h-4 text-blue-600" /> Livrare 24-48h
                                    </span>
                                    <span className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/60 justify-center">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Plată la livrare
                                    </span>
                                </div>
                            </div>

                            {/* Specifications Box */}
                            <div className="border-t border-slate-200 pt-6 space-y-4">
                                <h3 className="font-bold text-slate-900 text-base">Specificații & Detalii Tehnice</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-slate-500 block">Autonomie:</span>
                                        <strong className="text-slate-900">{PRODUCT_CONFIG.editableSpecs.autonomy}</strong>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-slate-500 block">Timp Încărcare:</span>
                                        <strong className="text-slate-900">{PRODUCT_CONFIG.editableSpecs.chargingTime}</strong>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-slate-500 block">Capete incluse:</span>
                                        <strong className="text-slate-900">{PRODUCT_CONFIG.editableSpecs.headCount} capete interschimbabile</strong>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-slate-500 block">Rezistență la Apă:</span>
                                        <strong className="text-slate-900">{PRODUCT_CONFIG.editableSpecs.waterResistance}</strong>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                                        <span className="text-slate-500 block">Garanție:</span>
                                        <strong className="text-slate-900">{PRODUCT_CONFIG.editableSpecs.warranty}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Package contents */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-900 text-base">Conținutul pachetului</h3>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    {PRODUCT_CONFIG.editableSpecs.packageContents.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Shipping & Returns */}
                            <div className="border-t border-slate-200 pt-6 space-y-3 text-xs text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-blue-600" />
                                    <span><strong>Livrare rapidă:</strong> prin Curier Rapid ({PRODUCT_CONFIG.shipping.estimatedDays}).</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-blue-600" />
                                    <span><strong>Drept de retur:</strong> 14 zile conform ordonanței de urgență.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <FAQSection />
                    </div>
                </div>
            </main>

            <Footer />
            <StickyMobileCTA />
        </div>
    );
}
