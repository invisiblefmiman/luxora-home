"use client";

import { Bath, Utensils, Grid, CircleDot, Shield, Sparkles } from "lucide-react";

export function MultiUseSection() {
    const uses = [
        { icon: Bath, title: "Baie & Cabine Duș", desc: "Curăță sticla dușului și depunerile de pe baterii." },
        { icon: CircleDot, title: "Cadă & Chiuvetă", desc: "Îndepărtează urmele de săpun și petele fără efort." },
        { icon: Grid, title: "Gresie & Faianță", desc: "Acoperă suprafețe mari rapid cu peria lată." },
        { icon: Sparkles, title: "Rosturi dificile", desc: "Peria conică pătrunde adânc în spațiile dintre plăci." },
        { icon: Utensils, title: "Bucătărie & Blat", desc: "Curăță eficient plita, chiuveta și blaturile rezistente." },
        { icon: Shield, title: "Alte suprafețe", desc: "Jante auto sau mobilier de grădină compatibil." },
    ];

    return (
        <section className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
                        Versatilitate maximă
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Un singur produs, mai multe utilizări
                    </p>
                    <p className="text-slate-600 text-sm">
                        Fiecare colț al casei beneficiază de peria potrivită.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {uses.map((u, i) => {
                        const Icon = u.icon;
                        return (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 hover:border-blue-500 transition-colors shadow-xs"
                            >
                                <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">{u.title}</h3>
                                <p className="text-slate-500 text-xs">{u.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
