import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";

export default function PoliticaConfidentialitatePage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Politica de Confidențialitate (GDPR)
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Protecția datelor cu caracter personal ale clienților noștri.
                        </p>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">1. Prelucrarea Datelor Personale</h2>
                            <p>
                                <strong>{PRODUCT_CONFIG.contactInfo.companyName}</strong> procesează datele cu caracter personal (nume, prenume, telefon, adresă de livrare, email) exclusiv în scopul procesării și expedierii comenziilor dumneavoastră.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">2. Drepturile Utilizatorilor</h2>
                            <p>
                                Conform Regulamentului GDPR (UE) 2016/679, aveți dreptul de acces, rectificare, ștergere a datelor sau restricționare a prelucrării. Pentru exercitarea acestor drepturi, ne puteți contacta la <strong>{PRODUCT_CONFIG.contactInfo.email}</strong>.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
