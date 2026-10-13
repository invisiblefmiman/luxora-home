"use client";

import Link from "next/link";
import { PRODUCT_CONFIG } from "@/config/product";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function StickyMobileCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl md:hidden">
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
                <div>
                    <span className="text-xs text-slate-500 block leading-tight font-medium">Preț special</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-slate-900 leading-none">
                            {PRODUCT_CONFIG.pricing.formattedCurrentPrice}
                        </span>
                        <span className="text-xs line-through text-slate-400">
                            {PRODUCT_CONFIG.pricing.formattedOldPrice}
                        </span>
                    </div>
                </div>

                <Link
                    href="/comanda"
                    className="flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md active:scale-95 touch-manipulation select-none transition-transform text-center uppercase tracking-wide"
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>COMANDĂ ACUM</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
