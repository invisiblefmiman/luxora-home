import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CookiesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Politica de Cookies
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Informații despre modul în care utilizăm modulele cookie pentru a îmbunătăți experiența de navigare.
                        </p>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">Ce sunt Cookie-urile?</h2>
                            <p>
                                Cookie-urile sunt fișiere text de mici dimensiuni stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută la funcționarea optimă a coșului de cumpărături și la salvarea preferințelor.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">Tipuri de Cookie-uri Utilizate</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Cookie-uri esențiale:</strong> necesare pentru funcționarea cosului și checkout-ului.</li>
                                <li><strong>Cookie-uri de analiză:</strong> utilizate pentru a măsura performanța site-ului (ex: Google Analytics).</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
