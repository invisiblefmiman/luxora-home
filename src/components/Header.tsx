"use client";

import Link from "next/link";
import { PRODUCT_CONFIG } from "@/config/product";
import { ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
            <div className="bg-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-slate-200">
                    <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-blue-400" /> Livrare rapidă în toată România
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Plată la livrare (Ramburs)
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                        {PRODUCT_CONFIG.brandName}
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                        Acasă
                    </Link>
                    <Link href="/produs/perie-electrica" className="hover:text-blue-600 transition-colors">
                        Produs
                    </Link>
                    <Link href="/despre" className="hover:text-blue-600 transition-colors">
                        Despre Noi
                    </Link>
                    <Link href="/contact" className="hover:text-blue-600 transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/comanda"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Comandă Acum</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
