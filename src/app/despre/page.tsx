import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";
import { Sparkles, Shield, Heart } from "lucide-react";

export default function DesprePage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Povestea Noastră
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Despre {PRODUCT_CONFIG.brandName}
                        </h1>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
                            Misiunea noastră este să aducem în casele din România soluții inteligente, practice și moderne care să reducă timpul irosit pe curățenia obositoare.
                        </p>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
                        <h2 className="text-xl font-bold text-slate-900">De ce am creat LUXORA HOME?</h2>
                        <p>
                            Știm cât de frustrant este să petreci ore întregi frecând rosturile din baie, faianța sau depunerile persistente de calcar de pe robineți. Am căutat un dispozitiv versatil, puternic și ușor de mânuit care să transforme această corvoadă într-o sarcină rapidă și simplă.
                        </p>
                        <p>
                            Peria electrică rotativă 5-în-1 LUXORA HOME a fost selectată având în vedere nevoile gospodăriilor din România: un produs rezistent, reîncărcabil și echipat cu accesorii potrivite pentru toate tipurile de suprafețe.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Calitate & Utilitate</h3>
                            <p className="text-xs text-slate-500">Selectăm doar produse care rezolvă probleme reale.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Transparență Totală</h3>
                            <p className="text-xs text-slate-500">Specificații clare și suport dedicat pentru clienți.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Satisfacția Clientului</h3>
                            <p className="text-xs text-slate-500">Ne asigurăm că fiecare colet ajunge în siguranță la tine.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
