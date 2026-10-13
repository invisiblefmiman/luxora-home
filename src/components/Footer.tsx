"use client";

import Link from "next/link";
import { PRODUCT_CONFIG } from "@/config/product";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4 md:col-span-1">
                    <span className="text-xl font-bold text-white tracking-tight">
                        {PRODUCT_CONFIG.brandName}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Soluții moderne pentru o casă mai curată și un stil de viață mai simplu. Magazin oficial dedicat produselor de înaltă utilitate.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigare</h4>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/" className="hover:text-white transition-colors">Acasă</Link></li>
                        <li><Link href="/produs/perie-electrica" className="hover:text-white transition-colors">Pagina Produsului</Link></li>
                        <li><Link href="/comanda" className="hover:text-white transition-colors">Formular Comandă</Link></li>
                        <li><Link href="/despre" className="hover:text-white transition-colors">Despre LUXORA HOME</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Informații Utile</h4>
                    <ul className="space-y-2 text-xs">
                        <li><Link href="/livrare" className="hover:text-white transition-colors">Livrare & Transport</Link></li>
                        <li><Link href="/retur" className="hover:text-white transition-colors">Politica de Retur</Link></li>
                        <li><Link href="/termeni-si-conditii" className="hover:text-white transition-colors">Termeni și Condiții</Link></li>
                        <li><Link href="/politica-de-confidentialitate" className="hover:text-white transition-colors">Politica de Confidențialitate</Link></li>
                        <li><Link href="/cookies" className="hover:text-white transition-colors">Politica de Cookies</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Date Companie</h4>
                    <div className="space-y-2 text-xs text-slate-400">
                        <p><strong className="text-slate-300">Firma:</strong> {PRODUCT_CONFIG.contactInfo.companyName}</p>
                        <p><strong className="text-slate-300">CUI:</strong> {PRODUCT_CONFIG.contactInfo.cui}</p>
                        <p><strong className="text-slate-300">Adresă:</strong> {PRODUCT_CONFIG.contactInfo.address}</p>
                        <p><strong className="text-slate-300">Email:</strong> {PRODUCT_CONFIG.contactInfo.email}</p>
                        <p><strong className="text-slate-300">Telefon:</strong> {PRODUCT_CONFIG.contactInfo.phone}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>© {new Date().getFullYear()} {PRODUCT_CONFIG.brandName}. Toate drepturile rezervate.</p>
                    
                    {/* Link-uri legale obligatorii ANPC SAL & SOL */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-1">
                        <a
                            href="https://anpc.ro/ce-este-sal/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors text-[11px] font-medium"
                            title="Soluționarea Alternativă a Litigiilor"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>ANPC - SAL</span>
                        </a>
                        <a
                            href="https://ec.europa.eu/consumers/odr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors text-[11px] font-medium"
                            title="Soluționarea Online a Litigiilor"
                        >
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>ANPC - SOL</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <span>Plată securizată</span>
                        <span>•</span>
                        <span>Livrare prin Curier Rapid</span>
                        <span>•</span>
                        <span>Plată Ramburs</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
