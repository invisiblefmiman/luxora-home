import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function ReturPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Garanție & Retur
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Politica de Retur & Dreptul de Retragere
                        </h1>
                        <p className="text-slate-600 text-sm max-w-lg mx-auto">
                            Cumpără cu încredere. Ai dreptul legal de a te retrage din contract în termen de 14 zile.
                        </p>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-blue-600" />
                                Dreptul de Retur (14 zile)
                            </h2>
                            <p>
                                Conform Ordonanței de Urgență nr. 34/2014 privind drepturile consumatorilor, beneficiați de o perioadă de <strong>14 zile calendaristice</strong> pentru a vă retrage din contract fără a fi nevoit să justificați decizia de retragere.
                            </p>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                Condiții de Acceptare a Returului
                            </h2>
                            <p>
                                Produsul returnat trebuie să fie în aceeași stare în care a fost livrat, complet, cu toate accesoriile și ambalajul original intact. Din motive de igienă și protecție a sănătății, produsele folosite sau deteriorate nu pot fi acceptate pentru retur dacă au fost utilizate pe suprafețe murdare.
                            </p>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                Procedura de Retur
                            </h2>
                            <p>
                                Pentru a iniția un retur, contactați-ne la <strong>{PRODUCT_CONFIG.contactInfo.email}</strong> sau la telefon <strong>{PRODUCT_CONFIG.contactInfo.phone}</strong>. În urma cererii, un curier va fi trimis la adresa dumneavoastră pentru a ridica coletul. Returnarea banilor se face în maximum 14 zile de la recepția și verificarea produsului.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
