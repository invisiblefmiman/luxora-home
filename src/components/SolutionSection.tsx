"use client";

import Image from "next/image";
import { PRODUCT_CONFIG } from "@/config/product";
import { CheckCircle2, RotateCw, Sparkles } from "lucide-react";

export function SolutionSection() {
    return (
        <section className="py-16 lg:py-24 bg-slate-900 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Soluția modernă</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Lasă peria să facă munca grea.
                        </h2>

                        <p className="text-slate-300 text-base leading-relaxed">
                            Peria electrică rotativă LUXORA HOME preia tot efortul fizic. Datorită mișcării de rotație automate și capetelor adaptabile, murdăria este îndepărtată fără presiune excesivă din partea ta.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                                    <RotateCw className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">Mecanism rotativ eficient</h4>
                                    <p className="text-slate-400 text-sm">Curăță prin frecare rapidă fără să zgârie suprafețele compatibile.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">Ușurință în utilizare</h4>
                                    <p className="text-slate-400 text-sm">Design ergonomic, ușor de manevrat chiar și în colțurile greu accesibile.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative rounded-3xl bg-slate-800 p-4 border border-slate-700 shadow-2xl">
                            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900">
                                <Image
                                    src={PRODUCT_CONFIG.images.attachments}
                                    alt="Capete perie electrică"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-xs text-slate-400 text-center mt-3 font-medium">
                                Set cu 5 capete interschimbabile proiectate pentru baie, bucătărie și colțuri.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
