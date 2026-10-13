"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("luxora_cookie_consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 0);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("luxora_cookie_consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("luxora_cookie_consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <aside
            aria-label="Setări confidențialitate și module cookie"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-700/80 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl shrink-0 mt-0.5">
                    <Cookie className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-xs">
                    <h3 className="font-bold text-sm text-white flex items-center justify-between">
                        Confidențialitatea ta contează
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                        Folosim module cookie pentru a optimiza funcționarea magazinului și pentru a măsura performanța campaniilor noastre. Detalii în{" "}
                        <Link href="/cookies" className="text-blue-400 underline hover:text-blue-300">
                            Politica de Cookies
                        </Link>
                        .
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-xs text-center"
                        >
                            Accept toate
                        </button>
                        <button
                            type="button"
                            onClick={handleDecline}
                            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors text-xs text-center"
                        >
                            Doar esențiale
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDecline}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                    aria-label="Închide banner cookie"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </aside>
    );
}
