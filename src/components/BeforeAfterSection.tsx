"use client";

import Image from "next/image";
import { PRODUCT_CONFIG } from "@/config/product";

export function BeforeAfterSection() {
    return (
        <section className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
                        Comparație vizuală
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Rezultate vizibile pe suprafețele tale
                    </p>
                    <p className="text-slate-600 text-sm">
                        Exemplificare orientativă a eficienței curățării pe rosturi și plăci ceramice.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100">
                            <Image
                                src={PRODUCT_CONFIG.images.before}
                                alt="Înainte de curățare"
                                fill
                                className="object-cover"
                            />
                            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Înainte
                            </span>
                        </div>
                        <div className="px-2">
                            <h3 className="font-bold text-slate-900">Rosturi și gresie murdară</h3>
                            <p className="text-xs text-slate-500 mt-1">Depuneri de murdărie și calcar greu de îndepărtat manual.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-4 border border-blue-200 shadow-sm space-y-3">
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100">
                            <Image
                                src={PRODUCT_CONFIG.images.after}
                                alt="După curățare"
                                fill
                                className="object-cover"
                            />
                            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                După curățare
                            </span>
                        </div>
                        <div className="px-2">
                            <h3 className="font-bold text-slate-900">Suprafață curată și strălucitoare</h3>
                            <p className="text-xs text-slate-500 mt-1">Curățare rapidă obținută cu ajutorul periei rotative.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
