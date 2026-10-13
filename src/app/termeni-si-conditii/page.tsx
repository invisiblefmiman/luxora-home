import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";

export default function TermeniPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Termeni și Condiții
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Informații legale privind utilizarea site-ului și achiziționarea produselor.
                        </p>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">1. Date Operator</h2>
                            <p>
                                Site-ul este operat de <strong>{PRODUCT_CONFIG.contactInfo.companyName}</strong>, CUI <strong>{PRODUCT_CONFIG.contactInfo.cui}</strong>, cu sediul în <strong>{PRODUCT_CONFIG.contactInfo.address}</strong>.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">2. Dispoziții Generale</h2>
                            <p>
                                Prin plasarea unei comenzi pe site-ul nostru, sunteți de acord cu termenii și condițiile prezentate în această pagină. Toate prețurile afișate sunt exprimate în LEI și includ taxele aplicabile conform legislației.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">3. Comandă și Plată</h2>
                            <p>
                                Plasarea comenzii se realizează prin completarea formularului de checkout. Plata se poate efectua la livrare (Ramburs) sau online prin card bancar atunci când este activat procesatorul de plăți.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
