import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";
import { Truck, Clock, ShieldCheck } from "lucide-react";

export default function LivrarePage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            Informații Utile
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Politica de Livrare & Transport
                        </h1>
                        <p className="text-slate-600 text-sm max-w-lg mx-auto">
                            Livrăm rapid produsele comandate direct la ușa ta pe întreg teritoriul României.
                        </p>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-blue-600" />
                                Modalități și Timp de Livrare
                            </h2>
                            <p>
                                Toate comenzile plasate pe site-ul <strong>{PRODUCT_CONFIG.brandName}</strong> sunt livrate prin servicii de curierat rapid (Sameday, Fan Courier sau Cargus).
                            </p>
                            <p>
                                Timpul estimat de livrare este de <strong>{PRODUCT_CONFIG.shipping.estimatedDays}</strong> din momentul confirmării comenzii. Comenzile plasate în zilele de weekend sau sărbători legale vor fi procesate în prima zi lucrătoare.
                            </p>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Costul Transportului
                            </h2>
                            <p>
                                Taxa fixă de livrare pentru orice localitate din România este de <strong>{PRODUCT_CONFIG.shipping.deliveryFee.toFixed(2)} lei</strong>. Nu se percep taxe suplimentare pentru kilometri exteriori.
                            </p>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                Urmărirea Coletului & Primirea
                            </h2>
                            <p>
                                După predarea coletului către curier, vei primi un SMS/Email cu numărul AWB pentru urmărirea expediției. La livrare, poți achita comenzile în sistem Ramburs (cash sau card la curier).
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
